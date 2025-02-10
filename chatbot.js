// Get elements
const chatContainer = document.getElementById("chat-circle");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

// Function to open chat
function openChat() {
    chatContainer.classList.add("moved"); // Move circle to the right
    chatBox.classList.remove("hidden");  // Show chat box
    chatBox.classList.add("visible");    // Smooth fade-in
}

// When user clicks send button
sendButton.addEventListener("click", () => {
    if (chatInput.value.trim() !== "") {
        openChat();
    }
});

// When user presses Enter key
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        openChat();
    }
});
