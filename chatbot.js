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

// Function to find the best match
function findBestMatch(userInput) {
    const normalizedInput = normalize(userInput);

    // Try an exact match first
    if (faqMap.has(normalizedInput)) {
        const result = faqMap.get(normalizedInput);
        // Check if the result is an object with an 'answer' property
        return typeof result === 'object' && result.answer ? result.answer : result;
    }

    // Check variations
    for (const [question, data] of faqMap.entries()) {
        if (data.variations && data.variations.includes(normalizedInput)) {
            return data.answer;
        }
    }

    // Fall back to fuzzy matching
    const fuzzyMatches = fuzzySet.get(normalizedInput);
    if (fuzzyMatches && fuzzyMatches.length > 0 && fuzzyMatches[0][0] > 0.7) {
        const bestMatch = fuzzyMatches[0][1]; // Get the best match
        const result = faqMap.get(bestMatch);
        // Check if the result is an object with an 'answer' property
        return typeof result === 'object' && result.answer ? result.answer : result;
    }

    return "I couldn't find a matching answer. Can you rephrase your question?";
}

// Function to submit data to Google Form
async function submitToGoogleForm(employeeId, confirmationNumber) {
    const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSds2HGBadOLjPgsTR4w_8lmz-rrTmVTLQFeaQx_V1e7Sln5gA/formResponse";
    const EMPLOYEE_ID_ENTRY = "entry.792089064"; // Replace with actual entry ID for Employee ID
    const CONFIRMATION_NUMBER_ENTRY = "entry.683466226"; // Replace with actual entry ID for Confirmation Number

    const formData = new URLSearchParams();
    formData.append(EMPLOYEE_ID_ENTRY, employeeId);
    formData.append(CONFIRMATION_NUMBER_ENTRY, confirmationNumber);

    try {
        const response = await fetch(FORM_URL, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            mode: "no-cors", // Required for Google Forms
        });

        if (response.ok || response.status === 0) {
            // Google Forms always returns a 200 status, even if the submission fails
            return true;
        } else {
            console.error("Failed to submit data to Google Form.");
            return false;
        }
    } catch (error) {
        console.error("Error submitting data to Google Form:", error);
        return false;
    }
}

// Handle user input and bot response
async function sendMessage() {
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

    // Check if the input matches the pattern for employee ID and confirmation number
    const pattern = /(\d{5}) ([A-Za-z0-9]{5})/; // Regex for 5-digit ID and 5-character confirmation number
    const match = userInput.match(pattern);

    if (match) {
        const employeeId = match[1];
        const confirmationNumber = match[2];

        // Submit data to Google Form
        const success = await submitToGoogleForm(employeeId, confirmationNumber);

        if (success) {
            addMessage(`Submitted: Employee ID = ${employeeId}, Confirmation Number = ${confirmationNumber}`, 'bot');
        } else {
            addMessage("Failed to submit data. Please try again.", 'bot');
        }
    } else {
        // Handle normal FAQ responses
        const response = findBestMatch(userInput);
        addMessage(response, 'bot');
    }

    // Clear the input box
    document.getElementById('chat-input').value = '';
}

// Normalize input text
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
        faqData.forEach(qa => {
            // Add the main question to faqMap
            faqMap.set(normalize(qa.question), qa.answer);

            // Add variations to faqMap
            if (qa.variations) {
                qa.variations.forEach(variation => {
                    faqMap.set(normalize(variation), qa.answer); // Store only the answer
                });
            }

            // Add to fuzzySet
            fuzzySet.add(normalize(qa.question));
            if (qa.variations) {
                qa.variations.forEach(variation => fuzzySet.add(normalize(variation)));
            }
        });

        console.log('FAQ data loaded and preprocessed successfully!');
    })
    .catch(error => console.error('Error loading FAQ data:', error));

// Function to search by name
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
