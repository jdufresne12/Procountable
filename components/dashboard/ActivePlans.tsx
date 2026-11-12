import Link from "next/link"
import { planColorClasses } from "../../lib/plan-colors"

const statusClasses: Record<Plan["status"], string> = {
    "on-track": "bg-mint-soft text-mint-ink",
    behind: "bg-coral-soft text-coral-ink",
}

const ActivePlans = ({ plans }: { plans: Plan[] }) => {
    return (
        <section aria-labelledby="active-plans-heading" className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-3">
                <h2 id="active-plans-heading" className="font-heading text-[22px] font-bold">
                    Active plans
                </h2>
                <Link href="/your-plans" className="text-sm font-semibold text-brand-ink hover:underline">
                    See all plans
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => {
                    const colors = planColorClasses[plan.color]
                    return (
                        <Link
                            key={plan.id}
                            href={plan.href}
                            className="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-4.5 transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex min-w-0 items-center gap-2 text-[15px] font-bold">
                                    <span className={`size-3 shrink-0 rounded ${colors.swatch}`} aria-hidden="true" />
                                    <span className="truncate">{plan.name}</span>
                                </span>
                                <span className="text-[15px] font-bold">{plan.progress}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                                <div className={`h-full rounded-full ${colors.bar}`} style={{ width: `${plan.progress}%` }} />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[13px] text-slate-500">
                                    Section {plan.currentSection} of {plan.totalSections}
                                </span>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[plan.status]}`}>
                                    {plan.statusLabel}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default ActivePlans