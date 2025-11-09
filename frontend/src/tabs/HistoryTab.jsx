import React, { useState, useEffect } from 'react';
import { getHistory, getQuizDetails } from '../services/api';
import Modal from '../components/Modal';
import QuizDisplay from '../components/QuizDisplay';

const HistoryTab = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data);
            setLoading(false);
        } catch (err) {
            setError('Could not load history. Is the backend running?');
            setLoading(false);
        }
    };

    const handleDetailsClick = async (id) => {
        try {
            const details = await getQuizDetails(id);
            setSelectedQuiz(details);
            setModalOpen(true);
        } catch (err) {
            setError('Failed to fetch quiz details.');
        }
    };

    if (loading) return <div className="p-6 text-center text-indigo-600">Loading history...</div>;
    if (error) return <div className="p-6 bg-red-100 text-red-700">Error: {error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Past Quizzes (History)</h2>
            
            {history.length === 0 ? (
                <p className="text-gray-500">No quizzes generated yet. Try generating one in the "Generate Quiz" tab.</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Generated</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.map((quiz) => (
                                <tr key={quiz.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quiz.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 truncate max-w-xs" title={quiz.title}>
                                        <a href={quiz.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {quiz.title}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(quiz.date_generated).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDetailsClick(quiz.id)}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Modal */}
            <Modal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)}
                title={`Quiz Details for: ${selectedQuiz?.title || 'Loading...'}`}
            >
                <QuizDisplay quizData={selectedQuiz} />
            </Modal>
        </div>
    );
};

export default HistoryTab;