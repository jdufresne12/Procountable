import { useState } from 'react'
import { Pencil, X } from "lucide-react"
import Dropdown from "./DropdownMenu"
import type { Status, Task, TaskLink } from "../types"

const statusOptions: { value: Status; label: string }[] = [
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In progress" },
    { value: "done", label: "Done" },
]
const NEW_TASK_TITLE = "New task"

// Mock range. Derive this from the roadmap once real data is hooked up.
const weekOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Week ${i + 1}`,
}))

const fieldLabel = "text-[13px] text-slate-600"
const panel =
    "flex shrink-0 flex-col gap-5 border-t border-slate-200 bg-white px-7 py-8 lg:w-96 lg:overflow-y-auto lg:border-t-0 lg:border-l"

type TaskDetailProps = {
    breadcrumb: string
    task?: Task
    onUpdateTask: (id: string, patch: Partial<Task>) => void
    onDeleteTask: (id: string) => void
}


export default function TaskDetail({ breadcrumb, task, onUpdateTask, onDeleteTask }: TaskDetailProps) {
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
                <input
                    key={task.id}
                    autoFocus={task.title === NEW_TASK_TITLE}
                    type="text"
                    aria-label="Task title"
                    value={task.title}
                    onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
                    onFocus={(e) => {
                        if (task.title === NEW_TASK_TITLE) e.target.select()
                    }}
                    onBlur={(e) => {
                        if (e.target.value.trim() === "") onUpdateTask(task.id, { title: NEW_TASK_TITLE })
                    }}
                    className="-mx-2 rounded-md border border-transparent bg-transparent px-2 py-1 text-[22px] leading-tight font-semibold tracking-tight outline-none hover:border-slate-300 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200"
                />
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
            <LinksSection
                key={task.id}
                links={task.links}
                onChange={(links) => onUpdateTask(task.id, { links })}
            />

            <div className="mt-auto border-t border-slate-200 pt-4">
                <button
                    type="button"
                    className="h-11 rounded-lg px-3 text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteTask(task.id)}
                >
                    Delete task
                </button>
            </div>
        </aside>
    )
}

function LinksSection({ links, onChange }: { links: TaskLink[]; onChange: (links: TaskLink[]) => void }) {
    const [url, setUrl] = useState("")
    const [error, setError] = useState("")
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        const trimmed = url.trim()
        if (!trimmed) return

        // Accept "leetcode.com/..." as well as a full "https://..." URL.
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

        let parsed: URL
        try {
            parsed = new URL(withProtocol)
        } catch {
            setError("That doesn't look like a valid URL.")
            return
        }

        onChange([...links, { url: parsed.href, label: parsed.hostname.replace(/^www\./, "") }])
        setEditingIndex(links.length) // start renaming the link that was just added
        setUrl("")
        setError("")
    }

    function rename(index: number, label: string) {
        const next = label.trim()
        if (next) onChange(links.map((link, i) => (i === index ? { ...link, label: next } : link)))
        setEditingIndex(null)
    }

    const iconButton = "flex h-11 w-10 shrink-0 items-center justify-center text-slate-500"

    return (
        <div className="flex flex-col gap-2">
            <h3 className={fieldLabel}>Links</h3>

            {links.length > 0 && (
                <ul className="overflow-hidden rounded-lg border border-slate-200">
                    {links.map((link, i) => (
                        <li key={`${link.url}-${i}`} className="flex items-center border-b border-slate-100 last:border-b-0">
                            {editingIndex === i ? (
                                <input
                                    autoFocus
                                    type="text"
                                    aria-label="Link title"
                                    defaultValue={link.label}
                                    onFocus={(e) => e.target.select()}
                                    onBlur={(e) => rename(i, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") e.currentTarget.blur()
                                        if (e.key === "Escape") setEditingIndex(null)
                                    }}
                                    className="m-1 h-9 min-w-0 flex-1 rounded-md border border-blue-700 px-2 outline-none ring-2 ring-blue-200"
                                />
                            ) : (
                                <>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-3 text-blue-700 hover:bg-slate-50 hover:text-blue-900"
                                    >
                                        <span className="truncate">{link.label}</span>
                                    </a>
                                    <button
                                        type="button"
                                        aria-label={`Rename link "${link.label}"`}
                                        onClick={() => setEditingIndex(i)}
                                        className={`${iconButton} hover:bg-slate-100 hover:text-slate-900`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Remove link "${link.label}"`}
                                        onClick={() => onChange(links.filter((_, j) => j !== i))}
                                        className={`${iconButton} hover:bg-red-50 hover:text-red-700`}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    inputMode="url"
                    aria-label="Link URL"
                    placeholder="Paste a URL"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value)
                        setError("")
                    }}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 outline-none placeholder:text-slate-500 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200"
                />
                <button
                    type="submit"
                    disabled={!url.trim()}
                    className="h-11 rounded-lg border border-slate-300 bg-white px-3.5 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Add
                </button>
            </form>

            {error && (
                <p role="alert" className="text-sm text-red-700">
                    {error}
                </p>
            )}
        </div>
    )
}
