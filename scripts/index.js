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
    missionText: "En AbejaLoca, creemos en la comodidad y la mejor calidad de audio. Cada USB está cuidadosamente preparado con canciones de alta tasa de bits y etiquetadas correctamente, lo que garantiza la mejor experiencia auditiva. Ya seas amante de la música, DJ o simplemente alguien que aprecia tener una colección confiable sin conexión, lo tenemos cubierto.",
    missionText2: "¿Tienes alguna solicitud especial o algún problema? ¡Estamos aquí para ayudarte! Contáctanos a través de nuestras redes sociales y nuestro equipo estará encantado de ayudarte con tus pedidos personalizados, la resolución de problemas o cualquier pregunta que tengas. ¡Tu satisfacción es nuestra prioridad!",
    medias: "¡Contáctanos en!",
    instagram: "Instagram",
    instagramText: "@abejalocaoficial",
    facebook: "Facebook",
    facebookText: "Abeja Loca.",
    tiktok: "Tiktok",
    tiktokText: "@www.abejaloca.com",funText: "La vida es demasiado corta para música aburrida. ¡Nuestros ritmos están diseñados para hacerte sonreír y bailar!",
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
    aboutText: "Welcome to AbejaLoca, your go-to destination for high-quality music delivered straight to USB! We specialize in curating premium song collections, making it easy for you to enjoy your favorite tracks anytime, anywhere—without relying on streaming services.",
    mission: "Our Mission",
    missionText: "At AbejaLoca, we believe in delivering convenience and top-notch audio quality. Each USB is carefully prepared with properly tagged, high-bitrate songs, ensuring the best listening experience. Whether you're a music lover, DJ, or just someone who appreciates having a reliable offline collection, we’ve got you covered.",
    missionText2:"Have a special request or facing an issue? We’re here to help! Reach out to us via our social media channels, and our team will gladly assist you with custom orders, troubleshooting, or any questions you may have. Your satisfaction is our priority!",
    medias: "Contact Us At!",
    instagram: "Instagram",
    instagramText: "@abejalocaoficial",
    facebook: "Facebook",
    facebookText: "Abeja Loca.",
    tiktok: "Tiktok",
    tiktokText: "@www.abejaloca.com",
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

