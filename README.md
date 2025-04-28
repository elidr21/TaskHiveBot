# TaskHiveBot 🐝

> **Smart task management with gamification features — powered by Flask & OpenAI.**

---

## ✨ Features

- 🧠 AI-powered task suggestions and prioritization (OpenAI integration)
- ✅ To-do list and task tracking with progress visualization
- 🎮 Gamification system: earn points and rewards for completing tasks
- 🎨 Clean and responsive frontend interface
- 🐳 Simple Docker-based setup for seamless deployment

---

## ⚡ Quick Start

> **Requirement:** [Docker Desktop ≥ 24.0](https://docs.docker.com/desktop/)

```bash
# 1️⃣ Clone the repository
$ git clone https://github.com/elidr/TaskHiveBot.git
$ cd TaskHiveBot

# 2️⃣ Spin everything up
$ docker-compose up --build

# ⏱️ Then visit http://localhost:5000 in your browser.
```

The first build can take a minute while images are pulled & dependencies are installed.

---

## 📁 Folder Structure

```
TaskHiveBot/
├── backend/
│   ├── app.py          # Flask Application
│   └── Dockerfile 
├── frontend/
│   └── static/
│       ├── css/        # CSS stylesheets
│       ├── images/     # Images 
│       └── js/         # JavaScript files
│   ├── app.html        # Main app page
│   └── landing.html    # Landing page
├── .env                # Environment vars
├── .gitignore          # Git ignored files and directories
├── docker-compose.yml  # Multi-container Docker configuration
├── LICENSE             # Project license (MIT)
├── README.md
└── requirements.txt 

```

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

> © 2025 Elizandro Duran, Drew Houchens, Bryan Hancock, Alexis Liew — *Made in Colorado Springs*
