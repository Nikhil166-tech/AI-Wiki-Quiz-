const API_BASE_URL = 'http://127.0.0.1:8000';

export async function generateQuiz(url) {
    const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });
    if (!response.ok) {
        throw new Error('Failed to generate quiz.');
    }
    return response.json();
}

export async function getHistory() {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) {
        throw new Error('Failed to fetch quiz history.');
    }
    return response.json();
}

export async function getQuizDetails(id) {
    const response = await fetch(`${API_BASE_URL}/quiz/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch quiz details for ID: ${id}`);
    }
    return response.json();
}