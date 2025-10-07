# Use official lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (Cloud Run uses PORT env var)
ENV PORT=8080

# Start your app using Gunicorn
CMD exec gunicorn --bind :$PORT test:app
