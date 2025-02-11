// Get elements
const chatContainer = document.getElementById("chat-circle");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
let faqData = [];
let fuzzySet = null;
let categories = [];
let popupTimeout;
let popupInterval;
let isChatInitialized = false;
let inactivityTimer;  // Timer for inactivity
let isInactivityPromptShown = false; // Flag to prevent repeated inactivity prompts
let isPromptDisplayed = false; // Flag to track if the prompt is shown

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

// Function to check if the chat container is empty
function isChatContainerEmpty() {
  return chatBox.children.length === 0;
}

// Show the initial bot greeting only once, and only if the chat container is empty
function displayGreetingIfEmpty() {
  if (!isChatInitialized && isChatContainerEmpty()) {
    addMessage("What can I help you with?", "bot");
    isChatInitialized = true;  // Prevent this greeting from showing again
  }
}

// Add a message to the chat box
function addMessage(text, sender) {
  const message = document.createElement('div');
  message.textContent = text;
  message.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat box
  
  // Only show the greeting message if it hasn't been shown before
  if (!isChatInitialized) {
    displayGreetingIfEmpty(); // Show greeting only if it hasn't been shown
  }

  // Reset inactivity timer whenever a new message is added
  resetInactivityTimer();
}

// Inactivity Timer
function resetInactivityTimer() {
  clearTimeout(inactivityTimer); // Clear previous timer
  inactivityTimer = setTimeout(() => {
    // Show inactivity prompt after 10 minutes of no typing
    if (!isInactivityPromptShown) {
      addMessage("Would you like to clear all messages in this chat and start fresh? Yes or No.", "bot");
      isInactivityPromptShown = true;
    }
  }, 10 * 60 * 1000); // 10 minutes
}

// Handle user input and bot response
function sendMessage() {
  const userInput = document.getElementById('chat-input').value.trim();

  // Prevent sending an empty message
  if (!userInput) {
    return; // Do nothing if the input is empty
  }
  
  if (userInput.length > 200) {
    addMessage("Your question is too long. Please keep it under 200 characters.", 'bot');
    return;
  }

  // Reset flag if the user enters valid input
  if (userInput) {
    isPromptDisplayed = false; // Reset when user enters a valid message
  }

  addMessage(userInput, 'user');
  let bestMatch = fuzzySet.get(userInput);
  let response = "I'm sorry, I don't understand that question.";

  if (bestMatch && bestMatch.length > 0 && bestMatch[0][0] > 0.7) {
  let faq = faqData.find(f => normalize(f.question) === bestMatch[0][1]); // Directly using bestMatch[0][1]
  response = faq ? faq.answer : "I couldn't find a matching answer. Can you rephrase your question?";
} else {
  response = "I couldn't find a matching answer. Can you rephrase your question?";
}

  addMessage(response, 'bot');
  document.getElementById('chat-input').value = '';
  }

  function normalize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]|_/g, "")  // Remove punctuation
      .replace(/\s+/g, " ")       // Replace multiple spaces with a single space
      .trim();
  }

// Send message when user presses enter
document.getElementById('chat-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Save chat history to localStorage with a timestamp
function saveChatHistory() {
  const chatMessages = Array.from(chatBox.children).map(el => ({
    text: el.textContent,
    sender: el.classList.contains('user-message') ? 'user' : 'bot',
    timestamp: Date.now() // Add a timestamp when the message is saved
  }));
  localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
}

// Load chat history from localStorage and filter out expired messages
function loadChatHistory() {
  const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // Set expiration to 24 hours (in milliseconds)
  const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
  
  const validChatHistory = chatHistory.filter(msg => {
    // Check if the message is still within the expiration time
    return Date.now() - msg.timestamp < EXPIRATION_TIME;
  });

  // Load only valid messages
  validChatHistory.forEach(msg => addMessage(msg.text, msg.sender));
  
  // Save the filtered history back to localStorage
  localStorage.setItem('chatHistory', JSON.stringify(validChatHistory));
}

// Optional: Clear chat history after a set duration
function clearChatHistoryAfterTime() {
  const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // Set expiration to 24 hours
  setTimeout(() => {
    localStorage.removeItem('chatHistory'); // Remove chat history after the set time
  }, EXPIRATION_TIME);
}

// Clear chat history based on user response to inactivity prompt
function clearChatHistory() {
  chatBox.innerHTML = ''; // Clear chat box
  saveChatHistory(); // Save cleared history
  isInactivityPromptShown = false; // Reset inactivity prompt flag
}

// Handle user response to inactivity prompt (yes or no)
function handleInactivityResponse(response) {
  if (response.toLowerCase() === 'yes') {
    clearChatHistory();
    addMessage("The chat has been cleared and will start fresh.", "bot");
  } else {
    addMessage("Alright, continuing from where we left off.", "bot");
  }
}

// Listen for yes/no responses to the inactivity prompt
document.getElementById('chat-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const userInput = document.getElementById('chat-input').value.trim();
    if (isInactivityPromptShown && (userInput.toLowerCase() === 'yes' || userInput.toLowerCase() === 'no')) {
      handleInactivityResponse(userInput);
    }
  }
});

// Fetch FAQ data and categories
fetch('faqData.json')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load FAQ data');
    return response.json();
  })
  .then(data => {
    faqData = data.faqs;
    fuzzySet = FuzzySet(faqData.map(faq => faq.question));
    fuzzySet = FuzzySet(faqData.map(faq => normalize(faq.question)));
  })
  .catch(error => {
    console.error('Error loading FAQ data:', error);
    addMessage("Sorry, I'm having trouble loading my knowledge base. Please try again later.", 'bot');
  });

// Create the widget container
const widget = document.createElement('div');
widget.id = 'chatbot-container';
widget.style.position = 'fixed';
widget.style.bottom = '20px';
widget.style.right = '20px';
widget.style.width = '300px';
widget.style.height = '400px';
widget.style.backgroundColor = '#fff';
widget.style.border = '1px solid #ccc';
widget.style.borderRadius = '10px';
widget.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

// Add an iframe to load your bot
const iframe = document.createElement('iframe');
iframe.src = 'https://username.github.io/repository-name';
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.border = 'none';
iframe.style.borderRadius = '10px';

widget.appendChild(iframe);
document.body.appendChild(widget);
