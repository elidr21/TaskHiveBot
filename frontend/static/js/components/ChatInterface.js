export class ChatInterface {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.initializeElements();
        this.bindEvents();
        this.addWelcomeMessage();
        this.setupScrollHandling();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.toggleSidebarBtn = document.getElementById('toggle-sidebar');
        
        // Add suggestion chips handling
        this.suggestionChips = document.querySelectorAll('.suggestion-chip');
        this.suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                this.userInput.value = chip.textContent;
                this.userInput.focus();
            });
        });
    }

    bindEvents() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Toggle sidebar on mobile
        if (this.toggleSidebarBtn) {
            this.toggleSidebarBtn.addEventListener('click', () => {
                document.getElementById('task-sidebar').classList.toggle('active');
            });
        }
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        this.userInput.value = '';

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    tasks: this.taskManager.getTasks()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            // Add AI response to chat
            this.addMessage('ai', data.response);

            // Handle task actions
            if (data.taskActions && data.taskActions.length > 0) {
                data.taskActions.forEach(action => {
                    switch (action.type) {
                        case 'add':
                            const taskId = this.taskManager.addTask(action.task);
                            this.addMessage('system', `✅ Added task: ${action.task}`);
                            break;
                        case 'removeAll':
                            this.taskManager.removeAllTasks();
                            this.addMessage('system', `🗑️ Removed all tasks`);
                            break;
                        case 'remove':
                            const taskToRemove = this.taskManager.getTaskById(action.taskId);
                            if (taskToRemove) {
                                this.taskManager.deleteTask(action.taskId);
                                this.addMessage('system', `🗑️ Removed task`);
                            }
                            break;
                        case 'complete':
                            const taskToComplete = this.taskManager.getTaskById(action.taskId);
                            if (taskToComplete) {
                                this.taskManager.toggleTaskComplete(action.taskId);
                                this.addMessage('system', `✓ Marked task as complete`);
                            }
                            break;
                    }
                });
            }

        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('system', `⚠️ Error: ${error.message}`);
        }
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // Handle emojis and formatting
        const formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/(:[a-z_]+:)/g, this.replaceEmoji);
        
        messageDiv.innerHTML = formattedContent;
        this.chatMessages.appendChild(messageDiv);

        // Scroll to bottom if already near bottom
        if (this.isNearBottom) {
            this.scrollToBottom();
        }
    }

    replaceEmoji(match) {
        const emojiMap = {
            ':bee:': '🐝',
            ':honey:': '🍯',
            ':check:': '✅',
            ':x:': '❌',
            ':star:': '⭐',
            // Add more emoji mappings as needed
        };
        return emojiMap[match] || match;
    }

    addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message loading';
        loadingDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        this.chatMessages.appendChild(loadingDiv);
        this.scrollToBottom();
        return loadingDiv;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    addWelcomeMessage() {
        this.addMessage('ai', 'Hello! 🐝 I\'m your TaskHive Assistant. I can help you manage tasks and answer questions. Try saying things like "add a task to review code" or "show my tasks".');
    }

    // Add this new method for system messages
    addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.textContent = message;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    setupScrollHandling() {
        // Create intersection observer for scroll detection
        this.observer = new IntersectionObserver(
            (entries) => {
                this.isNearBottom = entries[0].isIntersecting;
            },
            {
                root: this.chatMessages,
                threshold: 0.1
            }
        );

        // Add scroll marker
        this.scrollMarker = document.createElement('div');
        this.scrollMarker.style.height = '1px';
        this.chatMessages.appendChild(this.scrollMarker);
        this.observer.observe(this.scrollMarker);
    }
} 