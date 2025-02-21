import os
from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__, static_folder="../static", template_folder="../frontend")

# Set your API key from an environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY", "actual_api_key_here")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api", methods=["POST"])
def api():
    user_message = request.json.get("message")

    completion = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant named Beatrix."},
            {"role": "user", "content": user_message}
        ]
    )

    # Extract the actual text from the response object
    response_text = completion.choices[0].message.get("content", "")
    return jsonify({"content": response_text})


if __name__ == "__main__":
    app.run(debug=True)
