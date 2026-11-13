import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CalendarDays, Check, Clock, Layers, Pause, Play, RefreshCcw, RotateCcw, X } from "lucide-react"

import { getCurrentSection, getPlan, getPlanRecord, getSectionSteps, lessonHref } from "@/lib/mock-data"
import { formatDayLabel, formatMinutes, formatShortDate, weeksBetween } from "@/lib/dates"
import {
    Breadcrumbs,
    OutcomeBadge,
    PlanStatusBadge,
    PlanSwatch,
    ProgressBar,
    SectionMark,
    card,
    darkButton,
    primaryButton,
    secondaryButton,
} from "@/components/plans/bits"

export default async function PlanPage(props: PageProps<"/your-plans/[planId]">) {
    const { planId } = await props.params
    const record = getPlanRecord(planId)
    const plan = getPlan(planId)
    if (!record || !plan) notFound()

    const current = getCurrentSection(record)
    const doneCount = record.sections.filter((s) => s.status === "done").length
    const results = record.sections.filter((s) => s.mastery)
    const weeks = Array.from(new Set(record.sections.map((s) => s.week))).sort((a, b) => a - b)

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 lg:py-10">
            {/* Header */}
            <header className="flex flex-col gap-5">
                <Breadcrumbs items={[{ label: "Your plans", href: "/your-plans" }, { label: plan.name }]} />

                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 max-w-3xl flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <PlanSwatch color={plan.color} className="size-4" />
                            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{plan.name}</h1>
                            <PlanStatusBadge plan={plan} />
                        </div>
                        <p className="text-base text-slate-600">{record.goal}</p>
                        <ul className="flex flex-wrap gap-2 text-sm text-slate-700">
                            <MetaChip icon={CalendarDays}>
                                {formatShortDate(record.startDate)} – {formatShortDate(record.endDate)} ·{" "}
                                {weeksBetween(record.startDate, record.endDate)} weeks
                            </MetaChip>
                            <MetaChip icon={Clock}>{record.hoursPerWeek} hours / week</MetaChip>
                            <MetaChip icon={Layers}>{record.sections.length} sections</MetaChip>
                        </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {plan.lifecycle === "active" && current && (
                            <>
                                <button type="button" className={secondaryButton}>
                                    <Pause className="size-4" aria-hidden="true" />
                                    Pause plan
                                </button>
                                <Link href={lessonHref(plan.id, current.number)} className={primaryButton}>
                                    Continue section {current.number}
                                    <ArrowRight className="size-4" aria-hidden="true" />
                                </Link>
                            </>
                        )}
                        {plan.lifecycle === "paused" && (
                            <button type="button" className={primaryButton}>
                                <Play className="size-4" aria-hidden="true" />
                                Resume plan
                            </button>
                        )}
                        {plan.lifecycle === "completed" && (
                            <Link href="/your-plans/new" className={primaryButton}>
                                Start a follow-up plan
                            </Link>
                        )}
                    </div>
                </div>

                <div className={`${card} flex flex-wrap items-center gap-x-8 gap-y-4 p-5`}>
                    <div className="flex items-baseline gap-2">
                        <span className="font-heading text-4xl font-bold">{plan.progress}%</span>
                        <span className="text-sm text-slate-500">complete</span>
                    </div>
                    <div className="flex min-w-60 flex-1 flex-col gap-2">
                        <ProgressBar value={plan.progress} color={plan.color} className="h-3" />
                        <span className="text-sm text-slate-600">
                            {doneCount} of {record.sections.length} sections done
                            {current ? ` · now on ${current.title}` : ""}
                        </span>
                    </div>
                </div>

                {plan.lifecycle === "active" && plan.status === "behind" && (
                    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-coral-soft px-5 py-4">
                        <p className="min-w-60 flex-1 text-sm text-coral-ink">
                            <strong>{plan.statusLabel}.</strong> Rebalancing spreads the missed sessions over the coming
                            weeks and keeps your end date of {formatShortDate(record.endDate)}.
                        </p>
                        <button type="button" className={darkButton}>
                            <RefreshCcw className="size-4" aria-hidden="true" />
                            Rebalance schedule
                        </button>
                    </div>
                )}
            </header>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                {/* Roadmap */}
                <section aria-labelledby="sections-heading" className="flex flex-col gap-5">
                    <h2 id="sections-heading" className="font-heading text-2xl font-bold">
                        Sections
                    </h2>

                    {weeks.map((week) => (
                        <div key={week} className="flex flex-col gap-3">
                            <h3 className="text-[13px] font-bold tracking-[0.08em] text-slate-500 uppercase">Week {week}</h3>
                            <ol className="flex flex-col gap-3">
                                {record.sections
                                    .filter((s) => s.week === week)
                                    .map((s) => (
                                        <li key={s.number}>
                                            <SectionRow planId={plan.id} section={s} />
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    ))}
                </section>

                {/* Side column */}
                <aside className="flex flex-col gap-5">
                    {record.upcoming.length > 0 && (
                        <section aria-labelledby="upcoming-heading" className={`${card} flex flex-col gap-3 p-5`}>
                            <h2 id="upcoming-heading" className="font-heading text-lg font-bold">
                                Coming up
                            </h2>
                            <ul className="flex flex-col gap-2">
                                {record.upcoming.map((u) => (
                                    <li key={u.date + u.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                                        <span className="w-20 shrink-0 text-xs font-bold text-slate-600">{formatDayLabel(u.date)}</span>
                                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{u.label}</span>
                                        <span className="text-xs text-slate-500">{formatMinutes(u.minutes)}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <section aria-labelledby="redo-heading" className={`${card} flex flex-col gap-3 p-5`}>
                        <div className="flex items-center justify-between gap-3">
                            <h2 id="redo-heading" className="font-heading text-lg font-bold">
                                Redo queue
                            </h2>
                            <span className="rounded-full bg-sun-soft px-2.5 py-1 text-xs font-bold text-sun-ink">
                                {record.redo.length}
                            </span>
                        </div>
                        {record.redo.length === 0 ? (
                            <p className="text-sm text-slate-500">Nothing to redo. Missed questions show up here.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {record.redo.map((r) => (
                                    <li key={r.prompt} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                                        <RotateCcw className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden="true" />
                                        <span className="min-w-0 flex-1 text-sm">
                                            {r.prompt}
                                            <span className="block text-xs text-slate-500">From section {r.section}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section aria-labelledby="results-heading" className={`${card} flex flex-col gap-3 p-5`}>
                        <h2 id="results-heading" className="font-heading text-lg font-bold">
                            Mastery checks
                        </h2>
                        {results.length === 0 ? (
                            <p className="text-sm text-slate-500">Results appear here after each section&apos;s check.</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {results.map((s) => (
                                    <li key={s.number} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                                        <span className="min-w-0 text-sm">
                                            <span className="block truncate font-semibold">
                                                {s.number}. {s.title}
                                            </span>
                                            <span className="text-xs text-slate-500">{formatShortDate(s.mastery!.takenOn)}</span>
                                        </span>
                                        <OutcomeBadge outcome={s.mastery!.outcome} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section aria-labelledby="rules-heading" className={`${card} flex flex-col gap-3 p-5`}>
                        <h2 id="rules-heading" className="font-heading text-lg font-bold">
                            Plan rules
                        </h2>
                        <ul className="flex flex-col gap-2.5 text-sm">
                            <Rule on={record.rules.masteryCheck}>Mastery check before each new section</Rule>
                            <Rule on={!!record.rules.reminderTime}>
                                {record.rules.reminderTime ? `Email reminder at ${record.rules.reminderTime}` : "No reminders"}
                            </Rule>
                            <Rule on={record.rules.allowSkipping}>
                                {record.rules.allowSkipping ? "Skipping allowed (logged)" : "Sections can't be skipped"}
                            </Rule>
                        </ul>
                        <button type="button" className={`${secondaryButton} mt-1`}>
                            Edit plan
                        </button>
                    </section>
                </aside>
            </div>
        </main>
    )
}

function MetaChip({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
    return (
        <li className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <Icon className="size-4 text-slate-500" aria-hidden="true" />
            {children}
        </li>
    )
}

function Rule({ on, children }: { on: boolean; children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-2.5">
            <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                    on ? "bg-mint-soft text-mint-ink" : "bg-slate-100 text-slate-500"
                }`}
            >
                {on ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : <X className="size-3" strokeWidth={3} aria-hidden="true" />}
            </span>
            {children}
        </li>
    )
}

function SectionRow({ planId, section: s }: { planId: string; section: PlanSection }) {
    const href = lessonHref(planId, s.number)
    const isCurrent = s.status === "current"
    const isLocked = s.status === "locked"

    return (
        <article
            className={`flex flex-wrap items-start gap-4 rounded-3xl p-5 ${
                isCurrent ? "border-2 border-brand bg-white" : isLocked ? "border border-slate-200 bg-slate-50" : "border border-slate-200 bg-white"
            }`}
        >
            <SectionMark status={s.status} size="lg" />

            <div className="flex min-w-60 flex-1 flex-col gap-1">
                <span className="text-xs font-bold tracking-[0.06em] text-slate-500 uppercase">Section {s.number}</span>
                <h4 className="font-heading text-lg font-bold">
                    {isLocked ? (
                        <span className="text-slate-700">{s.title}</span>
                    ) : (
                        <Link href={href} className="hover:underline">
                            {s.title}
                        </Link>
                    )}
                </h4>
                <p className="text-sm text-slate-600">{s.summary}</p>
                <p className="text-xs text-slate-500">
                    About {formatMinutes(s.minutes)} · {s.objectives.length} goals
                </p>

                {isCurrent && (
                    <ol className="mt-2 flex flex-wrap gap-2">
                        {getSectionSteps(s).map((step) => (
                            <li
                                key={step.step}
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                    step.state === "done"
                                        ? "bg-sun-soft text-sun-ink"
                                        : step.state === "current"
                                            ? "bg-brand text-white"
                                            : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {step.state === "done" ? "✓ " : ""}
                                {step.label}
                            </li>
                        ))}
                    </ol>
                )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2 self-center">
                {s.status === "done" && (
                    <>
                        {s.mastery && <OutcomeBadge outcome={s.mastery.outcome} />}
                        <Link href={href} className="text-sm font-semibold text-brand-ink hover:underline">
                            Review
                        </Link>
                    </>
                )}
                {isCurrent && (
                    <Link href={href} className={primaryButton}>
                        Continue
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                )}
                {isLocked && <span className="text-xs text-slate-500">Unlocks after section {s.number - 1}</span>}
            </div>
        </article>
    )
}
