// Get elements
const chatContainer = document.getElementById("chat-circle");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
let faqData = [];
let fuzzySet = FuzzySet();
let faqMap = new Map();
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
    chatBox.scrollTop = chatBox.scrollHeight;// Scroll to the bottom of the chat box

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

    // Find the best match using fuzzy matching
    let bestMatch = fuzzySet.get(userInput);
    let response = "I'm sorry, I don't understand that question.";

    if (bestMatch && bestMatch.length > 0 && bestMatch[0][0] > 0.7) {
        let faq = faqData.find(f => normalize(f.question) === bestMatch[0][1]);

        if (faq && typeof faq.answer === 'object') {
    response = `${faq.question}:\n\n`;
    for (const day in faq.answer) {
        response += `${day}:\n`;
        if (Array.isArray(faq.answer[day])) {
            faq.answer[day].forEach(time => {
                response += `${time}\n`;
            });
        } else {
            response += `${faq.answer[day]}\n`;
        }
        response += `\n`; // Add an extra newline for separation
    }
    response = response.trim(); // Remove the last newline
} else {
    // If the answer is a string, use it as is
    response = faq ? faq.answer : "I couldn't find a matching answer. Can you rephrase your question?";
}
}

    addMessage(response, 'bot');
    document.getElementById('chat-input').value = '';
}

function normalize(text) {
    if (typeof text !== 'string') {
        return '';
    }
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

// Load FAQ data
fetch('faqData.json')
    .then(response => response.json())
    .then(data => {
        faqData = data.categories.flatMap(category => category.questions);
        fuzzySet = FuzzySet(faqData.map(qa => normalize(qa.question)));
        faqData.forEach(qa => {
            faqMap.set(normalize(qa.question), qa.answer);
        });

        // Preprocess data
        data.categories.forEach(category => {
            category.questions.forEach(qa => {
                const normalizedQuestion = normalize(qa.question);
                faqMap.set(normalizedQuestion, qa.answer);
                fuzzySet.add(normalizedQuestion); // Add to fuzzy set
            });
        });
    });

// Function to find the best match
function findBestMatch(userInput) {
    const normalizedInput = normalize(userInput);

    // Try an exact match first
    if (faqMap.has(normalizedInput)) {
        return faqMap.get(normalizedInput);
    }

    // Fall back to fuzzy matching
    const fuzzyMatches = fuzzySet.get(normalizedInput);
    if (fuzzyMatches && fuzzyMatches.length > 0 && fuzzyMatches[0][0] > 0.7) {
        const bestMatch = fuzzyMatches[0][1]; // Get the best match
        return faqMap.get(bestMatch);
    }

    return "I couldn't find a matching answer. Can you rephrase your question?";
}

function searchByName(input) {
  const normalizedInput = input.toLowerCase().trim();  // Normalize input for comparison
  
  // Loop through faqData directly
  for (let person of faqData) {
    const normalizedName = person.question.toLowerCase();  // Normalize name for case-insensitive comparison
    
    // Split the name into first and last parts, e.g., "Arevalo, Archie"
    const [lastName, firstName] = normalizedName.split(",").map(part => part.trim());

    // Check if input matches first or last name (partial matches allowed)
    if (firstName.includes(normalizedInput) || lastName.includes(normalizedInput)) {
      return person.answer;  // Return the associated answer if a match is found
    }
  }

  return "No match found.";  // If no match is found
}
