document.addEventListener('DOMContentLoaded', () => {
    const startChatBtn = document.getElementById('startChatBtn');
    const chatInterface = document.getElementById('chatInterface');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');

    // Show the chat interface when the user clicks the "Start Chat" button
    startChatBtn.addEventListener('click', () => {
        chatInterface.style.display = 'block';
        startChatBtn.style.display = 'none';
    });

    // Handle user input and bot response
    sendBtn.addEventListener('click', () => {
        const userQuestion = userInput.value.trim();
        if (userQuestion !== '') {
            // Display the user's message
            addMessageToChat(userQuestion, 'user');
            userInput.value = ''; // Clear the input field

            // Simulate a bot response (can be extended with more advanced logic)
            setTimeout(() => {
                const botResponse = generateBotResponse(userQuestion);
                addMessageToChat(botResponse, 'bot');
            }, 1000);
        }
    });

    // Add a message to the chat box
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
    }

    // Simple function to generate bot responses based on user question
    function generateBotResponse(question) {
        // You can expand this with more advanced logic (e.g., use farming knowledge base)
        if (question.toLowerCase().includes('plant')) {
            return 'To plant tomatoes, choose a sunny spot with well-drained soil.';
        } else if (question.toLowerCase().includes('water')) {
            return 'Most plants require watering 2-3 times a week, depending on the climate.';
        } else {
            return 'I am not sure about that. Could you ask me something else?';
        }
    }
});

function generateBotResponse(question) {
  const lowerCaseQuestion = question.toLowerCase();

  for (const topic in farmingKnowledgeBase) {
    const entry = farmingKnowledgeBase[topic];
    for (const keyword of entry.keywords) {
      if (lowerCaseQuestion.includes(keyword)) {
        return entry.response;
      }
    }
  }

  // Default fallback response
  return "I'm not sure about that topic yet. Can you try asking in a different way or be more specific?";
}

// Toggle sidebar visibility
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});