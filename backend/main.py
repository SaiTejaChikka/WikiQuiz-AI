from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, database, scraper, llm_service
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wiki Quiz Generator")

import os

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set this to the frontend URL specifically if possible, but * works for public APIs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-quiz", response_model=schemas.QuizResponse)
def generate_quiz(request: schemas.QuizRequest, db: Session = Depends(database.get_db)):
    # 1. Check if URL already exists
    existing_quiz = db.query(models.Quiz).filter(models.Quiz.url == request.url).first()
    
    if existing_quiz and not request.force_refresh:
        # Reconstruct response from DB types
        # This is a bit manual because of the separated tables. 
        # Ideally we'd use a more complex query or ORM lazy loading but this works.
        
        # Prepare pydantic response
        quiz_items = []
        for q in existing_quiz.questions:
            quiz_items.append(schemas.QuestionBase(
                question=q.question_text,
                options=q.options,
                answer=q.answer,
                difficulty=q.difficulty,
                explanation=q.explanation
            ))
            
        related = [t.topic_name for t in existing_quiz.related_topics]
        
        return schemas.QuizResponse(
            id=existing_quiz.id,
            url=existing_quiz.url,
            title=existing_quiz.title,
            summary=existing_quiz.summary,
            key_entities=existing_quiz.key_entities,
            sections=existing_quiz.sections,
            quiz=quiz_items,
            related_topics=related
        )
    
    # If forcing refresh and quiz exists, delete old one (or just create new questions? 
    # Simpler to delete old one to keep URL unique constraint valid)
    if existing_quiz and request.force_refresh:
        # Delete related items first due to foreign keys if cascade isn't set perfectly
        db.query(models.Question).filter(models.Question.quiz_id == existing_quiz.id).delete()
        db.query(models.RelatedTopic).filter(models.RelatedTopic.quiz_id == existing_quiz.id).delete()
        db.delete(existing_quiz)
        db.commit()

    # 2. Scrape
    try:
        scraped_data = scraper.scrape_wikipedia(request.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Generate with LLM
    try:
        llm_data = llm_service.generate_quiz_from_text(scraped_data['full_text'], scraped_data['sections'])
        if not llm_data:
             raise HTTPException(status_code=500, detail="Failed to generate quiz from LLM")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 4. Save to DB
    new_quiz = models.Quiz(
        url=request.url,
        title=scraped_data['title'],
        summary=scraped_data['summary'],
        key_entities=llm_data.get('key_entities', {}),
        sections=scraped_data['sections']
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    # Add questions
    questions_data = llm_data.get('quiz', [])
    for q in questions_data:
        new_q = models.Question(
            quiz_id=new_quiz.id,
            question_text=q['question'],
            options=q['options'],
            answer=q['answer'],
            difficulty=q['difficulty'],
            explanation=q['explanation']
        )
        db.add(new_q)
    
    # Add related topics
    topics = llm_data.get('related_topics', [])
    for t in topics:
        new_t = models.RelatedTopic(
            quiz_id=new_quiz.id,
            topic_name=t
        )
        db.add(new_t)
        
    db.commit()

    # Refetch to get full object with relations populated or just construct it manually
    # Let's construct manually to avoid refresh issues with relationships not eagerly loaded
    
    quiz_items_resp = [schemas.QuestionBase(**q) for q in questions_data]
    
    return schemas.QuizResponse(
        id=new_quiz.id,
        url=new_quiz.url,
        title=new_quiz.title,
        summary=new_quiz.summary,
        key_entities=new_quiz.key_entities,
        sections=new_quiz.sections,
        quiz=quiz_items_resp,
        related_topics=topics
    )

@app.get("/history", response_model=List[schemas.QuizResponse])
def get_history(db: Session = Depends(database.get_db)):
    quizzes = db.query(models.Quiz).all()
    results = []
    for qz in quizzes:
        # This N+1 query problem is inefficient but fine for a prototype.
        # Can be optimized with joinedload.
        
        quiz_items = []
        for q in qz.questions:
            quiz_items.append(schemas.QuestionBase(
                question=q.question_text,
                options=q.options,
                answer=q.answer,
                difficulty=q.difficulty,
                explanation=q.explanation
            ))
        related = [t.topic_name for t in qz.related_topics]
        
        results.append(schemas.QuizResponse(
            id=qz.id,
            url=qz.url,
            title=qz.title,
            summary=qz.summary,
            key_entities=qz.key_entities,
            sections=qz.sections,
            quiz=quiz_items,
            related_topics=related
        ))
    return results

@app.get("/quiz/{quiz_id}", response_model=schemas.QuizResponse)
def get_quiz_details(quiz_id: int, db: Session = Depends(database.get_db)):
    qz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not qz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    quiz_items = []
    for q in qz.questions:
        quiz_items.append(schemas.QuestionBase(
            question=q.question_text,
            options=q.options,
            answer=q.answer,
            difficulty=q.difficulty,
            explanation=q.explanation
        ))
    related = [t.topic_name for t in qz.related_topics]
    
    return schemas.QuizResponse(
        id=qz.id,
        url=qz.url,
        title=qz.title,
        summary=qz.summary,
        key_entities=qz.key_entities,
        sections=qz.sections,
        quiz=quiz_items,
        related_topics=related
    )
