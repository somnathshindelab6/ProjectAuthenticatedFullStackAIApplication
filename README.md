# Authenticated Full-Stack AI Application

This project is a full-stack task management application with authentication, protected user-owned data, and an AI/RAG workflow. Users can register, log in, manage tasks, and ask the AI assistant for guidance based on their stored content and documents.

## Features
- React frontend with authentication screens and protected routes
- Flask backend with JWT-based auth
- SQLAlchemy models for users, tasks, categories, documents, and embeddings
- Login rate limiting and password reset support
- AI/RAG endpoints for ingesting content and generating source-backed responses

## Project Links
- GitHub repository: https://github.com/somnathshindelab6/ProjectAuthenticatedFullStackAIApplication
- Deployed app: https://somnathshindelab6.github.io/ProjectAuthenticatedFullStackAIApplication/

## Local Setup
### Backend
1. Open the backend folder
2. Create and activate a virtual environment
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy .env.example to .env and update the values
5. Create the database and seed demo data:
   ```bash
   python create_db.py
   ```
6. Start the app:
   ```bash
   python app.py
   ```

### Frontend
1. Open the frontend folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Database
The app uses SQLite locally by default through DATABASE_URL. The seed script creates a demo user and sample categories, tasks, and documents.

## AI/RAG Workflow
The backend includes endpoints for ingesting documents and asking AI questions using stored content as context. This can be extended to a production vector database later.

## Deployment Notes
- Frontend is configured for GitHub Pages
- Backend can be deployed separately to Render, Railway, or Heroku
- Set environment variables in production for secrets and API access

## Repository Expectations
This repository includes:
- React frontend code
- Flask backend code
- SQL database setup and seed instructions
- AI/RAG workflow code
- .env example file
- Dependency files
- README documentation

