import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set.")

genai.configure(api_key=GOOGLE_API_KEY)

def generate_quiz_from_text(text: str, sections: list):
    # Try requested model
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        prompt = f"""
        You are an AI assistant that generates educational quizzes.
    
    SOURCE TEXT:
    {text}
    
    SECTIONS:
    {", ".join(sections)}

    TASK:
    1. Extract key entities (People, Organizations, Locations).
    2. Generate 5-10 multiple-choice questions (easy, medium, hard).
    3. Suggest 3-5 related topics.

    OUTPUT JSON (No markdown):
    {{
        "key_entities": {{ "people": [], "organizations": [], "locations": [] }},
        "quiz": [
            {{
                "question": "...",
                "options": ["A", "B", "C", "D"],
                "answer": "...",
                "difficulty": "easy",
                "explanation": "..."
            }}
        ],
        "related_topics": []
    }}
    """
    
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Clean markdown
        if content.startswith("```json"): content = content[7:]
        if content.startswith("```"): content = content[3:]
        if content.endswith("```"): content = content[:-3]
            
        return json.loads(content)
    except Exception as e:
        print(f"Error generation: {e}")
        raise e
