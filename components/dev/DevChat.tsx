"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useState } from "react"
import type { IntakeUIMessage } from "@/lib/ai/intake-tools"
import { intakeFields, missingIntakeFields, type Intake } from "@/lib/ai/intake"

const chipsFor: Partial<Record<keyof Intake, string[]>> = {
    level: ["Brand new", "Some experience", "Pretty comfortable"],
    hoursPerWeek: ["2 hrs/week", "5 hrs/week", "8 hrs/week"],
    studyDays: ["Weekdays", "Weekends", "Every day"],
    weeks: ["2 weeks", "1 month", "3 months"],
}

// The newest saved intake: the last successful updateIntake result, or what the page loaded
function latestIntake(messages: IntakeUIMessage[], fallback: Partial<Intake>) {
    let intake = fallback
    for (const m of messages)
        for (const p of m.parts)
            if (p.type === "tool-updateIntake" && p.state === "output-available") intake = p.output.intake
    return intake
}

type Props = {
    id: string
    initialMessages: IntakeUIMessage[]
    initialIntake: Partial<Intake>
}

export default function DevChat({ id, initialMessages, initialIntake }: Props) {
    const [input, setInput] = useState("")
    const { messages, sendMessage, status } = useChat<IntakeUIMessage>({
        id,
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: "/api/chat",
            prepareSendMessagesRequest({ messages, id }) {
                return { body: { message: messages[messages.length - 1], id } }
            },
        }),
    })

    const intake = latestIntake(messages, initialIntake)
    const missing = missingIntakeFields(intake)
    const chips = status === "ready" && missing.length ? chipsFor[missing[0]] : undefined

    function send(text: string) {
        if (!text.trim() || status !== "ready") return
        sendMessage({ text })
        setInput("")
    }

    return (
        <main className="mx-auto grid max-w-5xl gap-6 p-8 md:grid-cols-[1fr_280px]">
            <section className="flex flex-col gap-3">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={m.role === "user"
                            ? "self-end rounded-xl bg-brand px-3 py-2 text-white"
                            : "flex flex-col gap-1 rounded-xl bg-slate-100 px-3 py-2"}
                    >
                        {m.parts.map((part, i) => {
                            switch (part.type) {
                                case "text":
                                    return <span key={i}>{part.text}</span>
                                case "tool-updateIntake":
                                    if (part.state === "output-available")
                                        return <span key={i} className="text-xs text-slate-500">Saved: {Object.keys(part.input).join(", ")}</span>
                                    if (part.state === "output-error")
                                        return <span key={i} className="text-xs text-coral-ink">Couldn't save: {part.errorText}</span>
                                    return <span key={i} className="text-xs text-slate-500">Saving…</span>
                                default:
                                    return null
                            }
                        })}
                    </div>
                ))}

                {chips && (
                    <div className="flex flex-wrap gap-2">
                        {chips.map((c) => (
                            <button key={c} type="button" onClick={() => send(c)} className="h-10 rounded-full border-2 border-brand-soft px-4 text-sm font-semibold text-brand-ink hover:bg-brand-soft">
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); send(input) }}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={messages.length ? "Reply…" : "What do you want to learn?"}
                        className="w-full rounded-xl border-2 border-brand p-3"
                    />
                </form>
                <p className="text-xs text-slate-500">status: {status}</p>
            </section>

            <aside className="rounded-2xl border border-slate-200 p-4 text-sm">
                <h2 className="mb-2 font-bold">Intake</h2>
                <dl className="flex flex-col gap-1">
                    {intakeFields.map((f) => (
                        <div key={f} className="flex justify-between gap-2">
                            <dt className="text-slate-500">{f}</dt>
                            <dd className="text-right">{intake[f] === undefined ? "—" : String(intake[f])}</dd>
                        </div>
                    ))}
                </dl>
                {missing.length === 0 && <p className="mt-3 font-semibold text-mint-ink">Ready to draft</p>}
            </aside>
        </main>
    )
}