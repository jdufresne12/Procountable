import Link from "next/link"
import { ArrowRight, Check, Lock } from "lucide-react"

type Props = { session: UpNext; plan: Plan }

const UpNextCard = ({ session, plan }: Props) => {
    return (
        <article className="flex flex-[3_1_520px] flex-col gap-5 rounded-3xl bg-brand p-7 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[15px] font-bold uppercase tracking-[0.08em] text-white/95">Up next</span>
                <span className="rounded-full bg-sun px-3 py-1.5 text-[13px] font-bold text-slate-950">
                    About {session.minutesLeft} min left
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <p className="text-[13px] text-white/95 font-semibold">
                    {plan.name} · Section {session.sectionNumber} of {plan.totalSections}
                </p>
                <h3 className="font-heading text-3xl font-bold tracking-tight sm:text-[34px]">{session.title}</h3>
            </div>

            <ol className="grid grid-cols-3 gap-2">
                {session.steps.map((step, i) => (
                    <li
                        key={step.label}
                        className={`flex items-center gap-2.5 rounded-2xl p-3 text-sm font-semibold 
                            ${step.state === "current" ? "bg-white text-slate-950" : "bg-brand-deep text-white/90"}`}
                    >
                        {step.state === "done" && (
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sun text-slate-950">
                                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                            </span>
                        )}
                        {step.state === "current" && (
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs text-white">
                                {i + 1}
                            </span>
                        )}
                        {step.state === "locked" && <Lock className="size-4 shrink-0" aria-hidden="true" />}
                        <span className="truncate">{step.label}</span>
                        <span className="sr-only">
                            {step.state === "done" ? "(done)" : step.state === "current" ? "(in progress)" : "(locked)"}
                        </span>
                    </li>
                ))}
            </ol>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-55 flex-1 flex-col gap-2">
                    <span className="text-[13px] text-white/85">Plan progress · {plan.progress}%</span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-brand-deep">
                        <div className="h-full rounded-full bg-sun" style={{ width: `${plan.progress}%` }} />
                    </div>
                </div>
                <Link
                    href={session.href}
                    className="inline-flex h-12 items-center gap-2 rounded-2xl bg-sun px-5 text-[15px] font-bold text-slate-950 
                        transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    Continue
                    <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
                </Link>
            </div>
        </article>
    )
}

export default UpNextCard