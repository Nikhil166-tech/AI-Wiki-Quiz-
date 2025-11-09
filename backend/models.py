from pydantic import BaseModel, Field
from typing import List, Dict, Any

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")
    explanation: str

class QuizOutput(BaseModel):
    id: int = Field(0, description="Placeholder for the DB ID once saved.")
    url: str
    title: str
    summary: str
    key_entities: Dict[str, List[str]]
    sections: List[str]
    quiz: List[QuizQuestion]
    related_topics: List[str]

class GenerateQuizRequest(BaseModel):
    url: str

class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    date_generated: str