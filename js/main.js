document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productsContainer = document.getElementById('productsContainer');
    const productCardTemplate = document.getElementById('productCardTemplate');
    const noResultsMessage = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const priceFilter = document.getElementById('priceFilter');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const logo = document.getElementById('logo');
    const newProductModal = document.getElementById('newProductModal');
    const closeProductModal = document.getElementById('closeProductModal');
    const productForm = document.getElementById('productForm');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const closeNavBtn = document.getElementById('closeNavBtn');

    // State
    let products = [];
    let isDeveloper = false;
    let clickCount = 0;
    let lastClickTime = 0;

    // Initialize the page
    async function init() {
        products = await fetchProducts();
        renderProducts(products);
        populateGenreFilter();
        createBackgroundBees();
        setupEventListeners();
    }

    // Fetch products from API
    async function fetchProducts() {
        try {
            const response = await fetch('/.netlify/functions/get-products');
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Render products to the page
    function renderProducts(productsToRender) {
        productsContainer.innerHTML = '';

        if (productsToRender.length === 0) {
            noResultsMessage.classList.remove('hidden');
            return;
        }

        noResultsMessage.classList.add('hidden');

        productsToRender.forEach(product => {
            const card = productCardTemplate.content.cloneNode(true);
            card.querySelector('.product-image').src = product.image_url;
            card.querySelector('.product-title').textContent = product.title;
            card.querySelector('.product-description').textContent = product.description;
            card.querySelector('.product-genre').textContent = product.genre;
            card.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;
            card.querySelector('.product-link').href = `${product.title.replace(/\s+/g, '')}.html`;

            productsContainer.appendChild(card);
        });
    }

    // Populate genre filter
    function populateGenreFilter() {
        genreFilter.innerHTML = '<option value="">All Genres</option>';
        const genres = [...new Set(products.map(product => product.genre))];
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    // Filter products
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const selectedPriceRange = priceFilter.value;

        let filteredProducts = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm);
            const matchesGenre = selectedGenre === '' || product.genre === selectedGenre;

            let matchesPrice = true;
            if (selectedPriceRange) {
                const [min, max] = selectedPriceRange.split('-').map(Number);
                if (selectedPriceRange.endsWith('+')) {
                    matchesPrice = product.price >= 100;
                } else {
                    matchesPrice = product.price >= min && product.price <= max;
                }
            }

            return matchesSearch && matchesGenre && matchesPrice;
        });

        renderProducts(filteredProducts);
    }

    // Create background bee animations
    function createBackgroundBees() {
        const beeContainer = document.querySelector('.fixed.inset-0');
        const beeCount = 12;

        for (let i = 0; i < beeCount; i++) {
            const bee = document.createElement('div');
            bee.className = 'absolute text-4xl';
            bee.innerHTML = '🐝';

            const size = Math.random() * 2 + 1;
            const startY = Math.random() * 80 + 10;
            const endY = Math.random() * 80 + 10;
            const duration = 15 + Math.random() * 20;
            const delay = Math.random() * 15;
            const zIndex = Math.floor(Math.random() * 10);

            bee.style.fontSize = `${size}rem`;
            bee.style.setProperty('--start-y', `${startY}%`);
            bee.style.setProperty('--end-y', `${endY}%`);
            bee.style.animation = `${i % 3 === 0 ? 'flyDiagonal' : i % 2 === 0 ? 'flyLeft' : 'flyRight'} ${duration}s linear infinite ${delay}s`;
            bee.style.zIndex = zIndex;

            if (i % 3 === 0) {
                bee.style.left = `${Math.random() * 20}%`;
                bee.style.top = '110%';
            } else if (i % 2 === 0) {
                bee.style.left = '110%';
                bee.style.top = `${startY}%`;
            } else {
                bee.style.left = '-10%';
                bee.style.top = `${startY}%`;
            }

            beeContainer.appendChild(bee);
        }
    }

    // Upload image to S3
    async function uploadImage(file) {
        try {
            const response = await fetch('/.netlify/functions/upload-image', {
                method: 'POST',
                body: JSON.stringify({
                    name: file.name,
                    type: file.type,
                    file: await toBase64(file)
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Upload failed');
            return await response.json();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Convert file to base64
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Create new product
    async function createNewProduct(productData) {
        try {
            let imageUrl = productData.image;
            if (typeof productData.image === 'object') {
                const uploadResponse = await uploadImage(productData.image);
                imageUrl = uploadResponse.url;
            }

            const response = await fetch('/.netlify/functions/create-product', {
                method: 'POST',
                body: JSON.stringify({
                    ...productData,
                    image_url: imageUrl,
                    tracklist: productData.tracklist.split('\n')
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to create product');
            return await response.json();
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    // Create product page HTML
    function createProductPage(product) {
        const fileName = `${product.title.replace(/\s+/g, '')}.html`;
        const productPageContent = `<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Abejaloca - ${product.title}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <link rel="stylesheet" href="/styles/main.css">
        </head>
        <body class="bg-amber-50 text-gray-800 font-sans overflow-x-hidden">
            <!-- Page content from your template -->
            <!-- ... rest of your product page template ... -->
        </body>
        </html>`;

        // In a real app, you would save this file to your server
        console.log(`Created product page: ${fileName}`);
        alert(`Product page created: ${fileName}`);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search and filter events
        searchInput.addEventListener('input', filterProducts);
        genreFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
        resetFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            genreFilter.value = '';
            priceFilter.value = '';
            filterProducts();
        });

        // Logo click counter for developer mode
        logo.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime > 1000) {
                clickCount = 0;
            }
            clickCount++;
            lastClickTime = now;

            if (clickCount >= 4) {
                const username = prompt('Enter developer username:');
                const password = prompt('Enter developer password:');

                if (username === 'AbejaAndres' && password === 'Patitofeo') {
                    isDeveloper = true;
                    document.getElementById('newPostBtn').classList.remove('hidden');
                    document.getElementById('mobileNewPostBtn').classList.remove('hidden');
                    alert('Developer mode activated!');
                }

                clickCount = 0;
            }
        });

        // Product form submission
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                title: document.getElementById('productTitle').value,
                description: document.getElementById('productDescription').value,
                genre: document.getElementById('productGenre').value,
                price: parseFloat(document.getElementById('productPrice').value),
                tracklist: document.getElementById('productTracklist').value,
                stripe_button_id: document.getElementById('stripeButtonId').value,
                stripe_publishable_key: document.getElementById('stripePublishableKey').value,
                image: document.getElementById('productImage').files[0]
            };

            try {
                const result = await createNewProduct(formData);
                products = await fetchProducts(); // Refresh products list
                renderProducts(products);
                populateGenreFilter();
                createProductPage(products.find(p => p.id === result.productId));

                productForm.reset();
                newProductModal.classList.add('hidden');
            } catch (error) {
                alert('Error creating product: ' + error.message);
            }
        });

        // Mobile navigation
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.add('open');
        });

        closeNavBtn.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });

        // Modal controls
        closeProductModal.addEventListener('click', () => {
            newProductModal.classList.add('hidden');
        });
    }

    // Initialize the app
    init();
});