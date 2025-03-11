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

// Translations (defined at the top)
const translations = {
  es: {
    welcome: "¡Bienvenido a AbejaLoca.com!",
    description: "¡Tu destino para los ritmos más locos!",
    home: "Inicio",
    store: "Tienda",
    donation: "Donación",
    tos: "Términos de Servicio",
    privacy: "Política de Privacidad",
    agreement: "Acuerdo de Usuario",
    featured: "Canción Destacada",
    trackName: "1500 canciones en un USB",
    trackDescription: "1500 canciones en un USB para que disfrutes en cualquier lugar",
    buyNow: "Comprar Ahora",
    footer: "2025 AbejaLoca.com. Todos los derechos reservados.",
  },
  en: {
    welcome: "Welcome to AbejaLoca.com!",
    description: "Your destination for the craziest beats!",
    home: "Home",
    store: "Store",
    donation: "Donation",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    agreement: "User Agreement",
    featured: "Featured Track",
    trackName: "1500 Songs in a USB",
    trackDescription: "1500 songs in a USB for you to enjoy anywhere!",
    buyNow: "Buy Now",
    footer: "2025 AbejaLoca.com. All rights reserved.",
  },
};

// Function to apply the selected language
function applyLanguage(language) {
  const elements = document.querySelectorAll("[data-lang]");
  elements.forEach((element) => {
    const translation = translations[language][element.getAttribute("data-lang")];
    if (translation) {
      element.textContent = translation;
    }
  });
}

// Check if the user has already selected a language
const userLanguage = localStorage.getItem("language");

// Apply the saved language immediately (before the page loads)
if (userLanguage) {
  applyLanguage(userLanguage);
}

// Show the pop-up if no language is selected
const popup = document.getElementById("language-popup");
if (!userLanguage) {
  popup.style.display = "flex";

  // Handle language selection
  document.getElementById("english-btn").addEventListener("click", () => {
    localStorage.setItem("language", "en");
    popup.style.display = "none";
    applyLanguage("en");
    location.reload(); // Reload the page to apply changes
  });

  document.getElementById("spanish-btn").addEventListener("click", () => {
    localStorage.setItem("language", "es");
    popup.style.display = "none";
    applyLanguage("es");
    location.reload(); // Reload the page to apply changes
  });
} else {
  popup.style.display = "none"; // Hide the pop-up if language is already selected
}

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

  