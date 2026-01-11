from pydantic import BaseModel
from typing import List, Dict, Optional

class QuestionBase(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

class RelatedTopicBase(BaseModel):
    topic_name: str

class QuizBase(BaseModel):
    url: str
    title: str
    summary: str
    key_entities: Dict[str, List[str]]
    sections: List[str]

class QuizResponse(QuizBase):
    id: int
    quiz: List[QuestionBase]
    related_topics: List[str]

    class Config:
        orm_mode = True

class QuizRequest(BaseModel):
    url: str
    force_refresh: bool = False
