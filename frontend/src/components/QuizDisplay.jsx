import React from 'react';

const QuizDisplay = ({ quizData }) => {
    if (!quizData) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-indigo-700">{quizData.title}</h2>
            
            {/* Summary and Key Entities */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="italic text-gray-700">Summary: {quizData.summary}</p>
                <p className="text-sm mt-2">
                    <span className="font-semibold">Key Topics:</span> {quizData.related_topics.join(' | ')}
                </p>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-8">
                {quizData.quiz.map((q, index) => (
                    <div key={index} className="p-4 border-l-4 border-indigo-500 bg-white shadow-md rounded-md">
                        <p className="font-bold text-lg mb-2">
                            {index + 1}. {q.question} 
                            <span className={`ml-3 text-xs font-semibold ${q.difficulty === 'easy' ? 'text-green-600' : q.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                ({q.difficulty})
                            </span>
                        </p>
                        
                        <ul className="space-y-1 text-sm">
                            {q.options.map((option, optIndex) => (
                                <li 
                                    key={optIndex} 
                                    className={`p-2 rounded-md ${option === q.answer ? 'bg-green-100 font-medium' : 'bg-gray-50'}`}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                        
                        <p className="mt-3 text-sm text-gray-600">
                            <span className="font-semibold">Explanation:</span> {q.explanation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizDisplay;