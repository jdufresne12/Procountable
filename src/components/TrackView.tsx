import { useState } from "react"
import { AlertDialog, Checkbox, Collapsible } from "radix-ui"
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react"
import { countTasks, weeksInTrack, describeTrackContents } from "../lib"
import type { Module, Task, Track } from "../types"
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"

type TrackViewProps = {
    track?: Track
    selectedTaskId?: string
    onSelectTask: (id: string) => void
    onUpdateTask: (id: string, patch: Partial<Task>) => void
    onCreateTask: (moduleId: string, week: number) => string
    onUpdateModule: (id: string, patch: Partial<Module>) => void
    onCreateModule: (trackId: string) => void
    onDeleteModule: (id: string) => void
    onUpdateTrack: (id: string, patch: Partial<Track>) => void
    onDeleteTrack: (id: string) => void
}

export default function TrackView({
    track,
    selectedTaskId,
    onSelectTask,
    onUpdateTask,
    onCreateTask,
    onUpdateModule,
    onCreateModule,
    onDeleteModule,
    onUpdateTrack,
    onDeleteTrack,
}: TrackViewProps) {
    const [week, setWeek] = useState<number | "all">("all")
    const [confirmingDelete, setConfirmingDelete] = useState(false)

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
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <input
                        key={track.id}
                        autoFocus={track.title === "New track"}
                        type="text"
                        aria-label="Track title"
                        value={track.title}
                        onChange={(e) => onUpdateTrack(track.id, { title: e.target.value })}
                        onFocus={(e) => {
                            if (track.title === "New track") e.target.select()
                        }}
                        onBlur={(e) => {
                            if (e.target.value.trim() === "") onUpdateTrack(track.id, { title: "Untitled track" })
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur()
                        }}
                        className="-mx-2 min-w-0 rounded-md border border-transparent bg-transparent px-2 py-0.5 text-[28px] leading-tight font-semibold tracking-tight outline-none hover:border-slate-300 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200"
                    />
                    <p className="text-slate-600">
                        {done} of {total} tasks done
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        aria-label={`Delete track "${track.title}"`}
                        onClick={() => setConfirmingDelete(true)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="flex h-11 items-center gap-1.5 rounded-lg bg-blue-700 px-4 font-medium text-white hover:bg-blue-800"
                        onClick={() => onCreateModule(track.id)}
                    >
                        <Plus className="h-4 w-4" />
                        New module
                    </button>
                </div>
                <ConfirmDeleteDialog
                    open={confirmingDelete}
                    onOpenChange={setConfirmingDelete}
                    title={`Delete "${track.title}"?`}
                    description={describeTrackContents(track)}
                    confirmLabel="Delete track"
                    onConfirm={() => onDeleteTrack(track.id)}
                />
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
                    activeWeek={activeWeek}
                    onSelectTask={onSelectTask}
                    onUpdateTask={onUpdateTask}
                    onCreateTask={onCreateTask}
                    onUpdateModule={onUpdateModule}
                    onDeleteModule={onDeleteModule}
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
    activeWeek: string | number
    onSelectTask: (id: string) => void
    onUpdateTask: (id: string, patch: Partial<Task>) => void
    onCreateTask: (moduleId: string, week: number) => string
    onUpdateModule: (id: string, patch: Partial<Module>) => void
    onDeleteModule: (id: string) => void
}

function ModuleCard({ module, tasks, selectedTaskId, activeWeek, onSelectTask, onUpdateTask, onCreateTask, onUpdateModule, onDeleteModule }: ModuleCardProps) {
    const { done, total } = countTasks([module])

    return (
        <Collapsible.Root defaultOpen className="shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex min-h-12 items-center gap-1 pr-1 pl-2">
                <input
                    type="text"
                    aria-label="Module title"
                    value={module.title}
                    onChange={(e) => onUpdateModule(module.id, { title: e.target.value })}
                    onBlur={(e) => {
                        if (e.target.value.trim() === "") onUpdateModule(module.id, { title: "Untitled module" })
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur()
                    }}
                    className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-base font-semibold outline-none hover:border-slate-300 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200"
                />
                <span className="px-2 font-mono text-[13px] text-slate-600">
                    {done}/{total}
                </span>
                <DeleteModuleButton module={module} onDelete={() => onDeleteModule(module.id)} />
                <Collapsible.Trigger
                    aria-label={`Collapse or expand "${module.title}"`}
                    className="group flex h-11 w-10 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </Collapsible.Trigger>
            </div>

            <Collapsible.Content className="border-t border-slate-200">
                <ul>
                    {tasks.map((t) => {
                        const isDone = t.status === "done"
                        const selected = t.id === selectedTaskId
                        return (
                            <li
                                key={t.id}
                                className={`flex items-center border-b border-slate-100 pl-4 ${selected ? "bg-blue-50" : "hover:bg-slate-50"}`}
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
                    onClick={() => {
                        const newTaskId = onCreateTask(module.id, activeWeek === "all" ? 1 : activeWeek as number)
                        onSelectTask(newTaskId)
                    }

                    }
                >
                    <Plus className="h-4 w-4" />
                    Add task
                </button>
            </Collapsible.Content>
        </Collapsible.Root>
    )
}

function DeleteModuleButton({ module, onDelete }: { module: Module; onDelete: () => void }) {
    const count = module.tasks.length

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger
                aria-label={`Delete module "${module.title}"`}
                className="flex h-11 w-10 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-700"
            >
                <Trash2 className="h-4 w-4" />
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-xl bg-white p-6 font-sans text-[15px] text-slate-900 shadow-xl">
                    <AlertDialog.Title className="text-lg font-semibold">
                        Delete "{module.title}"?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="text-slate-600">
                        {count === 0
                            ? "This module has no tasks."
                            : `This also deletes its ${count} ${count === 1 ? "task" : "tasks"}, including their notes and links.`}{" "}
                        This can't be undone.
                    </AlertDialog.Description>
                    <div className="mt-3 flex justify-end gap-2">
                        <AlertDialog.Cancel className="h-11 rounded-lg border border-slate-300 bg-white px-4 hover:border-slate-400 hover:bg-slate-50">
                            Cancel
                        </AlertDialog.Cancel>
                        <AlertDialog.Action
                            onClick={onDelete}
                            className="h-11 rounded-lg bg-red-700 px-4 font-medium text-white hover:bg-red-800"
                        >
                            Delete module
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}
