"use client"

import { useState } from "react"
import { ArrowRight, RotateCcw } from "lucide-react"
import { darkButton, primaryButton, secondaryButton } from "@/components/plans/bits"

type Props = {
    questions: QuizQuestion[]
    onFinish: () => void
}

const Quiz = ({ questions, onFinish }: Props) => {
    const [index, setIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [showResults, setShowResults] = useState(false)

    const question = questions[index]
    const picked = answers[question?.id]
    const isLast = index === questions.length - 1
    const correctCount = questions.filter((q) => answers[q.id] === q.answerId).length
    const missed = questions.filter((q) => answers[q.id] && answers[q.id] !== q.answerId)

    const restart = () => {
        setAnswers({})
        setIndex(0)
        setShowResults(false)
    }

    if (showResults) {
        return (
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-bold tracking-[0.08em] text-slate-500 uppercase">Practice complete</span>
                    <h2 className="font-heading text-3xl font-bold">
                        {correctCount} of {questions.length} correct
                    </h2>
                </div>
                {missed.length > 0 ? (
                    <div className="flex flex-col gap-2 rounded-2xl bg-sun-soft p-4 text-[15px] text-slate-900">
                        <p className="font-semibold">Added to your redo queue:</p>
                        <ul className="list-disc pl-5">
                            {missed.map((q) => (
                                <li key={q.id}>
                                    {q.concept}: {q.prompt}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="rounded-2xl bg-mint-soft p-4 text-[15px] font-semibold text-mint-ink">Perfect score. Nothing to redo.</p>
                )}
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={onFinish} className={primaryButton}>
                        Go to mastery check
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={restart} className={secondaryButton}>
                        <RotateCcw className="size-4" aria-hidden="true" />
                        Retry practice
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[15px] font-bold">
                        Question {index + 1} of {questions.length}
                    </span>
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-ink">{question.concept}</span>
                </div>
                <div className="flex gap-1.5" aria-hidden="true">
                    {questions.map((q, i) => {
                        const a = answers[q.id]
                        const tone = !a ? (i === index ? "bg-brand" : "bg-slate-200") : a === q.answerId ? "bg-emerald-500" : "bg-coral"
                        return <span key={q.id} className={`h-2 flex-1 rounded-full ${tone}`} />
                    })}
                </div>
            </div>

            <h2 className="font-heading text-2xl leading-snug font-bold">{question.prompt}</h2>

            <div role="group" aria-label="Answer choices" className="flex flex-col gap-2.5">
                {question.options.map((o, i) => {
                    const isAnswer = o.id === question.answerId
                    const isPicked = o.id === picked
                    const tone = !picked
                        ? "border-slate-200 bg-white hover:border-brand/50"
                        : isAnswer
                            ? "border-emerald-500 bg-mint-soft"
                            : isPicked
                                ? "border-coral bg-coral-soft"
                                : "border-slate-200 bg-white opacity-70"
                    return (
                        <button
                            key={o.id}
                            type="button"
                            disabled={!!picked}
                            aria-pressed={isPicked}
                            onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: o.id }))}
                            className={`flex min-h-14 items-center gap-3.5 rounded-2xl border-2 px-4 py-2.5 text-left text-base font-semibold transition-colors disabled:cursor-default ${tone}`}
                        >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-heading text-sm font-bold">
                                {String.fromCharCode(65 + i)}
                            </span>
                            {o.text}
                        </button>
                    )
                })}
            </div>

            {picked && (
                <p
                    role="status"
                    className={`rounded-2xl p-4 text-[15px] leading-relaxed ${
                        picked === question.answerId ? "bg-mint-soft text-mint-ink" : "bg-coral-soft text-coral-ink"
                    }`}
                >
                    <strong>{picked === question.answerId ? "Right." : "Not quite."}</strong> {question.explanation}
                </p>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    disabled={!picked}
                    onClick={() => (isLast ? setShowResults(true) : setIndex((i) => i + 1))}
                    className={darkButton}
                >
                    {isLast ? "See results" : "Next question"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}

export default Quiz
