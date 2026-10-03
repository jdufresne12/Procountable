import { ExternalLink } from "lucide-react"
import Dropdown from "./DropdownMenu"
import type { Status, Task } from "../types"

type TaskDetailProps = {
    breadcrumb: string
    task?: Task
    onUpdateTask: (id: string, patch: Partial<Task>) => void
}

const statusOptions: { value: Status; label: string }[] = [
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In progress" },
    { value: "done", label: "Done" },
]

// Mock range. Derive this from the roadmap once real data is hooked up.
const weekOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Week ${i + 1}`,
}))

const fieldLabel = "text-[13px] text-slate-600"
const panel =
    "flex shrink-0 flex-col gap-5 border-t border-slate-200 bg-white px-7 py-8 lg:w-96 lg:overflow-y-auto lg:border-t-0 lg:border-l"

export default function TaskDetail({ breadcrumb, task, onUpdateTask }: TaskDetailProps) {
    if (!task) {
        return (
            <aside aria-label="Task details" className={panel}>
                <p className="text-slate-600">Select a task to see its notes and links.</p>
            </aside>
        )
    }

    return (
        <aside aria-label="Task details" className={panel}>
            <div className="flex flex-col gap-1.5">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-600">{breadcrumb}</p>
                <h2 className="text-[22px] leading-tight font-semibold tracking-tight">{task.title}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="task-status" className={fieldLabel}>
                        Status
                    </label>
                    <Dropdown
                        id="task-status"
                        options={statusOptions}
                        value={task.status}
                        onChange={(v) => onUpdateTask(task.id, { status: v as Status })}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="task-week" className={fieldLabel}>
                        Week
                    </label>
                    <Dropdown
                        id="task-week"
                        options={weekOptions}
                        value={String(task.week)}
                        onChange={(v) => onUpdateTask(task.id, { week: Number(v) })}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="task-notes" className={fieldLabel}>
                    Notes
                </label>
                <textarea
                    id="task-notes"
                    rows={7}
                    value={task.notes}
                    placeholder="What tripped you up, the key idea, when to redo it"
                    onChange={(e) => onUpdateTask(task.id, { notes: e.target.value })}
                    className="resize-y rounded-lg border border-slate-300 p-3 leading-relaxed outline-none placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200"
                />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className={fieldLabel}>Links</h3>
                {task.links.length > 0 && (
                    <ul className="overflow-hidden rounded-lg border border-slate-200">
                        {task.links.map((link) => (
                            <li key={link.url} className="border-b border-slate-100 last:border-b-0">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex min-h-11 items-center justify-between gap-3 px-3 text-blue-700 hover:bg-slate-50 hover:text-blue-900"
                                >
                                    <span className="truncate">{link.label}</span>
                                    <ExternalLink className="h-4 w-4 shrink-0" />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex gap-2">
                    <input
                        type="url"
                        aria-label="Link URL"
                        placeholder="Paste a URL"
                        className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 outline-none placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200"
                    />
                    <button
                        type="button"
                        className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 hover:border-slate-400 hover:bg-slate-50"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-4">
                <button type="button" className="h-11 rounded-lg px-3 text-red-700 hover:bg-red-50">
                    Delete task
                </button>
            </div>
        </aside>
    )
}
