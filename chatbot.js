// Grab elements by their IDs
const chatContainer = document.getElementById('chatContainer');
const chatInput     = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');

let hasInteracted = false;

// Listen for input events on the text field
chatInput.addEventListener('input', function() {
  if (!hasInteracted) {
    // Add the "typing" state to show the typing indicator
    chatContainer.classList.add('typing');

    // After a short delay, remove typing state and open the chat container
    setTimeout(() => {
      chatContainer.classList.remove('typing');   // Remove typing indicator
      chatContainer.classList.remove('closed');     // Remove closed state
      chatContainer.classList.add('open');          // Add open state to reveal messages
    }, 800); // Delay in milliseconds (adjust as desired)

    hasInteracted = true; // Only run this once per session
  }
});
