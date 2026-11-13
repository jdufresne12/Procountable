import Link from "next/link"
import { ArrowRight, Plus, RefreshCcw } from "lucide-react"

import { allPlans, getCurrentSection, getPlanRecord, lessonHref } from "@/lib/mock-data"
import { formatDayLabel, formatShortDate, weeksBetween } from "@/lib/dates"
import { PlanStatusBadge, PlanSwatch, ProgressBar, card, darkButton, focusRing, primaryButton, secondaryButton } from "@/components/plans/bits"

const tabs = [
    { id: "active", label: "Active" },
    { id: "paused", label: "Paused" },
    { id: "completed", label: "Completed" },
] as const

type TabId = (typeof tabs)[number]["id"]

export default async function YourPlansPage(props: PageProps<"/your-plans">) {
    const { tab: tabParam } = await props.searchParams
    const tab: TabId = tabs.some((t) => t.id === tabParam) ? (tabParam as TabId) : "active"

    const counts = Object.fromEntries(tabs.map((t) => [t.id, allPlans.filter((p) => p.lifecycle === t.id).length]))
    const visible = allPlans.filter((p) => p.lifecycle === tab)

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 lg:py-10">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Your plans</h1>
                    <p className="text-[15px] text-slate-500">
                        {counts.active} active · {counts.paused} paused · {counts.completed} completed
                    </p>
                </div>

                <nav aria-label="Plan status" className="flex rounded-2xl border border-slate-200 bg-white p-1">
                    {tabs.map((t) => {
                        const isActive = t.id === tab
                        return (
                            <Link
                                key={t.id}
                                href={t.id === "active" ? "/your-plans" : `/your-plans?tab=${t.id}`}
                                aria-current={isActive ? "page" : undefined}
                                className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold transition-colors ${focusRing} ${
                                    isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                {t.label} ({counts[t.id]})
                            </Link>
                        )
                    })}
                </nav>
            </header>

            <div className="grid gap-5 lg:grid-cols-2">
                {visible.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                ))}

                {tab === "active" && (
                    <Link
                        href="/your-plans/new"
                        className={`flex min-h-56 flex-col items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-brand hover:bg-white ${focusRing}`}
                    >
                        <span className="flex size-13 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                            <Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        <span className="font-heading text-lg font-bold">Start a new plan</span>
                        <span className="text-sm text-slate-500">Tell the AI what you want to learn</span>
                    </Link>
                )}

                {visible.length === 0 && tab !== "active" && (
                    <p className={`${card} p-8 text-center text-[15px] text-slate-500 lg:col-span-2`}>
                        No {tab} plans yet.
                    </p>
                )}
            </div>
        </main>
    )
}

function PlanCard({ plan }: { plan: Plan }) {
    const record = getPlanRecord(plan.id)!
    const current = getCurrentSection(record)
    const done = record.sections.filter((s) => s.status === "done")
    const checks = done.filter((s) => s.mastery)
    const gaps = checks.filter((s) => s.mastery?.outcome === "pass-with-gaps").length
    const weeks = weeksBetween(record.startDate, record.endDate)

    const meta =
        plan.lifecycle === "completed"
            ? `${weeks} weeks · completed ${formatShortDate(record.completedOn ?? record.endDate)}`
            : plan.lifecycle === "paused"
                ? `Paused ${formatShortDate(record.pausedOn ?? record.startDate)} · ${weeks} weeks planned`
                : `${weeks} weeks · ${formatShortDate(record.startDate)} – ${formatShortDate(record.endDate)}`

    const progressLabel =
        plan.lifecycle === "completed"
            ? `${plan.totalSections} of ${plan.totalSections} sections`
            : `Section ${plan.currentSection} of ${plan.totalSections}${current ? `: ${current.title}` : ""}`

    const stats =
        plan.lifecycle === "completed"
            ? [
                { k: "Checks passed", v: `${checks.length}` },
                { k: "With gaps", v: `${gaps}` },
                { k: "Hours / week", v: `${record.hoursPerWeek}` },
            ]
            : [
                { k: "Checks passed", v: `${checks.length} of ${done.length}` },
                { k: "Redo queue", v: `${record.redo.length}` },
                { k: "Hours / week", v: `${record.hoursPerWeek}` },
            ]

    const next = record.upcoming[0]

    return (
        <article className={`${card} flex flex-col gap-4 p-6`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <PlanSwatch color={plan.color} className="h-11 w-3.5 rounded-md" />
                    <div className="min-w-0">
                        <h2 className="truncate font-heading text-xl font-bold">
                            <Link href={plan.href} className="hover:underline">
                                {plan.name}
                            </Link>
                        </h2>
                        <p className="text-[13px] text-slate-500">{meta}</p>
                    </div>
                </div>
                <PlanStatusBadge plan={plan} />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate font-semibold">{progressLabel}</span>
                    <span className="font-bold">{plan.progress}%</span>
                </div>
                <ProgressBar value={plan.progress} color={plan.color} className="h-2.5" />
            </div>

            <dl className="grid grid-cols-3 gap-2">
                {stats.map((s) => (
                    <div key={s.k} className="flex flex-col gap-0.5 rounded-2xl bg-slate-50 px-3 py-2.5">
                        <dt className="text-xs text-slate-500">{s.k}</dt>
                        <dd className="text-[15px] font-bold">{s.v}</dd>
                    </div>
                ))}
            </dl>

            {plan.lifecycle === "active" && plan.status === "behind" && (
                <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-coral-soft px-4 py-3.5">
                    <p className="min-w-48 flex-1 text-sm text-coral-ink">
                        You missed a few sessions. Rebalancing spreads them over the coming weeks and keeps your end date.
                    </p>
                    <button type="button" className={darkButton}>
                        <RefreshCcw className="size-4" aria-hidden="true" />
                        Rebalance
                    </button>
                </div>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-slate-600">
                    {plan.lifecycle === "active" && next
                        ? `Next: ${formatDayLabel(next.date)} · ${next.label}`
                        : plan.lifecycle === "paused"
                            ? "Resuming rebuilds your schedule"
                            : "Final results saved"}
                </span>

                {plan.lifecycle === "active" && current ? (
                    <Link href={lessonHref(plan.id, current.number)} className={primaryButton}>
                        Continue
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                ) : (
                    <Link href={plan.href} className={secondaryButton}>
                        {plan.lifecycle === "paused" ? "Resume plan" : "Review"}
                    </Link>
                )}
            </div>
        </article>
    )
}
