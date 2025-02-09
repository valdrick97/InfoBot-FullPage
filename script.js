/* ---------- Global Reset ---------- */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f5f5f5; /* Light grey background */
  font-family: Arial, sans-serif;
}

/* ---------- Chat Container ---------- */
.chat-container {
  width: 320px;
  margin: 100px auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* Default open state overflow (for messages area) */
  overflow: hidden;
  transition: height 0.5s ease;
}

/* When closed, allow overflow so the chat image’s circle is fully visible */
.chat-container.closed {
  height: 120px;
  overflow: visible;
}

/* Open state: expands to a larger box */
.chat-container.open {
  height: 500px;
  overflow: hidden;
}

/* ---------- Chat Image (Avatar) ---------- */
.chat-image {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  /* Updated image URL using PlaceKitten */
  background: url('https://placekitten.com/80/80') no-repeat center center;
  background-size: cover;
  transition: all 0.5s ease;
}

/* While closed, add a circular border around the image */
.chat-container.closed .chat-image {
  border: 3px solid #007bff;
}

/* When open, move the image to the right side and remove the border */
.chat-container.open .chat-image {
  left: auto;
  right: 10px;
  transform: translateX(0);
  border: none;
}

/* ---------- Chat Header ---------- */
.chat-header {
  background-color: #007bff;
  color: #fff;
  text-align: center;
  padding: 10px;
  font-size: 18px;
  transition: all 0.5s ease;
}

/* In the closed state, position the header just above the input */
.chat-container.closed .chat-header {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
}

/* In the open state, let the header be in normal document flow at the top */
.chat-container.open .chat-header {
  position: relative;
  top: 0;
  width: 100%;
}

/* ---------- Chat Messages ---------- */
.chat-messages {
  padding: 15px;
  overflow-y: auto;
  transition: opacity 0.5s ease;
}

/* Hide messages in closed state */
.chat-container.closed .chat-messages {
  opacity: 0;
  height: 0;
  padding: 0 15px;
}

/* Show messages in open state */
.chat-container.open .chat-messages {
  opacity: 1;
  height: auto;
}

/* ---------- Typing Indicator ---------- */
.typing-indicator {
  display: none;
  padding: 5px 15px;
  font-style: italic;
  color: #888;
  transition: opacity 0.5s ease;
}
.chat-container.typing .typing-indicator {
  display: block;
  opacity: 1;
}

/* ---------- Chat Input ---------- */
.chat-input {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}

.chat-input button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
