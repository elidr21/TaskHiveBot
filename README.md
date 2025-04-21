# TaskHiveBot 🐝

> **Smart task management with a dash of gamification — powered by Flask, React, PostgreSQL & Azure OpenAI.**

## ✨ Features

- **Conversational task management** — natural‑language creation, updates & queries
- **Gamification** — XP, streaks & leaderboards to keep productivity fun
- **Cross‑device** — responsive React SPA works great on desktop & mobile
- **Secure & scalable** — Dockerised micro‑services, PostgreSQL database, JWT auth
- **Cloud‑ready** — deploys in a single command to Microsoft Azure or any Docker host

---

## ⚡ Quick Start

> **Requirement:** [Docker Desktop ≥ 24.0](https://docs.docker.com/desktop/)

```bash
# 1️⃣ Clone the repository
$ git clone https://github.com/elidr/TaskHiveBot.git
$ cd TaskHiveBot

# 2️⃣ Spin everything up
$ docker-compose up --build

# ⏱️ Then visit http://localhost:5000 in your browser.
```

The first build can take a minute while images are pulled & dependencies are installed.

---

## 🔧 Configuration

Copy the example env file and tweak values as needed:

```bash
cp .env.example .env
```

| Variable              | Description                              | Default |
|-----------------------|------------------------------------------|---------|
| `OPENAI_API_KEY`      | Azure OpenAI key                         | *none*  |
| `DATABASE_URL`        | PostgreSQL connection string             | `postgres://taskhive:taskhive@db:5432/taskhive` |
| `JWT_SECRET`          | Secret used to sign auth tokens          | change‑me |
| `REACT_APP_API_HOST`  | Backend base URL visible to the browser  | `http://localhost:8000` |

---

## 🖥️ Local Development

```bash
# Run backend & database only
$ docker-compose up backend db

# Hot‑reload frontend separately
$ npm --prefix frontend install
$ npm --prefix frontend start
```

Tests are written with **PyTest** (backend) and **Vitest** (frontend):

```bash
$ docker-compose exec backend pytest
$ npm --prefix frontend test
```

---

## 📁 Folder Structure

```
TaskHiveBot/
├─ backend/            # Flask application
│  ├─ app/             # Blueprint modules & services
│  ├─ tests/
│  └─ Dockerfile
├─ frontend/           # React SPA (Vite)
│  ├─ src/
│  ├─ public/
│  └─ Dockerfile
├─ docs/               # Architecture docs & assets
├─ docker-compose.yml
└─ README.md
```

---

## 🤝 Contributing

1. **Fork** this repo & create your branch: `git checkout -b feat/amazing`  
2. **Commit** your changes: `git commit -m "feat: add amazing thing"`  
3. **Push** and open a PR.  
4. ⭐ Give us a star if you like the project!

> Run `pre-commit install` to enable linting hooks (Black, isort, Flake8, ESLint, Prettier).

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

> © 2025 Elizandro Duran & TaskHiveBot Contributors — *Made with ☕ in Colorado Springs*
