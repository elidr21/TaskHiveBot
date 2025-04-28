import { CONFIG } from '../config.js';

class StorageService {
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Storage Save Error:', error);
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage Read Error:', error);
            return null;
        }
    }
}

export const storageService = new StorageService(); 