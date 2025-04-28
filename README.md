# TaskHiveBot 🐝

> **Smart task management with gamification features — powered by Flask & OpenAI.**

---

## ✨ Features

- 🧠 AI-powered task suggestions and prioritization (OpenAI integration)
- ✅ To-do list and task tracking with progress visualization
- 🎮 Gamification system: earn points and rewards for completing tasks ( In Progress ).
- 🎨 Clean and responsive frontend interface
- 🐳 Simple Docker-based setup for seamless deployment

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://docs.docker.com/desktop/) (version ≥ 24.0)
- [Git](https://git-scm.com/downloads)
- OpenAI API key (for AI features)

### Environment Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/elidr/TaskHiveBot.git
   cd TaskHiveBot
   ```

2. **Create Environment File**
   Create a `.env` file in the root directory with the following content:
   ```env
   OPENAI_API_KEY=your_api_key_here
   PORT=5000
   FLASK_ENV=development
   ```

3. **Docker Setup**
   ```bash
   # Build and start the containers
   docker-compose up --build

   # For development with live reload
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5000`
   - The landing page will be available at `http://localhost:5000`
   - The main application will be available at `http://localhost:5000/app`

### Development Setup

#### Backend Development
1. **Python Environment Setup**
   ```bash
   # Create a virtual environment
   python -m venv venv
   
   # Activate the virtual environment
   # On Windows:
   .\venv\Scripts\activate
   # On Unix or MacOS:
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   ```

2. **Run Backend Locally**
   ```bash
   # Set environment variables
   set FLASK_APP=backend/app.py
   set FLASK_ENV=development
   
   # Run the Flask application
   flask run
   ```

#### Frontend Development
1. **Static Files**
   - Frontend files are located in the `frontend` directory
   - Static assets (CSS, JS, images) are in `frontend/static`
   - Main application page is `frontend/app.html`
   - Landing page is `frontend/landing.html`

2. **Live Development**
   - The application supports live reload during development
   - Changes to frontend files will automatically refresh the browser

### Production Deployment

1. **Build Production Containers**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
   ```

2. **Environment Configuration**
   - Update `.env` file with production settings
   - Set `FLASK_ENV=production`
   - Configure appropriate security settings

### Troubleshooting

1. **Common Issues**
   - **Port Already in Use**: Change the `PORT` in `.env` file
   - **Docker Build Fails**: Ensure Docker Desktop is running
   - **API Key Issues**: Verify OpenAI API key in `.env`

2. **Logs**
   ```bash
   # View container logs
   docker-compose logs -f
   ```

---

## 📁 Folder Structure

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

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support, please open an issue in the GitHub repository.

---

> © 2025 Elizandro Duran, Drew Houchens, Bryan Hancock, Alexis Liew — *Made in Colorado Springs*
