import Link from "next/link"
import { ArrowRight, Mic, Pencil, RefreshCcw, Sparkles } from "lucide-react"

import { newPlanDraft } from "@/lib/mock-data"
import { formatShortDate } from "@/lib/dates"
import { Breadcrumbs, card, focusRing, primaryButton, secondaryButton } from "@/components/plans/bits"

// Static for now: the chat and draft come from mock data. Once the AI is wired
// up, the chat becomes a client component and the draft updates as it streams.
export default function NewPlanPage() {
    const draft = newPlanDraft

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
            <header className="flex flex-col gap-3">
                <Breadcrumbs items={[{ label: "Your plans", href: "/your-plans" }, { label: "New plan" }]} />
                <div className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-bold tracking-[0.08em] text-brand-ink uppercase">New learning plan</span>
                    <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">What do you want to learn?</h1>
                </div>
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
                {/* Intake chat */}
                <section aria-label="Intake chat" className="flex flex-col gap-4">
                    <div className={`${card} flex flex-col gap-4 p-6`}>
                        {draft.messages.map((m, i) =>
                            m.from === "ai" ? (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                                        <Sparkles className="size-4.5" aria-hidden="true" />
                                    </span>
                                    <p className="max-w-xl rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-[15px] leading-relaxed">
                                        {m.text}
                                    </p>
                                </div>
                            ) : (
                                <div key={i} className="flex justify-end">
                                    <p className="max-w-lg rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-[15px] leading-relaxed text-white">
                                        {m.text}
                                    </p>
                                </div>
                            ),
                        )}

                        <div className="flex flex-wrap gap-2 pl-12">
                            {draft.suggestions.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className={`h-10 rounded-full border-2 border-brand-soft bg-white px-4 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-soft ${focusRing}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border-2 border-brand bg-white p-2">
                        <label htmlFor="intake-input" className="sr-only">
                            Message
                        </label>
                        <input
                            id="intake-input"
                            type="text"
                            placeholder="Reply, or ask for changes to the plan…"
                            className="min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none"
                        />
                        <button
                            type="button"
                            aria-label="Talk instead of typing"
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 ${focusRing}`}
                        >
                            <Mic className="size-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            aria-label="Send"
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white hover:bg-brand-ink ${focusRing}`}
                        >
                            <ArrowRight className="size-5" aria-hidden="true" />
                        </button>
                    </div>
                </section>

                {/* Plan draft */}
                <section aria-labelledby="draft-heading" className={`${card} flex flex-col gap-5 p-6`}>
                    <div className="flex items-start justify-between gap-3">
                        <h2 id="draft-heading" className="font-heading text-2xl font-bold">
                            {draft.name}
                        </h2>
                        <span className="shrink-0 rounded-full bg-sun px-3 py-1 text-xs font-bold text-slate-950">Draft</span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-slate-600">{draft.goal}</p>

                    <dl className="grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-brand-soft p-3">
                            <dt className="text-xs text-slate-700">Length</dt>
                            <dd className="font-heading text-xl font-bold">{draft.weeks} weeks</dd>
                        </div>
                        <div className="rounded-2xl bg-sun-soft p-3">
                            <dt className="text-xs text-slate-700">Per week</dt>
                            <dd className="font-heading text-xl font-bold">{draft.hoursPerWeek} hrs</dd>
                        </div>
                        <div className="rounded-2xl bg-coral-soft p-3">
                            <dt className="text-xs text-slate-700">Ends</dt>
                            <dd className="font-heading text-xl font-bold">{formatShortDate(draft.endDate)}</dd>
                        </div>
                    </dl>

                    <ol className="flex flex-col gap-2">
                        {draft.sections.map((s, i) => (
                            <li key={s.title} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 font-heading text-sm font-bold text-white">
                                    {i + 1}
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-[15px] font-semibold">{s.title}</span>
                                    <span className="truncate text-[13px] text-slate-500">{s.summary}</span>
                                </span>
                                <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-bold">
                                    Week {s.week}
                                </span>
                                <button
                                    type="button"
                                    aria-label={`Edit ${s.title}`}
                                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 ${focusRing}`}
                                >
                                    <Pencil className="size-4" aria-hidden="true" />
                                </button>
                            </li>
                        ))}
                    </ol>

                    <fieldset className="flex flex-col gap-1">
                        <legend className="mb-2 text-xs font-bold tracking-[0.08em] text-slate-500 uppercase">Plan rules</legend>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                            <input type="checkbox" defaultChecked className="size-5 accent-brand" />
                            Mastery interview before each new section
                        </label>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                            <input type="checkbox" defaultChecked className="size-5 accent-brand" />
                            Email reminder each study day at 7:30 PM
                        </label>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                            <input type="checkbox" className="size-5 accent-brand" />
                            Allow skipping a section (logged)
                        </label>
                    </fieldset>

                    <div className="flex flex-wrap gap-2">
                        <Link href="/your-plans" className={`${primaryButton} flex-1`}>
                            Commit plan
                        </Link>
                        <button type="button" className={secondaryButton}>
                            <RefreshCcw className="size-4" aria-hidden="true" />
                            Regenerate
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
}
