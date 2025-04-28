import os
from flask import Flask, render_template, request, jsonify
import openai
from datetime import datetime

# Initialize Flask app
app = Flask(__name__, 
    template_folder="../frontend",
    static_folder="../frontend/static"
)

# Initialize OpenAI
openai.api_key = os.environ.get("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")

def create_chat_response(message: str, tasks: list = None) -> str:
    """
    Create a chat response using OpenAI API
    """
    system_message = """
    You are Beatrix the Bee 🐝, a friendly and helpful AI assistant. 
    You have a cheerful personality and often use bee-related expressions like 'Bzz!' 
    and honey-themed metaphors. You're knowledgeable, patient, and always ready to help.
    
    IMPORTANT INSTRUCTIONS FOR TASK MANAGEMENT:
    1. When the user asks to add a task, respond with EXACTLY:
       ADD_TASK: <task description>
       Bzz! I've added that task for you! Let me know if you need anything else! 🐝
    
    2. When the user asks to remove all tasks, first ask for confirmation:
       "Are you sure you want to remove all tasks? This action cannot be undone."
       If they confirm (say yes), respond with:
       REMOVE_ALL_TASKS
       Bzz! I've removed all tasks for you! Let me know if you need anything else! 🐝
    
    3. When removing a specific task:
       REMOVE_TASK: <task_id>
       
    4. When completing a task:
       COMPLETE_TASK: <task_id>
    
    These commands MUST be on their own line, separate from your conversational response.
    """

    # Add current tasks to context if available
    if tasks:
        task_list = "\nCurrent tasks:\n" + "\n".join([f"- {task['text']} (ID: {task['id']})" for task in tasks])
        system_message += task_list

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": message}
            ]
        )
        return response.choices[0].message['content']
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"

@app.route('/')
def landing():
    """Render the landing page"""
    return render_template('landing.html')

@app.route('/app')
def app_page():
    """Render the main chat interface"""
    return render_template('app.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    data = request.json
    message = data.get('message')
    current_tasks = data.get('tasks', [])

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Get response from OpenAI
        response = create_chat_response(message, current_tasks)
        
        # Parse the response for task actions
        task_actions = []
        clean_response_lines = []

        # Process each line of the response
        for line in response.split('\n'):
            line = line.strip()
            if line.startswith('ADD_TASK:'):
                task_text = line.replace('ADD_TASK:', '').strip()
                if task_text:
                    task_actions.append({
                        'type': 'add',
                        'task': task_text
                    })
            elif line == 'REMOVE_ALL_TASKS':
                task_actions.append({
                    'type': 'removeAll'
                })
            elif line.startswith('REMOVE_TASK:'):
                try:
                    task_id = int(line.replace('REMOVE_TASK:', '').strip())
                    task_actions.append({
                        'type': 'remove',
                        'taskId': task_id
                    })
                except ValueError:
                    clean_response_lines.append(line)
            elif line.startswith('COMPLETE_TASK:'):
                try:
                    task_id = int(line.replace('COMPLETE_TASK:', '').strip())
                    task_actions.append({
                        'type': 'complete',
                        'taskId': task_id
                    })
                except ValueError:
                    clean_response_lines.append(line)
            else:
                if line:  # Only add non-empty lines
                    clean_response_lines.append(line)

        # Clean the response of task management commands
        clean_response = '\n'.join(clean_response_lines)

        return jsonify({
            'response': clean_response,
            'taskActions': task_actions,
            'timestamp': datetime.now().strftime("%I:%M %p")
        })

    except Exception as e:
        print("Error:", str(e))  # Debug print
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', 5000)),
        debug=True
    )

