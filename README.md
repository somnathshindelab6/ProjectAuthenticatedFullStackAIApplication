# Docket

Docket is a prototype for an authenticated AI assistant for renters facing landlord disputes. The app is designed to help a renter organize a tenancy issue, ask questions about their rights, and receive answers grounded in retrieved tenant-rights sources rather than generic web search results.

## Problem
Renters dealing with withheld deposits, ignored repairs, unclear lease clauses, or threatened eviction often have to piece together dense, jurisdiction-specific legal information without a clear way to connect it to their actual situation. Docket aims to make that process more structured and evidence-based.

## Target User
First-time renters navigating a dispute with a landlord, often without legal counsel or deep lease literacy.

## Core Experience
- Sign up and sign in securely
- Create or manage a tenancy-related case
- Ask questions about tenant rights in context
- Receive AI answers with supporting citations
- Keep a persistent record of the issue history

## Current Implementation Notes
This repository includes the core full-stack foundation for that experience:
- React frontend with authentication and protected routes
- Flask backend with JWT-based authentication
- SQLAlchemy models and SQLite-backed storage
- AI/RAG-style endpoints for ingesting content and answering questions with retrieved context
- Login rate limiting and password reset support

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
The backend includes endpoints for ingesting content and asking questions using stored context. The workflow is designed to be source-backed and can be extended to a state-specific knowledge base and richer case-modeling later.

## Deployment Notes
- Frontend is configured for GitHub Pages
- Backend can be deployed separately to Render, Railway, or Heroku
- Set production environment variables for secrets and API access

## Submission Summary
This repository includes:
- React frontend code
- Flask backend code
- SQL database setup and seed instructions
- AI/RAG workflow code
- .env example file
- Dependency files
- README documentation

