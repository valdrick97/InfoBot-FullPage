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
