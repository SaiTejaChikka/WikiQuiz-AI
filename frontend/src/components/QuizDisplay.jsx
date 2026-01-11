import React, { useState } from 'react'

function QuizDisplay({ data }) {
    if (!data) return null

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Section 2: Article Preview Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <img src="https://www.wikipedia.org/static/favicon/wikipedia.ico" alt="Wiki" className="w-4 h-4 opacity-70" />
                                <span className="truncate max-w-md">{data.url}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">{data.title}</h2>
                            <p className="text-gray-600 leading-relaxed max-w-4xl">{data.summary}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                            {data.sections.length} Sections
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                            {Object.values(data.key_entities).flat().length} Entities Extracted
                        </span>
                    </div>
                </div>
            </div>

            {/* Section 3: Quiz Display */}
            <div className="space-y-6">
                <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">Generated Quiz</h3>
                    <span className="ml-3 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">{data.quiz.length} Questions</span>
                </div>

                <div className="grid gap-6">
                    {data.quiz.map((q, index) => (
                        <QuestionItem key={index} q={q} index={index} />
                    ))}
                </div>
            </div>

            {/* Section 4: Related Topics */}
            {data.related_topics && data.related_topics.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Topics for Further Reading</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.related_topics.map((topic, i) => (
                            <a
                                key={i}
                                href={`https://en.wikipedia.org/wiki/${topic}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-full bg-gray-50 text-gray-700 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors duration-200 text-sm font-medium"
                            >
                                {topic}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function QuestionItem({ q, index }) {
    const [selectedOption, setSelectedOption] = useState(null)
    const [showAnswer, setShowAnswer] = useState(false)

    const handleOptionClick = (opt) => {
        if (showAnswer) return
        setSelectedOption(opt)
        setShowAnswer(true)
    }

    const getOptionClass = (opt) => {
        let base = "relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 group "

        if (showAnswer) {
            if (opt === q.answer) {
                return base + "bg-green-50 border-green-500 text-green-900" // Correct
            }
            if (opt === selectedOption && opt !== q.answer) {
                return base + "bg-red-50 border-red-500 text-red-900" // Wrong selection
            }
            if (opt !== q.answer) {
                return base + "bg-white border-gray-200 opacity-60" // Others
            }
        } else {
            // Default interactive state
            return base + "bg-white border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
        }
        return base
    }

    const getDifficultyColor = (diff) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'bg-green-100 text-green-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'hard': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                        {index + 1}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900">{q.question}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {q.options.map((opt, i) => (
                    <div
                        key={i}
                        className={getOptionClass(opt)}
                        onClick={() => handleOptionClick(opt)}
                    >
                        {/* Radio selection indicator */}
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${showAnswer
                                ? (opt === q.answer ? 'border-green-600 bg-green-600' : (opt === selectedOption ? 'border-red-600' : 'border-gray-300'))
                                : 'border-gray-300 group-hover:border-indigo-400'
                            }`}>
                            {(showAnswer && opt === q.answer) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>}
                        </div>
                        <span className="font-medium text-base">{opt}</span>
                    </div>
                ))}
            </div>

            {/* Answer & Explanation */}
            {showAnswer && (
                <div className="mt-6 pt-5 border-t border-gray-100 animate-fade-in">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                        <div className="flex-shrink-0 mt-1">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <p className="font-bold text-indigo-900 mb-1">
                                {selectedOption === q.answer ? 'Excellent!' : 'Correct Answer: ' + q.answer}
                            </p>
                            <p className="text-indigo-800 leading-relaxed text-sm">
                                {q.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!showAnswer && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowAnswer(true)}
                        className="text-sm text-gray-500 hover:text-indigo-600 font-medium underline transition-colors"
                    >
                        Reveal Answer
                    </button>
                </div>
            )}
        </div>
    )
}

export default QuizDisplay
