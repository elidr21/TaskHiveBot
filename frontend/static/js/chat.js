class ChatInterface {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        this.userInput.value = '';

        try {
            const response = await this.sendMessageToServer(message);
            
            if (response.ok) {
                const data = await response.json();
                this.addMessage('ai', data.response, data.timestamp);
            } else {
                const data = await response.json();
                this.addMessage('ai', `Error: ${data.error}`);
            }
        } catch (error) {
            this.addMessage('ai', 'Error: Could not connect to the server');
            console.error('Chat error:', error);
        }
    }

    async sendMessageToServer(message) {
        return await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });
    }

    addMessage(type, content, timestamp = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = content;

        if (timestamp) {
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'timestamp';
            timestampDiv.textContent = timestamp;
            messageDiv.appendChild(timestampDiv);
        }

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatInterface = new ChatInterface();
}); 