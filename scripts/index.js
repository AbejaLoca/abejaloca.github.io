function createNote() {
    const note = document.createElement("div");
    note.classList.add("note");
    note.textContent = "🎵"; // Music note emoji
    note.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    note.style.animationDuration = `${Math.random() * 3 + 5}s`; // Random speed
    document.getElementById("floating-notes").appendChild(note);

    // Remove the note after it finishes animating
    note.addEventListener("animationend", () => {
      note.remove();
    });
  }

  // Create notes at regular intervals
  setInterval(createNote, 2500); // Adjust interval for more/less notes

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
    about: "Sobre AbejaLoca",
    aboutText: "Somos un sello musical que ofrece los ritmos más locos directamente desde la colmena. ¡Nuestra mascota, la Abeja DJ Loca, está aquí para que tu experiencia musical sea inolvidable!",
    mission: "Nuestra Misión",
    missionText: "En AbejaLoca, nuestra misión es crear música que inspire energía, alegría y creatividad...",
    values: "Nuestros Valores",
    creativity: "Creatividad",
    creativityText: "Rompemos barreras para crear sonidos únicos e innovadores.",
    community: "Comunidad",
    communityText: "Creemos en construir una colmena de amantes de la música que se apoyan e inspiran mutuamente.",
    quality: "Calidad",
    qualityText: "Cada canción está elaborada con cuidado para garantizar la mejor experiencia auditiva.",
    fun: "Diversión",
    funText: "La vida es demasiado corta para música aburrida. ¡Nuestros ritmos están diseñados para hacerte sonreír y bailar!",
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
    trackDescription: "1500 Songs in a USB for you to enjoy anywhere!",
    buyNow: "Buy Now",
    about: "About AbejaLoca",
    aboutText: "We are a buzzing music label dedicated to delivering the craziest beats straight from the hive. Our mascot, the Crazy Bee DJ, is here to make sure your music experience is unforgettable!",
    mission: "Our Mission",
    missionText: "At AbejaLoca, our mission is to create music that inspires energy, joy, and creativity...",
    values: "Our Values",
    creativity: "Creativity",
    creativityText: "We push boundaries to create unique and innovative sounds.",
    community: "Community",
    communityText: "We believe in building a hive of music lovers who support and inspire each other.",
    quality: "Quality",
    qualityText: "Every track is crafted with care to ensure the best listening experience.",
    fun: "Fun",
    funText: "Life’s too short for boring music—our beats are designed to make you smile and dance!",
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

// Debugging: Log the current language
console.log("Current language:", localStorage.getItem("language"));

// Debugging: Log the current language
console.log("Current language:", localStorage.getItem("language"));

const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your Stripe public key


const checkoutButtons = document.querySelectorAll('[id^="checkout-button-"]');
checkoutButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    stripe.redirectToCheckout({
      lineItems: [{ price: 'YOUR_STRIPE_PRICE_ID', quantity: 1 }], // Replace with your Stripe price ID
      mode: 'payment',
      successUrl: 'https://abejaloca.com/success', // Replace with your success URL
      cancelUrl: 'https://abejaloca.com/cancel', // Replace with your cancel URL
    }).then((result) => {
      if (result.error) {
        alert(result.error.message);
      }
    });
  });
});

