const fs = require('fs');

// Simulate fetching new data (replace with actual API call or data source)
const newData = {
  categories: {
    weather: ["What's the weather today?", "Is it going to rain?"],
    news: ["What's the latest news?", "Any breaking news?"],
  },
  faqData: {
    "What's the weather today?": "The weather is sunny.",
    "Is it going to rain?": "No rain expected today.",
    "What's the latest news?": "Here's the latest news: ...",
    "Any breaking news?": "No breaking news at the moment.",
  },
};

// Update categories.json
fs.writeFileSync('categories.json', JSON.stringify(newData.categories, null, 2));

// Update faqData.json
fs.writeFileSync('faqData.json', JSON.stringify(newData.faqData, null, 2));

console.log('Data updated successfully!');
