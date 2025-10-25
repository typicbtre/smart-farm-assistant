document.addEventListener('DOMContentLoaded', () => {
    const startChatBtn = document.getElementById('startChatBtn');
    const chatInterface = document.getElementById('chatInterface');
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');

    // Check if all elements exist
    if (!startChatBtn || !chatInterface || !sendBtn || !userInput || !chatBox || !closeChat) {
        console.error('Chatbot elements not found in DOM');
        return;
    }

    // Show the chat interface when the user clicks the "Start Chat" button
    startChatBtn.addEventListener('click', () => {
        chatInterface.style.display = 'block';
        startChatBtn.style.display = 'none';
    });

    // Close chat
    closeChat.addEventListener('click', () => {
        chatInterface.style.display = 'none';
        startChatBtn.style.display = 'inline-block';
    });

    // Generate bot response function
    function generateBotResponse(question) {
        try {
            const lowerCaseQuestion = question.toLowerCase();

            // Check if knowledge base exists
            if (typeof farmingKnowledgeBase === 'undefined') {
                return "Sorry, I'm having trouble accessing my knowledge base. Please try refreshing the page.";
            }

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
        } catch (error) {
            console.error('Error generating bot response:', error);
            return "Sorry, I encountered an error. Please try again.";
        }
    }

    // Handle user input and bot response
    function handleSend() {
        const userQuestion = userInput.value.trim();
        if (userQuestion !== '') {
            // Display the user's message
            addMessageToChat(userQuestion, 'user');
            userInput.value = ''; // Clear the input field

            // Simulate a bot response using knowledge base
            setTimeout(() => {
                const botResponse = generateBotResponse(userQuestion);
                addMessageToChat(botResponse, 'bot');
            }, 500);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
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

    // Add initial welcome message
    setTimeout(() => {
        addMessageToChat("Hello! I'm your Smart Farm Assistant. Ask me about watering, soil, pests, planting, or specific vegetables like tomatoes and carrots!", 'bot');
    }, 1000);
});

// Toggle sidebar visibility
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});