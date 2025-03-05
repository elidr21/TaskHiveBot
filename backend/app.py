import os
from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__, static_folder="../static", template_folder="../frontend")

# Set your API key from an environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")

# In-memory task store for calendar events
tasks = []
next_task_id = 1

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api", methods=["POST"])
def api():
    user_message = request.json.get("message")
    completion = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a naughty girlfriend named Beatrix."},
            {"role": "user", "content": user_message}
        ]
    )
    response_text = completion.choices[0].message.get("content", "")
    return jsonify({"content": response_text})

# Endpoint: Get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

# Endpoint: Add a new task
@app.route("/tasks", methods=["POST"])
def add_task():
    global next_task_id
    data = request.json
    new_task = {
        "id": next_task_id,
        "title": data.get("title"),
        "start": data.get("start"),
        "allDay": data.get("allDay", True)
    }
    tasks.append(new_task)
    next_task_id += 1
    return jsonify(new_task), 201

# Endpoint: Update a task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    for task in tasks:
        if task["id"] == task_id:
            task["title"] = data.get("title", task["title"])
            task["start"] = data.get("start", task["start"])
            task["allDay"] = data.get("allDay", task["allDay"])
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

# Endpoint: Delete a task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]
    return jsonify({"result": "Task deleted"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

