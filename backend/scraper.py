import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url: str):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch URL: {e}")

    soup = BeautifulSoup(response.content, 'html.parser')

    # Title
    title = soup.find('h1', id='firstHeading').text

    # Content
    content_div = soup.find('div', id='bodyContent')
    
    # Extract sections (h2)
    sections = []
    for h2 in content_div.find_all('h2'):
        span = h2.find('span', class_='mw-headline')
        if span:
            sections.append(span.text)
    
    # Extract text (paragraphs)
    # We'll fetch the first few paragraphs for summary and the rest for context
    paragraphs = content_div.find_all('p')
    text_content = ""
    summary = ""
    
    for i, p in enumerate(paragraphs):
        text = p.get_text()
        if text.strip():
            text_content += text + "\n"
            if i < 3 and not summary: # First non-empty paragraph roughly
                 summary += text
            elif i < 3:
                 summary += text

    # Cleaning: Remove citations like [1], [2]
    cleaned_text = re.sub(r'\[\d+\]', '', text_content)
    cleaned_summary = re.sub(r'\[\d+\]', '', summary).strip()

    return {
        "title": title,
        "summary": cleaned_summary[:1000], # Trucate summary
        "full_text": cleaned_text[:15000], # Limit text for LLM context window if needed, though Gemini has large window
        "sections": sections
    }
