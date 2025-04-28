import { CONFIG } from '../config.js';

class ApiService {
    async sendChatMessage(message, tasks) {
        try {
            const response = await fetch(CONFIG.API_ENDPOINTS.CHAT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, tasks })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

export const apiService = new ApiService(); 