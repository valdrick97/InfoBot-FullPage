document.addEventListener('DOMContentLoaded', function () {
  const chatContainer = document.getElementById('chatContainer');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const typingIndicator = document.getElementById('typingIndicator');
  const chatMessages = document.getElementById('chatMessages');

  let hasInteracted = false;

  // Open the chat widget on first interaction
  function openChat() {
    if (!hasInteracted) {
      chatContainer.classList.add('typing');
      setTimeout(function () {
        chatContainer.classList.remove('typing');
        chatContainer.classList.remove('closed');
        chatContainer.classList.add('open');
      }, 800);
      hasInteracted = true;
    }
  }

  // Open chat on input (first time only)
  chatInput.addEventListener('input', function () {
    openChat();
  });

  // Submit message on Enter key press
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitMessage();
    }
  });

  // Submit message on button click
  sendButton.addEventListener('click', function () {
    submitMessage();
  });

  // Function to submit the message and display it in the messages area
  function submitMessage() {
    const message = chatInput.value.trim();
    if (message !== '') {
      const messageElem = document.createElement('p');
      messageElem.textContent = message;
      chatMessages.appendChild(messageElem);
      chatInput.value = '';
      // Optionally scroll to the bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
});
