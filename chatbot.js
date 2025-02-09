document.addEventListener("DOMContentLoaded", function() {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");

  function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    // Add user message
    addMessage(message, "user-message");

    // Simulate bot response
    setTimeout(() => {
      addMessage("Hello! How can I assist you?", "bot-message");
    }, 1000);

    userInput.value = "";
  }

  function addMessage(text, className) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = text;
    messageDiv.classList.add(className);
    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
  }

  sendButton.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });
});
