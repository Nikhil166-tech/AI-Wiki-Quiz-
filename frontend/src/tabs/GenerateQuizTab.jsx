import React, { useState } from 'react';
import { generateQuiz } from '../services/api';
import QuizDisplay from '../components/QuizDisplay';

const GenerateQuizTab = () => {
    const [url, setUrl] = useState('');
    const [quizResult, setQuizResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setQuizResult(null);
        setLoading(true);

        if (!url || !url.startsWith('https://en.wikipedia.org/wiki/')) {
            setError('Please enter a valid Wikipedia URL.');
            setLoading(false);
            return;
        }

        try {
            const data = await generateQuiz(url);
            setQuizResult(data);
        } catch (err) {
            console.error('Quiz Generation Error:', err);
            setError(err.message || 'Failed to generate quiz. Check the console and FastAPI logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate New Quiz</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter Wikipedia URL (e.g., https://en.wikipedia.org/wiki/..."
                    required
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-150"
                >
                    {loading ? 'Processing...' : 'Generate Quiz'}
                </button>
            </form>

            {/* Status and Error Messages */}
            {loading && (
                <div className="text-center p-4 text-indigo-600 font-medium">
                    <p>Generating quiz from Wikipedia...</p>
                    <p className="text-sm">This may take up to 30 seconds as the LLM processes the text.</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500 rounded-md">
                    Error: {error}
                </div>
            )}

            {/* Quiz Display */}
            {quizResult && (
                <div className="mt-8 p-6 bg-white shadow-xl rounded-xl">
                    <QuizDisplay quizData={quizResult} />
                </div>
            )}
        </div>
    );
};

export default GenerateQuizTab;