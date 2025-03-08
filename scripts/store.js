// Floating Music Notes
function createNote() {
    const note = document.createElement("div");
    note.classList.add("note");
    note.textContent = "🎵";
    note.style.left = `${Math.random() * 100}vw`;
    note.style.animationDuration = `${Math.random() * 3 + 5}s`;
    document.getElementById("floating-notes").appendChild(note);
  
    note.addEventListener("animationend", () => {
      note.remove();
    });
  }
  
  setInterval(createNote, 1000);
  
  // Search Functionality
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const productGrid = document.getElementById("product-grid");
  
  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const products = productGrid.querySelectorAll(".product-item");
  
    products.forEach((product) => {
      const productName = product.getAttribute("data-name").toLowerCase();
      if (productName.includes(searchTerm)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  });
  
  // Stripe Integration
  const stripe = Stripe('pk_live_51R0Cz6GmDAIxa3d4MH4nJzIF3MWWI3KxOFKvZXCdCTg2bkYJohNrYPi92R92G5ev1BZ0ZDQ8GGnSZWOE3xO8C1v900suoAyobD'); // Replace with your Stripe public key
  
  const buyButtons = document.querySelectorAll(".buy-button");
  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
  
      stripe.redirectToCheckout({
        lineItems: [{ price: productId, quantity: 1 }],
        mode: "payment",
        successUrl: "https://abejaloca.com/success", // Replace with your success URL
        cancelUrl: "https://abejaloca.com/cancel", // Replace with your cancel URL
      }).then((result) => {
        if (result.error) {
          alert(result.error.message);
        }
      });
    });
  });