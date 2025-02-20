from flask import Flask, render_template, request
import openai

app = Flask(__name__, template_folder='.')

openai.api_key = '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'


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api", methods=["POST"])
def api():
    message = request.json.get("message")

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": message}
        ]
    )

    if completion.choices[0].message is not None:
        return {"content": completion.choices[0].message["content"]}
    else:
        return {'content': 'Failed to Generate response!'}


if __name__ == '__main__':
    app.run()
