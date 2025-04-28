import { EventEmitter } from '../utils/eventEmitter.js';
import { storageService } from '../services/storageService.js';
import { CONFIG } from '../config.js';
import { dateFormatter } from '../utils/dateFormatter.js';

export class TaskManager extends EventEmitter {
    constructor() {
        super();
        this.tasks = this.loadTasks();
        this.lastId = this.getLastId();
        this.initializeElements();
        this.bindEvents();
        this.updateTaskStats();
        this.renderTasks();
    }

    initializeElements() {
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task');
        this.taskList = document.getElementById('task-list');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalTasksSpan = document.getElementById('total-tasks');
        this.completedTasksSpan = document.getElementById('completed-tasks');
    }

    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTask();
            }
        });

        // Filter events
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTasks();
            });
        });
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            const data = JSON.parse(saved);
            return Array.isArray(data) ? data : (data.tasks || []);
        }
        return [];
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify({
            tasks: this.tasks,
            lastId: this.lastId
        }));
    }

    getLastId() {
        if (this.tasks.length === 0) return 0;
        return Math.max(...this.tasks.map(task => task.id));
    }

    addTask(taskText = null) {
        const text = taskText || this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: this.lastId + 1,
            text: text,
            completed: false,
            timestamp: new Date().toISOString()
        };

        this.lastId = task.id;
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskStats();

        if (!taskText) {
            this.taskInput.value = '';
        }

        return task.id;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskStats();
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateTaskStats();
        }
    }

    updateTaskStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        this.totalTasksSpan.textContent = `${totalTasks} tasks`;
        this.completedTasksSpan.textContent = `${completedTasks} completed`;
    }

    getFilteredTasks() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        switch (activeFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = filteredTasks.map((task, index) => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="app.taskManager.toggleTaskComplete(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                </div>
                <button class="delete-task" onclick="app.taskManager.deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    getTasks() {
        return this.tasks;
    }

    removeAllTasks() {
        this.tasks = [];
        this.lastId = 0;
        this.saveTasks();
        this.renderTasks();
        this.updateTaskStats();
        this.emit('tasksCleared');
    }
} 