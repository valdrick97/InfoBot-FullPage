document.addEventListener('DOMContentLoaded', function () {
  const chatContainer = document.getElementById('chatContainer');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle the chat open/closed when clicking on the container.
  // (But ignore clicks on the input field or button so you can type.)
  chatContainer.addEventListener('click', function (e) {
    // If the click is on an input or button, do nothing.
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    
    if (chatContainer.classList.contains('closed')) {
      // Open the chat widget.
      chatContainer.classList.remove('closed');
      chatContainer.classList.add('open');
    } else {
      // Close the chat widget.
      chatContainer.classList.remove('open');
      chatContainer.classList.add('closed');
    }
  });

  // Submit message on Enter key press.
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitMessage();
    }
  });

  // Submit message on button click.
  sendButton.addEventListener('click', function (e) {
    e.stopPropagation(); // Prevent toggle when clicking the button.
    submitMessage();
  });

  // Function to submit the message and display it in the messages area.
  function submitMessage() {
    const message = chatInput.value.trim();
    if (message !== '') {
      const messageElem = document.createElement('p');
      messageElem.textContent = message;
      chatMessages.appendChild(messageElem);
      chatInput.value = '';
      // Scroll to the bottom if needed.
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
});
