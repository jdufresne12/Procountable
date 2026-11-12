import { ChevronLeft, ChevronRight } from "lucide-react"
import { getPlan } from "@/lib/mock-data"
import { neutralChip, planColorClasses } from "../../lib/plan-colors"

type Props = {
    rangeLabel: string
    days: CalendarDay[]
    plans: Plan[]
}

// Static for now: the arrows and Week/Month toggle are placeholders until real data exists.
const WeekCalendar = ({ rangeLabel, days, plans }: Props) => {
    return (
        <section aria-label="This week" className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h2 className="font-heading text-[22px] font-bold">{rangeLabel}</h2>
                    <button
                        type="button"
                        aria-label="Previous week"
                        className="flex size-11 items-center justify-center rounded-xl border border-slate-200 text-slate-900 hover:bg-slate-50"
                    >
                        <ChevronLeft className="size-4.5" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        aria-label="Next week"
                        className="flex size-11 items-center justify-center rounded-xl border border-slate-200 text-slate-900 hover:bg-slate-50"
                    >
                        <ChevronRight className="size-4.5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <ul className="flex flex-wrap gap-3.5 text-[13px] text-slate-700">
                        {plans.map((plan) => (
                            <li key={plan.id} className="inline-flex items-center gap-1.5">
                                <span className={`size-3 rounded ${planColorClasses[plan.color].swatch}`} aria-hidden="true" />
                                {plan.name}
                            </li>
                        ))}
                    </ul>
                    <div role="group" aria-label="Calendar view" className="flex rounded-xl bg-slate-100 p-1">
                        <button type="button" aria-pressed="true" className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm">
                            Week
                        </button>
                        <button type="button" aria-pressed="false" className="h-10 rounded-lg px-4 text-sm font-medium text-slate-500">
                            Month
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <ol className="grid min-w-210 grid-cols-7 gap-2.5">
                    {days.map((day) => (
                        <li
                            key={day.day}
                            aria-current={day.isToday ? "date" : undefined}
                            className={`flex min-h-42.5 flex-col gap-2 rounded-2xl border-2 p-3 ${day.isToday ? "border-brand bg-white" : "border-transparent bg-slate-50"
                                }`}
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-[13px] font-semibold text-slate-500">{day.weekday}</span>
                                <span className={`font-heading text-xl font-bold ${day.isToday ? "text-brand-ink" : "text-slate-950"}`}>
                                    {day.day}
                                </span>
                            </div>
                            {day.items.map((item) => {
                                const plan = getPlan(item.planId)
                                const chip = plan ? planColorClasses[plan.color].chip : neutralChip
                                return (
                                    <div
                                        key={item.label}
                                        className={`rounded-lg px-2.5 py-2 text-[13px] font-semibold leading-snug ${chip} ${item.done ? "line-through opacity-70" : ""
                                            }`}
                                    >
                                        {item.label}
                                        {item.done && <span className="sr-only"> (done)</span>}
                                    </div>
                                )
                            })}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

export default WeekCalendar