import Link from "next/link"
import { RotateCcw } from "lucide-react"
import { getPlan } from "@/lib/mock-data"
import { formatMinutes } from "@/lib/dates"
import { planColorClasses } from "../../lib/plan-colors"

type Props = {
    sessions: Session[]
    redo: { dueToday: number; minutes: number; href: string }
}

const AlsoToday = ({ sessions, redo }: Props) => {
    return (
        <div className="flex flex-[2_1_340px] flex-col gap-3">
            <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-slate-500">Also today</h3>

            <ul className="flex flex-col gap-3">
                {sessions.map((session) => {
                    const plan = getPlan(session.planId)
                    const colors = plan ? planColorClasses[plan.color] : null
                    return (
                        <li
                            key={session.id}
                            className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4"
                        >
                            <span className={`w-2 self-stretch rounded-md ${colors?.swatch ?? "bg-slate-200"}`} aria-hidden="true" />
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="text-[13px] text-slate-500">{plan?.name}</span>
                                <span className="truncate text-base font-bold">{session.title}</span>
                                <span className="text-[13px] text-slate-500">
                                    {formatMinutes(session.minutes)} · {session.kind}
                                </span>
                            </div>
                            <Link
                                href={session.href}
                                className="inline-flex h-11 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                            >
                                Start
                            </Link>
                        </li>
                    )
                })}

                {redo.dueToday > 0 && (
                    <li className="flex items-center gap-3.5 rounded-2xl border-2 border-dashed border-slate-300 p-4">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sun-soft text-slate-900">
                            <RotateCcw className="size-4.5" aria-hidden="true" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-[15px] font-bold">Optional: redo queue</span>
                            <span className="text-[13px] text-slate-500">
                                {redo.dueToday} missed problems · about {formatMinutes(redo.minutes)}
                            </span>
                        </div>
                        <Link
                            href={redo.href}
                            className="inline-flex h-11 items-center rounded-xl border-2 border-slate-200 px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                        >
                            Review
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default AlsoToday