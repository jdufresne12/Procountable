import Link from "next/link"
import { Check, Lock } from "lucide-react"
import { planColorClasses } from "@/lib/plan-colors"

// Small presentational pieces shared by the plan, lesson and "your plans" pages.

export const card = "rounded-3xl border border-slate-200 bg-white"
export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
export const primaryButton = `inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-ink ${focusRing}`
export const darkButton = `inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 ${focusRing}`
export const secondaryButton = `inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 ${focusRing}`

export function PlanSwatch({ color, className = "size-3" }: { color: PlanColor; className?: string }) {
    return <span className={`shrink-0 rounded ${planColorClasses[color].swatch} ${className}`} aria-hidden="true" />
}

const badgeTones = {
    "on-track": "bg-mint-soft text-mint-ink",
    behind: "bg-coral-soft text-coral-ink",
    paused: "bg-slate-100 text-slate-700",
    completed: "bg-brand-soft text-brand-ink",
}

export function PlanStatusBadge({ plan }: { plan: Plan }) {
    const tone = plan.lifecycle === "active" ? badgeTones[plan.status] : badgeTones[plan.lifecycle]
    return (
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{plan.statusLabel}</span>
    )
}

export function ProgressBar({ value, color, className = "h-2" }: { value: number; color: PlanColor; className?: string }) {
    return (
        <div
            className={`overflow-hidden rounded-full bg-slate-200 ${className}`}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Plan progress"
        >
            <div className={`h-full rounded-full ${planColorClasses[color].bar}`} style={{ width: `${value}%` }} />
        </div>
    )
}

/** Check / ring / lock mark for a section */
export function SectionMark({ status, size = "md" }: { status: StepState; size?: "md" | "lg" }) {
    const box = size === "lg" ? "size-9" : "size-6"
    if (status === "done")
        return (
            <span className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-sun text-slate-950`}>
                <Check className={size === "lg" ? "size-4.5" : "size-3.5"} strokeWidth={3} aria-hidden="true" />
                <span className="sr-only">Done</span>
            </span>
        )
    if (status === "current")
        return (
            <span className={`${box} shrink-0 rounded-full border-[6px] border-brand`}>
                <span className="sr-only">In progress</span>
            </span>
        )
    return (
        <span className={`flex ${box} shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500`}>
            <Lock className={size === "lg" ? "size-4" : "size-3.5"} aria-hidden="true" />
            <span className="sr-only">Locked</span>
        </span>
    )
}

const outcomeTones: Record<MasteryOutcome, { label: string; className: string }> = {
    pass: { label: "Passed", className: "bg-mint-soft text-mint-ink" },
    "pass-with-gaps": { label: "Passed with gaps", className: "bg-sun-soft text-sun-ink" },
    retry: { label: "Retry", className: "bg-coral-soft text-coral-ink" },
}

export function OutcomeBadge({ outcome }: { outcome: MasteryOutcome }) {
    const { label, className } = outcomeTones[outcome]
    return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>{label}</span>
}

const levelTones: Record<MasteryLevel, { label: string; className: string }> = {
    strong: { label: "Strong", className: "bg-mint-soft text-mint-ink" },
    solid: { label: "Solid", className: "bg-brand-soft text-brand-ink" },
    gap: { label: "Gap", className: "bg-coral-soft text-coral-ink" },
}

export function LevelBadge({ level }: { level: MasteryLevel }) {
    const { label, className } = levelTones[level]
    return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>{label}</span>
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
    return (
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-1.5">
                {items.map((item, i) => (
                    <li key={item.label} className="flex items-center gap-1.5">
                        {i > 0 && <span aria-hidden="true">/</span>}
                        {item.href ? (
                            <Link href={item.href} className="font-semibold text-brand-ink hover:underline">
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
