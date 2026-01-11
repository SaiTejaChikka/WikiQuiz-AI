import { useState } from 'react'

function TakeQuiz({ data, onBack }) {
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    if (!data) return null

    const handleSelect = (idx, option) => {
        if (submitted) return
        setAnswers(prev => ({ ...prev, [idx]: option }))
    }

    const handleSubmit = () => {
        let correctCount = 0
        data.quiz.forEach((q, idx) => {
            if (answers[idx] === q.answer) {
                correctCount++
            }
        })
        setScore(correctCount)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Calculate progress
    const answeredCount = Object.keys(answers).length
    const totalCount = data.quiz.length
    const progress = (answeredCount / totalCount) * 100

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Header / Nav */}
            <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium mb-6"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to History
            </button>

            {/* Score Card / Intro */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Topic: {data.title}</h2>
                <p className="text-gray-500">
                    {submitted
                        ? "Quiz Completed!"
                        : `Question ${Math.min(answeredCount + 1, totalCount)} of ${totalCount}`}
                </p>

                {submitted && (
                    <div className="mt-6 animate-fade-in">
                        <div className="inline-block p-4 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                            <div className="text-4xl font-bold text-emerald-600">{score} / {totalCount}</div>
                        </div>
                        <p className="text-lg font-medium text-gray-700">
                            {score === totalCount ? 'Perfect Score! 🎉' : score > totalCount / 2 ? 'Good Job! 👍' : 'Keep Learning! 📚'}
                        </p>
                    </div>
                )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
                {data.quiz.map((q, index) => {
                    const selected = answers[index]

                    return (
                        <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    <span className="text-gray-400 mr-2">{index + 1}.</span>
                                    {q.question}
                                </h3>
                                <span className="text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                    {q.difficulty}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {q.options.map((opt, i) => {
                                    let optionClass = "relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 "

                                    if (submitted) {
                                        if (opt === q.answer) {
                                            optionClass += "bg-emerald-50 border-emerald-500 text-emerald-900"
                                        } else if (opt === selected && opt !== q.answer) {
                                            optionClass += "bg-red-50 border-red-500 text-red-900 opacity-60"
                                        } else {
                                            optionClass += "bg-gray-50 border-transparent opacity-50 cursor-default"
                                        }
                                    } else {
                                        if (opt === selected) {
                                            optionClass += "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                                        } else {
                                            optionClass += "bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                        }
                                    }

                                    return (
                                        <div
                                            key={i}
                                            className={optionClass}
                                            onClick={() => handleSelect(index, opt)}
                                        >
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${submitted
                                                    ? (opt === q.answer ? 'bg-emerald-500 border-emerald-500 text-white' : (opt === selected ? 'border-red-500 text-red-500' : 'border-gray-300'))
                                                    : (opt === selected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300')
                                                }`}>
                                                {submitted && opt === q.answer && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                                                {submitted && opt === selected && opt !== q.answer && <span className="font-bold">✕</span>}
                                            </div>
                                            <span className="font-medium">{opt}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            {submitted && (
                                <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600">
                                    <span className="font-bold text-gray-800">Explanation:</span> {q.explanation}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {!submitted && (
                <div className="sticky bottom-6 pb-6">
                    <button
                        className={`w-full py-4 rounded-xl shadow-lg text-lg font-bold text-white transition-all transform hover:scale-[1.01] ${answeredCount === totalCount
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200'
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        onClick={handleSubmit}
                        disabled={answeredCount < totalCount}
                    >
                        {answeredCount < totalCount ? `Answer all questions (${answeredCount}/${totalCount})` : 'Submit Quiz'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default TakeQuiz
