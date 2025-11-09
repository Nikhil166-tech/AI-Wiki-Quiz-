# 📚 AI Wiki Quiz Generator: Full-Stack Project Report

This project is a full-stack web application designed to automate the creation of educational quizzes from unstructured Wikipedia content. It leverages advanced AI and web technologies to provide a seamless **Generate** and **History** experience.

## 🚀 Key Features

* **Intelligent AI Generation:** Utilizes the **Gemini LLM** via LangChain to generate high-quality quizzes (5-10 questions) grounded *only* in the provided article content.
* **Structured Data Output:** Guarantees reliable data transmission by enforcing a strict **Pydantic JSON schema**.
* **Robust Data Pipeline:** Handles web scraping, content cleaning, AI orchestration, and database persistence in a unified FastAPI backend.
* **History Tracking:** All generated quizzes are stored using **SQLAlchemy** for easy retrieval and viewing.

***

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend API** | Python 3.10+, **FastAPI** | High-performance, asynchronous web service for handling business logic. |
| **AI Integration** | **Gemini (via LangChain)** | LLM for core quiz generation and information extraction. |
| **Data Access** | **SQLAlchemy** (using MySQL/PostgreSQL/SQLite) | Object Relational Mapper (ORM) for reliable database operations. |
| **Data Acquisition** | **BeautifulSoup4, Requests** | HTML parsing and robust web scraping of Wikipedia content. |
| **Frontend UI** | **React / Vite** | Modern, component-based user interface for presentation. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for clean, minimal UI design. |

***

## 📝 Setup and Installation Guide

### 1. Backend Setup (Python / FastAPI)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate the virtual environment:**
    ```bash
    # For Windows:
    python -m venv venv
    venv\Scripts\activate
    
    # For Linux/macOS:
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt 
    # Recommended command for initial setup:
    pip install fastapi uvicorn[standard] sqlalchemy beautifulsoup4 requests pydantic langchain-core langchain-community python-dotenv langchain-google-genai
    ```

4.  **API Key Setup:**
    Create a file named **`.env`** inside the `backend/` folder and configure your keys and database connection string.
    ```env
    # backend/.env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
    # Example for SQLite (local file database):
    DATABASE_URL="sqlite:///./quiz_history.db" 
    ```

5.  **Start the FastAPI Backend:**
    **Crucial Note:** Execute this command **from the project root directory (`ai-quiz-generator/`)** to ensure correct module imports and avoid `ModuleNotFoundError`.

    ```bash
    # Go back to project root
    cd .. 
    
    # Run the server
    uvicorn backend.main:app --reload
    ```
    The API will be available at `http://127.0.0.1:8000`. Keep this terminal open.

### 2. Frontend Setup (React / Vite)

1.  **Open a new terminal window.**
2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
3.  **Install Node dependencies:**
    ```bash
    npm install
    ```
4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The UI will be served at `http://localhost:5173` (or similar). Open this URL in your browser.

***

## 🗺️ API Endpoints

The FastAPI backend exposes the following three data management and generation endpoints:

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/generate_quiz` | Accepts a URL, runs the scraping/LLM process, saves to DB, and returns the full structured quiz data. | `{ "url": "..." }` | Full `QuizOutput` JSON |
| **GET** | `/history` | Returns a list of all quiz IDs, titles, URLs, and generation dates stored in the database. | None | List of summary quiz objects |
| **GET** | `/quiz/{quiz_id}` | Fetches a specific quiz record by ID, deserializes the stored JSON, and returns the complete quiz structure. | None | Full `QuizOutput` JSON |

***

## 🧠 LLM Prompt Template for Quiz Generation

The project relies on this detailed instruction set to ensure the Gemini model returns high-quality, structured output. This template is dynamically loaded and combined with the article text and Pydantic format instructions in `llm_quiz_generator.py`.

```python
QUIZ_GENERATION_TEMPLATE = """
You are an expert educational assistant. Your task is to analyze the provided Wikipedia article text and generate a structured, educational quiz.

--- Article Title: {title} ---
--- Article Content: ---
{scraped_content}
--- End of Content ---

INSTRUCTIONS:
1. Generate between 5 and 10 quiz questions based ONLY on the provided content.
2. Each question must have exactly four options (A, B, C, D).
3. Provide the exact correct answer from the options, a short explanation, and a difficulty level ('easy', 'medium', or 'hard').
4. Extract 3-5 relevant and specific 'related_topics' for further reading based on the content.
5. Identify a dictionary of 'key_entities' categorized by 'people', 'organizations', and 'locations'.
6. Infer the main historical or conceptual 'sections' covered in the text (e.g., 'Early Life', 'Impact', 'Technology').
7. The output MUST strictly conform to the following JSON schema. Do not include any text outside the JSON object.

{format_instructions}

Generated Quiz (in JSON format):
"""