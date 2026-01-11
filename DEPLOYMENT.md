# Deployment Guide

This guide will help you deploy the Wiki Quiz Generator to free hosting platforms: **Render** (Backend) and **Vercel** (Frontend).

## 1. Deploy Backend to Render

1.  **Sign Up/Login**: Go to [render.com](https://render.com) and log in with your GitHub account.
2.  **New Web Service**:
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository (`WikiQuiz-AI`).
3.  **Configure Settings**:
    *   **Name**: `wiki-quiz-backend` (or similar)
    *   **Region**: Choose closest to you (e.g., Singapore, Frankfurt)
    *   **Root Directory**: `backend`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn main:app -k uvicorn.workers.UvicornWorker`
4.  **Environment Variables**:
    *   Scroll down to **Environment Variables** and add:
        *   `GOOGLE_API_KEY`: *[Your Google Gemini API Key]*
        *   `DATABASE_URL`: `sqlite:///./wiki_quiz.db` (Note: Data will be lost on restart. For persistence, use a managed Postgres URL).
        *   `PYTHON_VERSION`: `3.11.9` (Optional, but recommended to match your local env).
5.  **Deploy**: Click **Create Web Service**.
6.  **Copy URL**: Once deployed, copy the service URL (e.g., `https://wiki-quiz-backend.onrender.com`). You will need this for the frontend.

## 2. Deploy Frontend to Vercel

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com) and log in with GitHub.
2.  **Add New Project**:
    *   Click **Add New...** -> **Project**.
    *   Import your `WikiQuiz-AI` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   Expand **Environment Variables**.
    *   Key: `VITE_API_URL`
    *   Value: *[Paste your Render Backend URL here]* (e.g., `https://wiki-quiz-backend.onrender.com`) - **IMPORTANT**: Remove any trailing slash `/`.
5.  **Deploy**: Click **Deploy**.

## 3. Verify Integration

1.  Open your Vercel App URL.
2.  Try to generate a quiz.
    *   If it fails, check the Console (F12) for CORS errors.
    *   Check if the **Backend** is awake (Render free tier sleeps after inactivity; the first request might take 50s+).

## Important Limitations (Free Tier)
*   **Cold Starts**: Render's free tier spins down after 15 mins of inactivity. The first request will take ~1 minute to wake it up.
*   **Database**: SQLite on Render is **ephemeral**. Your generated quizzes history **will disappear** every time the server restarts or deploys. For permanent history, use a free PostgreSQL database (e.g., Supabase, Neon.tech) and update the `DATABASE_URL` in Render.
