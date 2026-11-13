import { Lightbulb, Sparkles } from "lucide-react"

// Renders the AI-written lesson as simple blocks. When a lesson hasn't been
// generated yet, shows the section's goals instead.
const LessonContent = ({ section }: { section: PlanSection }) => {
    if (!section.lesson?.length) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-brand-soft p-4 text-brand-ink">
                    <Sparkles className="size-5 shrink-0" aria-hidden="true" />
                    <p className="text-[15px] font-semibold">Your lesson for this section hasn&apos;t been written yet.</p>
                </div>
                <p className="text-[15px] text-slate-700">{section.summary}</p>
                <h3 className="font-heading text-lg font-bold">What you&apos;ll learn</h3>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-[15px] text-slate-700">
                    {section.objectives.map((o) => (
                        <li key={o}>{o}</li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 text-base leading-relaxed text-slate-800">
            {section.lesson.map((block, i) => {
                switch (block.type) {
                    case "heading":
                        return (
                            <h3 key={i} className="mt-3 font-heading text-2xl font-bold">
                                {block.text}
                            </h3>
                        )
                    case "paragraph":
                        return <p key={i}>{block.text}</p>
                    case "code":
                        return (
                            <pre
                                key={i}
                                className="overflow-x-auto rounded-2xl bg-slate-950 p-5 font-mono text-sm leading-relaxed text-slate-100"
                            >
                                <code data-language={block.language}>{block.code}</code>
                            </pre>
                        )
                    case "tip":
                        return (
                            <div key={i} className="flex gap-3 rounded-2xl bg-sun-soft p-4 text-[15px] text-slate-900">
                                <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                                <p>
                                    <strong>{block.title}:</strong> {block.text}
                                </p>
                            </div>
                        )
                }
            })}
        </div>
    )
}

export default LessonContent
