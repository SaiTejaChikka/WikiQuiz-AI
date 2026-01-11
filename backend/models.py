from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String)
    summary = Column(Text)
    key_entities = Column(JSON) # Stores {"people": [], "organizations": [], "locations": []}
    sections = Column(JSON) # List of section titles

    questions = relationship("Question", back_populates="quiz")
    related_topics = relationship("RelatedTopic", back_populates="quiz")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(Text)
    options = Column(JSON) # List of 4 strings
    answer = Column(String)
    difficulty = Column(String)
    explanation = Column(Text)

    quiz = relationship("Quiz", back_populates="questions")

class RelatedTopic(Base):
    __tablename__ = "related_topics"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    topic_name = Column(String)

    quiz = relationship("Quiz", back_populates="related_topics")
