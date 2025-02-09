// Get elements
const chatContainer = document.querySelector('.chat-container');
const chatImage = document.querySelector('.chat-image');
const chatHeader = document.querySelector('.chat-header');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input');
const chatMessageText = document.querySelector('.chat-message-text');

// Toggle chat container
chatContainer.addEventListener('click', () => {
  if (chatContainer.classList.contains('closed')) {
    chatContainer.classList.remove('closed');
    chatContainer.classList.add('open');
    chatImage.style.animation = 'none'; // Stop rolling animation when opening
  } else {
    chatContainer.classList.remove('open');
    chatContainer.classList.add('closed');
    chatImage.style.animation = 'rollBubble 0.5s ease forwards'; // Apply roll animation when closing
  }
});

// Submit message using Enter key
chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    submitMessage();
  }
});

// Submit message using the submit button
document.querySelector('.chat-input button').addEventListener('click', submitMessage);

function submitMessage() {
  const message = chatInput.querySelector('input').value;
  if (message.trim()) {
    // Add the message to the chat
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Clear the input field
    chatInput.querySelector('input').value = '';
  }
}
