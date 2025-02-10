// Get elements
const chatContainer = document.getElementById("chat-circle");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

// Function to open chat
function openChat() {
     document.body.classList.add("chat-open");
    chatContainer.classList.add("moved"); // Move circle smoothly to the right
    chatBox.classList.remove("hidden");  // Show chat box
    chatBox.classList.add("visible");    // Smoothly open chatbox to the left
}

// Function to close chat
function closeChat() {
    document.body.classList.remove("chat-open");
    chatContainer.classList.remove("moved"); // Move circle back to original position
    chatBox.classList.remove("visible"); // Hide chat box smoothly
    chatBox.classList.add("hidden");  // Ensure it's hidden
}

// Toggle chat when clicking the chat circle
chatContainer.addEventListener("click", () => {
    if (document.body.classList.contains("chat-open")) {
        closeChat(); // Close if it's already open
    } else {
        openChat(); // Open if it's closed
    }
});

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
