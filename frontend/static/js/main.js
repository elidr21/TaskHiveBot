import { ChatInterface } from './components/ChatInterface.js';
import { TaskManager } from './components/TaskManager.js';
import { TaskFilter } from './components/TaskFilter.js';

class App {
    constructor() {
        console.log('Initializing TaskHive App...');
        this.initializeComponents();
        this.bindEvents();
    }

    initializeComponents() {
        this.taskManager = new TaskManager();
        this.chatInterface = new ChatInterface(this.taskManager);
        this.taskFilter = new TaskFilter();
    }

    bindEvents() {
        this.taskFilter.on('filterChanged', (filter) => {
            this.taskManager.render();
        });

        this.taskManager.on('taskAdded', (task) => {
            this.chatInterface.updateContext();
        });

        this.taskManager.on('taskDeleted', (taskId) => {
            this.chatInterface.updateContext();
        });

        this.taskManager.on('taskToggled', (task) => {
            this.chatInterface.updateContext();
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 