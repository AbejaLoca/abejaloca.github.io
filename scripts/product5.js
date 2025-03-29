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
    home: "Inicio",
    store: "Tienda",
    donation: "Donación",
    tos: "Términos de Servicio",
    privacy: "Política de Privacidad",
    agreement: "Acuerdo de Usuario",
    soul: "Albums para tu alma",
    songs: "🎵 Los Invasores De Nuevo Leon",
    desc: " Los Invasores De Nuevo Leon, 50 Albums!",
    track: "Lista de Canciones:",
    footer: "¡Gracias por apoyar a la colmena! 🐝 Tu compra nos ayuda a crear más música para que disfrutes.",
    why1: "¿Por qué elegir AbejaLoca?",
    why2: "Nuestra música está creada con pasión y creatividad, diseñada para animarte y ponerte en movimiento. Cada canción es una experiencia única, que fusiona géneros y estilos para crear algo verdaderamente especial."
  },
  en: {
    
    home: "Home",
    store: "Store",
    donation: "Donation",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    agreement: "User Agreement",
    soul: "Albums for Your Soul",
    songs: "🎵 Los Invasores De Nuevo Leon",
    desc: "Los Invasores De Nuevo Leon, 50 Albums!",
    track: "Songs List:",
    footer: "Thank you for supporting the hive! 🐝 Your purchase helps us create more music for you to enjoy.",
    why1: "Why choose AbejaLoca?",
    why2: "Our music is crafted with passion and creativity, designed to uplift your spirits and get you moving. Every track is a unique experience, blending genres and styles to create something truly special."
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