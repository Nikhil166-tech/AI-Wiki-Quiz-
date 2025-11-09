import json
from typing import List
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc

# --- CORRECT IMPORTS (Assume these are the final model names) ---
from .database import get_db, Quiz
from .scraper import scrape_wikipedia
from .llm_quiz_generator import generate_quiz_data
from .models import GenerateQuizRequest, QuizHistoryItem, QuizOutput
# ----------------------------------------------------------------

app = FastAPI(
    title="DeepKlarity AI Wiki Quiz Generator"
)

# --- CORS CONFIGURATION ---
# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",  # Your Vite/React development server
    "http://127.0.0.1:5173",  # Alternative localhost address
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------

@app.post("/generate_quiz", response_model=QuizOutput)
async def generate_and_save_quiz(
    request: GenerateQuizRequest, 
    db: Session = Depends(get_db)
):
    url = request.url

    # 1. SCRAPING
    title, scraped_content = scrape_wikipedia(url)

    if not scraped_content or "Error:" in scraped_content or title is None:
        # NOTE: Added 'title is None' check for the scraper's error return
        detail_msg = scraped_content if scraped_content and "Error:" in scraped_content else "Invalid URL or content not found."
        raise HTTPException(
            status_code=400, 
            detail=f"Scraping failed: {detail_msg}"
        )

    # 2. LLM GENERATION
    try: 
        quiz_data: QuizOutput = generate_quiz_data(title, url, scraped_content)
    except Exception as e:
        print(f"LLM Generation Error: {e}") 
        raise HTTPException(
            status_code=500, 
            detail=f"AI processing failed. Details: {str(e)}"
        )

    # 3. DATABASE SAVE
    quiz_json_str = quiz_data.model_dump_json() 

    db_quiz = Quiz(
        url=url,
        title=quiz_data.title,
        scraped_content=scraped_content,
        full_quiz_data=quiz_json_str
    )

    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    
    # 4. RETURN RESPONSE
    quiz_data.id = db_quiz.id
    return quiz_data

# --- HISTORY ENDPOINT ---
@app.get("/history", response_model=List[QuizHistoryItem])
def get_quiz_history(db: Session = Depends(get_db)):
    quizzes = db.query(Quiz.id, Quiz.url, Quiz.title, Quiz.date_generated).order_by(desc(Quiz.date_generated)).all()
    
    history_list = []
    for quiz in quizzes:
        history_list.append(QuizHistoryItem(
            id=quiz.id,
            url=quiz.url,
            title=quiz.title,
            date_generated=quiz.date_generated.isoformat()
        ))
    return history_list

# --- SINGLE QUIZ ENDPOINT ---
@app.get("/quiz/{quiz_id}", response_model=QuizOutput)
def get_single_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz_record = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    
    if not quiz_record:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    try:
        quiz_data_dict = json.loads(quiz_record.full_quiz_data)
        quiz_data_dict['id'] = quiz_record.id
        return QuizOutput(**quiz_data_dict)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Corrupted quiz data in database.")