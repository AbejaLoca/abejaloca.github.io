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
    support: "Apoya a AbejaLoca",
    support2: "¡Ayuda a que la música siga sonando!",
    yap: "En AbejaLoca, nos dedicamos a crear música que haga bailar tu alma. Tu apoyo nos ayuda a seguir produciendo melodías dulces y melosas para la colmena. ¡Cada donación, grande o pequeña, mantiene viva la emoción!",
    footer: "¡Gracias por apoyar la colmena! 🐝 Tu contribución significa mucho para nosotros.",
  },
  en: {
    
    home: "Home",
    store: "Store",
    donation: "Donation",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    agreement: "User Agreement",
    support: "Support AbejaLoca!",
    support2: "Help keep the music buzzing!",
    yap: "At AbejaLoca, we’re all about creating music that makes your soul dance. Your support helps us continue producing sweet, honey-filled tunes for the hive. Every donation, big or small, keeps the buzz alive!",
    footer: "Thank you for supporting the hive! 🐝 Your contribution means the world to us.",
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