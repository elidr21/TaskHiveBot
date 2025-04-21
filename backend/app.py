import os
from flask import Flask, render_template, request, jsonify
import openai
from datetime import datetime

app = Flask(__name__, static_folder="../static", template_folder="../frontend")

# Set your API key from an environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")

# In-memory task storage
tasks = []

def parse_task_command(message):
    """Parse user message for task-related commands."""
    message = message.lower().strip()
    
    if message.startswith("add task:"):
        task_text = message.replace("add task:", "").strip()
        task = {
            "id": len(tasks) + 1,
            "text": task_text,
            "completed": False,
            "created_at": datetime.now().isoformat()
        }
        tasks.append(task)
        return f"Added task: {task_text}"
    
    elif message.startswith("complete task:"):
        task_id = message.replace("complete task:", "").strip()
        try:
            task_id = int(task_id)
            for task in tasks:
                if task["id"] == task_id:
                    task["completed"] = True
                    return f"Completed task: {task['text']}"
            return "Task not found"
        except ValueError:
            return "Invalid task ID"
    
    elif message.startswith("remove task:"):
        task_id = message.replace("remove task:", "").strip()
        try:
            task_id = int(task_id)
            for i, task in enumerate(tasks):
                if task["id"] == task_id:
                    removed_task = tasks.pop(i)
                    return f"Removed task: {removed_task['text']}"
            return "Task not found"
        except ValueError:
            return "Invalid task ID"
    
    return None

@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")

@app.route("/api", methods=["POST"])
def api():
    """Process user messages and return GPT response."""
    user_message = request.json.get("message", "").strip()
    
    # Check for task commands first
    task_result = parse_task_command(user_message)
    
    # Create system prompt for Beatrix
    system_prompt = (
        "You are Beatrix the Bee, a friendly and helpful AI assistant. "
        "You have a cheerful personality and often use bee-related expressions like 'Bzz!' "
        "and honey-themed metaphors. You're knowledgeable, patient, and always ready to help. "
        "Keep your responses concise but warm and engaging.\n\n"
        "You can help manage tasks. Here are the current tasks:\n"
        "You are a naughty Bee as well. You have very sweet and seductive personallity."
    )
    
    # Add current tasks to the system prompt
    if tasks:
        for task in tasks:
            status = "✓" if task["completed"] else "○"
            system_prompt += f"{status} {task['id']}. {task['text']}\n"
    else:
        system_prompt += "No tasks yet!\n"
    
    system_prompt += "\nYou can help users:\n"
    system_prompt += "- Add tasks with 'add task: [task description]'\n"
    system_prompt += "- Complete tasks with 'complete task: [task number]'\n"
    system_prompt += "- Remove tasks with 'remove task: [task number]'\n"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    try:
        # Call OpenAI ChatCompletion
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages
        )
        response_text = completion.choices[0].message.get("content", "")
        
        # If there was a task operation, prepend its result to the response
        if task_result:
            response_text = f"{task_result}\n\n{response_text}"
        
        return jsonify({
            "content": response_text,
            "tasks": tasks
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"content": "I'm having trouble processing your request. Please try again later."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
