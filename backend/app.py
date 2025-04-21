import os
from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__, static_folder="../static", template_folder="../frontend")

# Set your API key from an environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")

# Simple in-memory task list for demonstration
tasks = []

def parse_user_message_for_tasks(user_message):
    """
    Basic command parsing:
      - 'Add task: ...'
      - 'Complete task: ...'
      - 'Remove task: ...'
    Updates the global 'tasks' list accordingly.
    """
    global tasks
    lines = user_message.lower().split('\n')
    feedback = []

    for line in lines:
        line = line.strip()
        # Add
        if line.startswith("add task:"):
            task_name = line.replace("add task:", "").strip()
            if task_name:
                tasks.append({"name": task_name, "completed": False})
                feedback.append(f"Added task: {task_name}")
        # Complete
        elif line.startswith("complete task:"):
            task_name = line.replace("complete task:", "").strip()
            for t in tasks:
                if t["name"].lower() == task_name.lower():
                    t["completed"] = True
                    feedback.append(f"Completed task: {t['name']}")
        # Remove
        elif line.startswith("remove task:"):
            task_name = line.replace("remove task:", "").strip()
            for t in tasks[:]:
                if t["name"].lower() == task_name.lower():
                    tasks.remove(t)
                    feedback.append(f"Removed task: {t['name']}")

    return "\n".join(feedback) if feedback else ""

@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")

@app.route("/api", methods=["POST"])
def api():
    """Process user messages, update tasks if needed, and return GPT response."""
    user_message = request.json.get("message", "").strip()
    
    # 1. Check if the user wants to add/remove/complete tasks
    tasks_feedback = parse_user_message_for_tasks(user_message)

    # 2. Create a dynamic system prompt including the updated tasks
    task_list_str = "\n".join(
        [f"- {'[x]' if t['completed'] else '[ ]'} {t['name']}" for t in tasks]
    )
    system_prompt = (
        "You are a helpful assistant named Beatrix who manages the user's tasks. "
        "Here is the current to-do list:\n"
        f"{task_list_str if task_list_str else 'No tasks.'}\n\n"
        "When the user wants to add, remove, or complete tasks, confirm and respond helpfully.\n"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]

    # 3. Call OpenAI ChatCompletion
    completion = openai.ChatCompletion.create(
        model="gpt-4o-mini",  # Replace with a valid model name (e.g., "gpt-3.5-turbo", etc.)
        messages=messages
    )
    response_text = completion.choices[0].message.get("content", "")

    # Optionally append system feedback text to GPT’s response
    if tasks_feedback:
        response_text += f"\n\n[System note: {tasks_feedback}]"

    # 4. Return JSON including updated tasks so the front-end can refresh
    return jsonify({"content": response_text, "tasks": tasks})

if __name__ == "__main__":
    # Run locally
    app.run(host="0.0.0.0", port=5000, debug=True)
