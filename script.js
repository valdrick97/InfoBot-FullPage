document.addEventListener('DOMContentLoaded', function() {
  // Grab elements by their IDs
  const chatContainer = document.getElementById('chatContainer');
  const chatInput = document.getElementById('chatInput');
  const typingIndicator = document.getElementById('typingIndicator');
  
  let hasInteracted = false;

  // Listen for input events on the text field
  chatInput.addEventListener('input', function() {
    if (!hasInteracted) {
      // Show the typing indicator
      chatContainer.classList.add('typing');

      // After a short delay, remove the typing indicator and open the chat widget
      setTimeout(function() {
        chatContainer.classList.remove('typing');
        chatContainer.classList.remove('closed');
        chatContainer.classList.add('open');
      }, 800); // Delay in milliseconds (adjust as needed)

      hasInteracted = true;
    }
  });
});
