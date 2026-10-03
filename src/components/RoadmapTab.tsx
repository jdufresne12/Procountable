import { Plus } from "lucide-react"
import Dropdown from "./DropdownMenu"
import { countTasks } from "../lib"
import type { Roadmap } from "../types"

type RoadmapTabProps = {
    roadmaps: Roadmap[]
    roadmap: Roadmap
    trackId?: string
    onSelectRoadmap: (id: string) => void
    onSelectTrack: (id: string) => void
}

const sectionLabel = "px-3 font-mono text-xs uppercase tracking-wider text-slate-600"

export default function RoadmapTab({
    roadmaps,
    roadmap,
    trackId,
    onSelectRoadmap,
    onSelectTrack,
}: RoadmapTabProps) {
    return (
        <nav
            id="roadmap-tab"
            aria-label="Roadmap and tracks"
            className="flex shrink-0 flex-col gap-6 border-b border-slate-200 bg-white px-4 py-7 lg:w-64 lg:overflow-y-auto lg:border-r lg:border-b-0"
        >
            {/* Roadmap */}
            <div className="flex flex-col gap-1.5">
                <h2 className={sectionLabel}>Roadmap</h2>
                <Dropdown
                    prominent
                    ariaLabel="Switch roadmap"
                    options={roadmaps.map((r) => ({ value: r.id, label: r.title }))}
                    value={roadmap.id}
                    onChange={onSelectRoadmap}
                />
                <button
                    type="button"
                    className="flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm text-blue-700 hover:bg-slate-50 hover:text-blue-900"
                >
                    <Plus className="h-4 w-4" />
                    New roadmap
                </button>
            </div>

            {/* Tracks */}
            <div className="flex flex-col gap-1">
                <h2 className={`${sectionLabel} pb-1.5`}>Tracks</h2>
                {roadmap.tracks.length === 0 && (
                    <p className="px-3 py-2 text-sm text-slate-600">No tracks yet.</p>
                )}
                {roadmap.tracks.map((t) => {
                    const { done, total } = countTasks(t.modules)
                    const active = t.id === trackId
                    return (
                        <button
                            key={t.id}
                            type="button"
                            aria-current={active ? "true" : undefined}
                            onClick={() => onSelectTrack(t.id)}
                            className={`flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-left ${active
                                ? "bg-blue-50 font-medium text-blue-800"
                                : "text-slate-900 hover:bg-slate-100"
                                }`}
                        >
                            <span>{t.title}</span>
                            <span className={`font-mono text-[13px] ${active ? "" : "text-slate-600"}`}>
                                {done}/{total}
                            </span>
                        </button>
                    )
                })}
            </div>

            <button
                type="button"
                className="flex min-h-11 items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 text-left text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
            >
                <Plus className="h-4 w-4" />
                New track
            </button>
        </nav>
    )
}
