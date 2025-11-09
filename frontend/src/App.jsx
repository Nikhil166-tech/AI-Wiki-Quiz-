import React, { useState } from 'react';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

const App = () => {
    const [activeTab, setActiveTab] = useState('generate');

    const TabButton = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-150 ${
                activeTab === tabName
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        AI Wiki Quiz Generator 🧠
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg">
                    
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="flex space-x-4">
                            <TabButton tabName="generate" label="1. Generate Quiz" />
                            <TabButton tabName="history" label="2. Past Quizzes (History)" />
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {activeTab === 'generate' && <GenerateQuizTab />}
                        {activeTab === 'history' && <HistoryTab />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;