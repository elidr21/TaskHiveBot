import { CONFIG } from '../config.js';
import { EventEmitter } from '../utils/eventEmitter.js';

export class TaskFilter extends EventEmitter {
    constructor() {
        super();
        this.initializeDOM();
    }

    initializeDOM() {
        this.filterContainer = document.querySelector('.task-filters');
        this.createFilters();
        this.bindEvents();
    }

    createFilters() {
        const filters = [
            { id: CONFIG.TASK_FILTERS.ALL, label: 'All' },
            { id: CONFIG.TASK_FILTERS.ACTIVE, label: 'Active' },
            { id: CONFIG.TASK_FILTERS.COMPLETED, label: 'Completed' }
        ];

        this.filterContainer.innerHTML = filters.map(filter => `
            <button class="filter-btn ${filter.id === CONFIG.TASK_FILTERS.ALL ? 'active' : ''}" 
                    data-filter="${filter.id}">
                ${filter.label}
            </button>
        `).join('');
    }

    bindEvents() {
        this.filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.setActiveFilter(e.target);
            }
        });
    }

    setActiveFilter(filterBtn) {
        this.filterContainer.querySelectorAll('.filter-btn')
            .forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');
        this.emit('filterChanged', filterBtn.dataset.filter);
    }
} 