import React, { useState } from 'react'
import QuizForm from './components/QuizForm'
import HistoryTable from './components/HistoryTable'

function App() {
  const [activeTab, setActiveTab] = useState('generate')

  return (
    <div className="min-h-screen bg-background font-sans text-gray-800">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo area */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                W
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                WikiQuiz <span className="text-indigo-600">AI</span>
              </span>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'generate'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 group-hover:bg-gray-200'
                  }`}
              >
                Generate Quiz
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'history'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                Past Quizzes
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'generate' ? <QuizForm /> : <HistoryTable />}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500">
        <p>© 2026 WikiQuiz AI Generator. Built with Gemini 2.0.</p>
      </footer>
    </div>
  )
}

export default App
