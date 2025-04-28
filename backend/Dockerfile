FROM python:3.11-slim

WORKDIR /app

# Install the dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

EXPOSE 5000

CMD ["python", "backend/app.py"]
