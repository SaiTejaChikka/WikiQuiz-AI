import React, { useEffect, useState } from 'react'
import axios from 'axios'
import QuizModal from './QuizModal'
import TakeQuiz from './TakeQuiz'

function HistoryTable() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [takeQuizMode, setTakeQuizMode] = useState(null)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const res = await axios.get(`${API_URL}/history`)
            setHistory(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // If in "Take Quiz" mode, show that component entirely
    if (takeQuizMode) {
        return <TakeQuiz data={takeQuizMode} onBack={() => setTakeQuizMode(null)} />
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500 font-medium">Loading history...</p>
            </div>
        )
    }

    if (history.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Quizzes Generated Yet</h3>
                <p className="text-gray-500 mb-8">Generate your first quiz from the "Generate Quiz" tab to see it listed here.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Past Quizzes</h2>
                <button
                    onClick={fetchHistory}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Questions</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                    <td className="px-6 py-4 text-sm text-gray-500">#{item.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{item.title}</div>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[200px] block">
                                            {item.url}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.quiz.length} Qs
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                                            onClick={() => setSelectedQuiz(item)}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="bg-indigo-600 border border-transparent text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors"
                                            onClick={() => setTakeQuizMode(item)}
                                        >
                                            Take Quiz
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedQuiz && (
                <QuizModal
                    data={selectedQuiz}
                    onClose={() => setSelectedQuiz(null)}
                />
            )}
        </div>
    )
}

export default HistoryTable
