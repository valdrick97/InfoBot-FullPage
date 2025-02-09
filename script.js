document.addEventListener('DOMContentLoaded', function () {
  const chatContainer = document.getElementById('chatContainer');
  const chatInput = document.getElementById('chatInput');
  const typingIndicator = document.getElementById('typingIndicator');

  let hasInteracted = false;

  chatInput.addEventListener('input', function () {
    if (!hasInteracted) {
      // Show the typing indicator briefly.
      chatContainer.classList.add('typing');

      // After a short delay, remove the closed state and open the chat.
      setTimeout(function () {
        chatContainer.classList.remove('typing');
        chatContainer.classList.remove('closed');
        chatContainer.classList.add('open');
      }, 800); // Delay in milliseconds

      hasInteracted = true;
    }
  });
});
