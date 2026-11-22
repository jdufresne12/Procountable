import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Lock } from "lucide-react"
import { lessonHref } from "@/lib/helpers"
import { formatMinutes } from "@/lib/dates"
import { Breadcrumbs, PlanSwatch, card, focusRing, primaryButton } from "@/components/plans/bits"
import LessonFlow from "@/components/lesson/LessonFlow"
import { getPlanSummary } from "@/lib/server/plans"
import { getSection } from "@/lib/server/sections"

export default async function SectionPage(props: PageProps<"/your-plans/[planId]/section/[sectionId]">) {
    const { planId, sectionId } = await props.params
    const number = Number(sectionId)
    if (!Number.isInteger(number)) notFound()

    const [plan, content] = await Promise.all([getPlanSummary(planId), getSection(planId, number)])
    const section = plan?.sections.find((s) => s.number === number)
    if (!plan || !section) notFound()

    const prev = plan.sections.find((s) => s.number === section.number - 1)
    const next = plan.sections.find((s) => s.number === section.number + 1)
    const current = plan.sections.find((s) => s.status === "current")

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-10">
            <header className="flex flex-col gap-4">
                <Breadcrumbs
                    items={[
                        { label: "Your plans", href: "/your-plans" },
                        { label: plan.name, href: `/your-plans/${plan.id}` },
                        { label: `Section ${section.number}` },
                    ]}
                />

                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] text-slate-500 uppercase">
                            <PlanSwatch color={plan.color} className="size-2.5" />
                            Section {section.number} of {plan.sections.length} · about {formatMinutes(section.minutes)}
                        </span>
                        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{section.title}</h1>
                    </div>

                    {/* Every section in the plan; reachable ones are links */}
                    <ol className="flex gap-1" aria-label="Sections in this plan">
                        {plan.sections.map((s) => {
                            const tone =
                                s.number === section.number
                                    ? "bg-brand"
                                    : s.status === "done"
                                        ? "bg-sun"
                                        : s.status === "current"
                                            ? "bg-brand/40"
                                            : "bg-slate-200"
                            const label = `Section ${s.number}: ${s.title}${s.status === "locked" ? " (locked)" : ""}`
                            return (
                                <li key={s.number}>
                                    {s.status === "locked" ? (
                                        <span className={`block h-2.5 w-7 rounded-full ${tone}`} title={label} />
                                    ) : (
                                        <Link
                                            href={lessonHref(plan.id, s.number)}
                                            aria-label={label}
                                            aria-current={s.number === section.number ? "page" : undefined}
                                            className={`block h-2.5 w-7 rounded-full ${tone} ${focusRing}`}
                                        />
                                    )}
                                </li>
                            )
                        })}
                    </ol>
                </div>
            </header>

            {section.status === "locked" || !content ? (
                <section className={`${card} flex flex-col items-start gap-4 p-8`}>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <Lock className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col gap-1.5">
                        <h2 className="font-heading text-2xl font-bold">This section is locked</h2>
                        <p className="max-w-xl text-[15px] text-slate-600">
                            Finish section {section.number - 1}
                            {prev ? `: ${prev.title}` : ""} and pass its mastery check to unlock it. Here&apos;s what it
                            will cover:
                        </p>
                    </div>
                    <ul className="flex list-disc flex-col gap-1 pl-5 text-[15px] text-slate-700">
                        {section.objectives.map((o) => (
                            <li key={o}>{o}</li>
                        ))}
                    </ul>
                    {current && (
                        <Link href={lessonHref(plan.id, current.number)} className={primaryButton}>
                            Go to section {current.number}: {current.title}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    )}
                </section>
            ) : (
                <LessonFlow
                    key={`${plan.id}-${section.number}`}
                    section={content}
                    allowSkipping={plan.rules.allowSkipping}
                    planHref={`/your-plans/${plan.id}`}
                />
            )}

            <nav aria-label="Section navigation" className="flex flex-wrap justify-between gap-3">
                {prev && prev.status !== "locked" ? (
                    <Link href={lessonHref(plan.id, prev.number)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:underline">
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        {prev.number}. {prev.title}
                    </Link>
                ) : prev ? (
                    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <Lock className="size-4" aria-hidden="true" />
                        {prev.number}. {prev.title}
                    </span>
                ) : (
                    <span />
                )}
                {next &&
                    (next.status === "locked" ? (
                        <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                            <Lock className="size-4" aria-hidden="true" />
                            {next.number}. {next.title}
                        </span>
                    ) : (
                        <Link href={lessonHref(plan.id, next.number)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink hover:underline">
                            {next.number}. {next.title}
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    ))}
            </nav>
        </main>
    )
}
