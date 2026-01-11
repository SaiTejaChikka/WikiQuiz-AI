# Wiki Quiz Generator

A full-stack application that generates quizzes from Wikipedia articles using Google Gemini LLM.

## Tech Stack
- **Backend**: Python (FastAPI), SQLAlchemy, PostgreSQL, BeautifulSoup, LangChain + Gemini
- **Frontend**: React (Vite), Axios, Vanilla CSS (Glassmorphism)

## Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL database
- Google Cloud Gemini API Key

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure `.env`:
   - Rename `.env` (or create one) with:
     ```
     GOOGLE_API_KEY=your_key
     DATABASE_URL=postgresql://user:pass@localhost/dbname
     DEMO_MODE=false
     ```
   - **Important**: If you hit API quota limits, set `DEMO_MODE=true` to use sample data instead of calling the API.
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   Server runs at `http://localhost:8000`.

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`.

## Features
- **Tab 1: Generate Quiz**: Input a Wikipedia URL to scrape content and generate a quiz.
- **Tab 2: History**: View previously generated quizzes and their details.
- **Take Quiz Mode**: Interactive mode to test your knowledge with immediate feedback and scoring.
- **Glassmorphism UI**: Modern, clean interface.

## LangChain Prompts
See `backend/llm_service.py` for the exact prompt template used.

## Testing
- Open the frontend.
- Paste a Wikipedia URL (e.g. `https://en.wikipedia.org/wiki/Python_(programming_language)`).
- Click Generate.
- Check the History tab.
