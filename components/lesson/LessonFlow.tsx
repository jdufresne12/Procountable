"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Check, ExternalLink, FileText, Lock, Mic, PlayCircle, Send, Sparkles, Star, Target } from "lucide-react"

import LessonContent from "./LessonContent"
import Quiz from "./Quiz"
import { LevelBadge, OutcomeBadge, card, focusRing, primaryButton, secondaryButton } from "@/components/plans/bits"

type Props = {
    section: PlanSection
    allowSkipping: boolean
    planHref: string
}

const steps: { id: LessonStep; label: string }[] = [
    { id: "learn", label: "Learn" },
    { id: "practice", label: "Practice" },
    { id: "check", label: "Mastery check" },
]

const outcomeCopy: Record<MasteryOutcome, string> = {
    pass: "The next section is unlocked.",
    "pass-with-gaps": "The next section is unlocked. Gaps go to your redo queue.",
    retry: "Review the gaps below and try again when you're ready.",
}

const resourceIcons = { video: PlayCircle, article: FileText, docs: BookOpen, practice: Target }

// Stand-in until real mastery interviews exist: everything "solid".
const sampleResult = (section: PlanSection): MasteryResult => ({
    outcome: "pass",
    takenOn: new Date().toISOString().slice(0, 10),
    rubric: section.objectives.map((objective) => ({ objective, level: "solid", note: "Sample result" })),
})

const LessonFlow = ({ section, allowSkipping, planHref }: Props) => {
    const isDone = section.status === "done"

    const [step, setStep] = useState<LessonStep>(isDone ? "learn" : (section.currentStep ?? "learn"))
    const [practiceDone, setPracticeDone] = useState(isDone || section.currentStep === "check")
    const [result, setResult] = useState<MasteryResult | null>(section.mastery ?? null)
    const [isSample, setIsSample] = useState(false)

    const stepState = (id: LessonStep): StepState => {
        if (id === step) return "current"
        if (id === "learn") return "done"
        if (id === "practice") return practiceDone ? "done" : "locked"
        return result ? "done" : "locked"
    }
    const isStepLocked = (id: LessonStep) => id === "check" && !practiceDone

    const goToCheck = () => {
        setPracticeDone(true)
        setStep("check")
    }

    const inCheckInterview = step === "check" && !result

    return (
        <div className="flex flex-col gap-5">
            {/* Step tabs */}
            <div role="tablist" aria-label="Section steps" className="grid grid-cols-3 gap-2.5">
                {steps.map((s, i) => {
                    const state = stepState(s.id)
                    const locked = isStepLocked(s.id)
                    const sub =
                        s.id === "learn"
                            ? `About ${Math.round(section.minutes / 3)} min`
                            : s.id === "practice"
                                ? section.quiz.length
                                    ? `${section.quiz.length} questions`
                                    : "Coming soon"
                                : locked
                                    ? "Unlocks after practice"
                                    : result
                                        ? "Results ready"
                                        : "About 10 min"
                    return (
                        <button
                            key={s.id}
                            type="button"
                            role="tab"
                            aria-selected={s.id === step}
                            disabled={locked}
                            onClick={() => setStep(s.id)}
                            className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors disabled:cursor-not-allowed ${focusRing} ${
                                s.id === step
                                    ? "border-brand bg-brand text-white"
                                    : locked
                                        ? "border-dashed border-slate-300 text-slate-500"
                                        : "border-slate-200 bg-white text-slate-900 hover:border-brand/40"
                            }`}
                        >
                            <span
                                className={`flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${
                                    s.id === step
                                        ? "bg-white text-slate-950"
                                        : state === "done" && !locked
                                            ? "bg-sun text-slate-950"
                                            : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                {locked ? <Lock className="size-3.5" aria-hidden="true" /> : state === "done" ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : i + 1}
                            </span>
                            <span className="flex min-w-0 flex-col">
                                <span className="text-[15px] font-bold">{s.label}</span>
                                <span className={`truncate text-xs ${s.id === step ? "text-white/85" : "text-slate-500"}`}>{sub}</span>
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                {/* Main panel */}
                <div role="tabpanel" className={`p-6 sm:p-9 ${step === "check" ? "rounded-3xl border-2 border-brand bg-white" : card}`}>
                    {step === "learn" && (
                        <div className="flex flex-col gap-8">
                            <LessonContent section={section} />
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setStep("practice")} className={primaryButton}>
                                    Go to practice
                                    <ArrowRight className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "practice" &&
                        (section.quiz.length ? (
                            <Quiz questions={section.quiz} onFinish={goToCheck} />
                        ) : (
                            <div className="flex flex-col items-start gap-4">
                                <h2 className="font-heading text-2xl font-bold">Practice isn&apos;t ready yet</h2>
                                <p className="text-[15px] text-slate-600">
                                    Questions for this section are generated after its lesson is written.
                                </p>
                                <button type="button" onClick={goToCheck} className={secondaryButton}>
                                    Continue to mastery check
                                </button>
                            </div>
                        ))}

                    {step === "check" && !result && (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[13px] font-bold tracking-[0.08em] text-brand-ink uppercase">Mastery check</span>
                                <h2 className="font-heading text-3xl font-bold">A short interview on {section.title}</h2>
                                <p className="text-[15px] text-slate-600">
                                    About 10 minutes. The AI asks about this section&apos;s goals and scores each one. Pass to unlock the
                                    next section.
                                </p>
                            </div>
                            <ul className="grid gap-2.5 sm:grid-cols-2">
                                {section.objectives.map((o) => (
                                    <li key={o} className="rounded-2xl bg-slate-50 p-3.5 text-sm font-semibold">
                                        {o}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResult(sampleResult(section))
                                        setIsSample(true)
                                    }}
                                    className={`${primaryButton} flex-1`}
                                >
                                    Start in text
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResult(sampleResult(section))
                                        setIsSample(true)
                                    }}
                                    className={`${secondaryButton} flex-1`}
                                >
                                    <Mic className="size-4" aria-hidden="true" />
                                    Start with voice
                                </button>
                            </div>
                            {allowSkipping && (
                                <Link href={planHref} className="self-start text-sm text-slate-500 underline-offset-2 hover:underline">
                                    Skip the check and move on (this is logged on your plan)
                                </Link>
                            )}
                        </div>
                    )}

                    {step === "check" && result && (
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-sun p-5">
                                <Star className="size-7 shrink-0" aria-hidden="true" />
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="font-heading text-2xl font-bold">
                                        {result.outcome === "pass" ? "Passed" : result.outcome === "pass-with-gaps" ? "Passed with gaps" : "Not yet"}
                                    </span>
                                    <span className="text-sm text-slate-800">{outcomeCopy[result.outcome]}</span>
                                </div>
                                <OutcomeBadge outcome={result.outcome} />
                            </div>
                            {isSample && (
                                <p className="rounded-2xl bg-brand-soft p-3.5 text-sm text-brand-ink">
                                    Sample result: mastery interviews aren&apos;t connected yet.
                                </p>
                            )}
                            <ul className="flex flex-col gap-2">
                                {result.rubric.map((r) => (
                                    <li key={r.objective} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3.5">
                                        <span className="flex min-w-0 flex-col gap-0.5">
                                            <span className="text-[15px] font-semibold">{r.objective}</span>
                                            <span className="text-[13px] text-slate-500">{r.note}</span>
                                        </span>
                                        <LevelBadge level={r.level} />
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-2.5">
                                <Link href={planHref} className={`${primaryButton} flex-1`}>
                                    Back to plan
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResult(null)
                                        setIsSample(false)
                                    }}
                                    className={secondaryButton}
                                >
                                    Retry check
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Side column */}
                <aside className="flex flex-col gap-5">
                    {section.resources.length > 0 && (
                        <section aria-labelledby="resources-heading" className={`${card} flex flex-col gap-3 p-5`}>
                            <h2 id="resources-heading" className="font-heading text-lg font-bold">
                                Resources
                            </h2>
                            <ul className="flex flex-col gap-2">
                                {section.resources.map((r) => {
                                    const Icon = resourceIcons[r.kind]
                                    return (
                                        <li key={r.url}>
                                            <a
                                                href={r.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 ${focusRing}`}
                                            >
                                                <Icon className="size-5 shrink-0 text-brand-ink" aria-hidden="true" />
                                                <span className="flex min-w-0 flex-1 flex-col">
                                                    <span className="truncate text-sm font-semibold">{r.title}</span>
                                                    <span className="text-xs text-slate-500">{r.meta}</span>
                                                </span>
                                                <ExternalLink className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                                                <span className="sr-only">(opens in a new tab)</span>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </section>
                    )}

                    {inCheckInterview ? (
                        <section className="rounded-3xl border border-dashed border-slate-300 p-5">
                            <h2 className="font-heading text-lg font-bold">Tutor is off</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                During a mastery check you answer on your own. The tutor comes back when it ends.
                            </p>
                        </section>
                    ) : (
                        <section aria-labelledby="tutor-heading" className={`${card} flex flex-col gap-3.5 p-5`}>
                            <div className="flex items-center gap-3">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                                    <Sparkles className="size-4.5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 id="tutor-heading" className="font-heading text-lg font-bold">
                                        Section tutor
                                    </h2>
                                    <p className="text-xs text-slate-500">Knows this lesson and your quiz misses</p>
                                </div>
                            </div>
                            <p className="rounded-2xl rounded-tl-sm bg-slate-100 p-3 text-sm leading-relaxed">
                                Stuck on something in {section.title}? Ask me to explain it another way or give you an extra
                                example.
                            </p>
                            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 rounded-2xl border-2 border-slate-200 p-1.5">
                                <label htmlFor="tutor-input" className="sr-only">
                                    Ask the tutor
                                </label>
                                <input
                                    id="tutor-input"
                                    type="text"
                                    placeholder="Ask about this section…"
                                    className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
                                />
                                <button
                                    type="submit"
                                    aria-label="Send"
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white ${focusRing}`}
                                >
                                    <Send className="size-4" aria-hidden="true" />
                                </button>
                            </form>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    )
}

export default LessonFlow
