import React, { useState } from 'react'
import axios from 'axios'
import QuizDisplay from './QuizDisplay'

function QuizForm() {
    const [url, setUrl] = useState('')
    const [forceRefresh, setForceRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [quizData, setQuizData] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)
        setError('')
        setQuizData(null)

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const res = await axios.post(`${API_URL}/generate-quiz`, {
                url,
                force_refresh: forceRefresh
            })
            setQuizData(res.data)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.detail || 'An error occurred while generating the quiz. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Section 1: URL Input Card */}
            {!quizData && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-3xl mx-auto transform transition-all hover:shadow-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Quiz from Wikipedia</h1>
                        <p className="text-gray-500 text-lg">Paste a Wikipedia article URL below to generate an AI-powered quiz instantly.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400">🔗</span>
                            </div>
                            <input
                                type="url"
                                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition duration-150 ease-in-out sm:text-lg shadow-sm"
                                placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={forceRefresh}
                                    onChange={(e) => setForceRefresh(e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                                />
                                <span>Regenerate (ignore cache - costs quota)</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.01] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Scraping article & generating quiz...</span>
                                </div>
                            ) : (
                                'Generate Quiz'
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700 flex items-start space-x-2 animate-fade-in">
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Quiz Result */}
            {quizData && (
                <div className="animate-fade-in">
                    <QuizDisplay data={quizData} />

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => { setQuizData(null); setUrl(''); }}
                            className="text-indigo-600 font-medium hover:text-indigo-800 underline"
                        >
                            Generate Another Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizForm
