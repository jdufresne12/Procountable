import { useState } from "react"
import { Checkbox, Collapsible } from "radix-ui"
import { Check, ChevronDown, Plus } from "lucide-react"
import { countTasks, weeksInTrack } from "../lib"
import type { Module, Task, Track } from "../types"

type TrackViewProps = {
    track?: Track
    selectedTaskId?: string
    onSelectTask: (id: string) => void
    onUpdateTask: (id: string, patch: Partial<Task>) => void
}

export default function TrackView({ track, selectedTaskId, onSelectTask, onUpdateTask }: TrackViewProps) {
    const [week, setWeek] = useState<number | "all">("all")

    if (!track) {
        return (
            <section id="track-view" className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <h1 className="text-xl font-semibold">This roadmap has no tracks yet</h1>
                <p className="text-slate-600">Add a track from the sidebar to start planning.</p>
            </section>
        )
    }

    const { done, total } = countTasks(track.modules)
    const weeks = weeksInTrack(track)
    const activeWeek = week !== "all" && weeks.includes(week) ? week : "all"
    const modules = track.modules
        .map((m) => ({
            ...m,
            visibleTasks: activeWeek === "all" ? m.tasks : m.tasks.filter((t) => t.week === activeWeek),
        }))
        .filter((m) => activeWeek === "all" || m.visibleTasks.length > 0)

    return (
        <section id="Track-view" className="flex min-w-0 flex-1 flex-col gap-6 p-6 lg:overflow-y-auto lg:p-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[28px] leading-tight font-semibold tracking-tight">{track.title}</h1>
                    <p className="text-slate-600">
                        {done} of {total} tasks done
                    </p>
                </div>
                <button
                    type="button"
                    className="flex h-11 items-center gap-1.5 rounded-lg bg-blue-700 px-4 font-medium text-white hover:bg-blue-800"
                >
                    <Plus className="h-4 w-4" />
                    New module
                </button>
            </header>

            <div
                role="progressbar"
                aria-label={`${track.title} progress`}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                className="h-1.5 shrink-0 overflow-hidden rounded-full bg-slate-200"
            >
                <div className="h-full bg-blue-700" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
            </div>

            {/* Week filter */}
            <div className="flex flex-wrap gap-2">
                <WeekChip label="All weeks" active={activeWeek === "all"} onClick={() => setWeek("all")} />
                {weeks.map((w) => (
                    <WeekChip key={w} label={`Week ${w}`} active={activeWeek === w} onClick={() => setWeek(w)} />
                ))}
            </div>

            {modules.map((m) => (
                <ModuleCard
                    key={m.id}
                    module={m}
                    tasks={m.visibleTasks}
                    selectedTaskId={selectedTaskId}
                    onSelectTask={onSelectTask}
                    onUpdateTask={onUpdateTask}
                />
            ))}
        </section>
    )
}

function WeekChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={`h-11 rounded-full border px-3.5 ${active
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-900 hover:border-slate-400"
                }`}
        >
            {label}
        </button>
    )
}

type ModuleCardProps = {
    module: Module
    tasks: Task[]
    selectedTaskId?: string
    onSelectTask: (id: string) => void
    onUpdateTask: (id: string, patch: Partial<Task>) => void
}

function ModuleCard({ module, tasks, selectedTaskId, onSelectTask, onUpdateTask }: ModuleCardProps) {
    const { done, total } = countTasks([module])

    return (
        <Collapsible.Root defaultOpen className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Collapsible.Trigger className="group flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left hover:bg-slate-50">
                <h2 className="text-base font-semibold">{module.title}</h2>
                <span className="flex items-center gap-3">
                    <span className="font-mono text-[13px] text-slate-600">
                        {done}/{total}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" />
                </span>
            </Collapsible.Trigger>

            <Collapsible.Content className="border-t border-slate-200">
                <ul>
                    {tasks.map((t) => {
                        const isDone = t.status === "done"
                        const selected = t.id === selectedTaskId
                        return (
                            <li
                                key={t.id}
                                className={`flex items-center border-b border-slate-100 pl-4 ${selected ? "bg-blue-50" : "hover:bg-slate-50"
                                    }`}
                            >
                                <Checkbox.Root
                                    checked={isDone}
                                    aria-label={`Mark "${t.title}" done`}
                                    onCheckedChange={(checked) =>
                                        onUpdateTask(t.id, { status: checked ? "done" : "not-started" })
                                    }
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-400 bg-white outline-none focus-visible:ring-2 focus-visible:ring-blue-300 data-[state=checked]:border-blue-700 data-[state=checked]:bg-blue-700"
                                >
                                    <Checkbox.Indicator>
                                        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <button
                                    type="button"
                                    aria-current={selected ? "true" : undefined}
                                    onClick={() => onSelectTask(t.id)}
                                    className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-3 py-2 pr-4 pl-3 text-left"
                                >
                                    <span
                                        className={
                                            isDone
                                                ? "text-slate-600 line-through"
                                                : selected
                                                    ? "font-medium"
                                                    : ""
                                        }
                                    >
                                        {t.title}
                                    </span>
                                    {t.ref && (
                                        <span
                                            className={`shrink-0 font-mono text-[13px] ${selected ? "text-blue-800" : "text-slate-600"
                                                }`}
                                        >
                                            {t.ref}
                                        </span>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
                <button
                    type="button"
                    className="flex min-h-11 w-full items-center gap-1.5 px-4 text-left text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                    <Plus className="h-4 w-4" />
                    Add task
                </button>
            </Collapsible.Content>
        </Collapsible.Root>
    )
}
