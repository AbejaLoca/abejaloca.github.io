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
    soul: "Música rock para tu alma",
    songs: "🎵 1,500 Canciones en un USB",
    desc: "¡Sumérgete en los vibrantes sonidos de AbejaLoca! 1500 canciones con una mezcla de rock and roll que harán vibrar tu corazón de alegría. Perfecto para cualquier ocasión, este álbum es tu boleto a un viaje musical sin igual.",
    track: "Lista de canciones:",
    footer: "¡Gracias por apoyar a la colmena! 🐝 Tu compra nos ayuda a crear más música para que disfrutes.",
  },
  en: {
    
    home: "Home",
    store: "Store",
    donation: "Donation",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    agreement: "User Agreement",
    soul: "Rock Music for Your Soul",
    songs: "🎵 1,500 Songs in a USB",
    desc: "Dive into the vibrant sounds of AbejaLoca! 1,500 songs with a mix of rock and roll that will make your heart beat with joy. Perfect for any occasion, this album is your ticket to an unparalleled musical journey.",
    track: "Tracklist:",
    footer: "Thank you for supporting the hive! 🐝 Your purchase helps us create more music for you to enjoy.",
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