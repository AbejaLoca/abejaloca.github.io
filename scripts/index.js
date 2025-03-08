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

