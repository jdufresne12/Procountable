import { useState } from "react"
import { ContextMenu } from "radix-ui"
import { Plus, Trash2 } from "lucide-react"
import Dropdown from "./DropdownMenu"
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"
import { countTasks, describeTrackContents } from "../lib"
import type { Roadmap, Track } from "../types"

type RoadmapTabProps = {
    roadmaps: Roadmap[]
    roadmap: Roadmap
    trackId?: string
    onSelectRoadmap: (id: string) => void
    onSelectTrack: (id: string) => void
    onCreateTrack: (roadmapId: string) => string
    onDeleteTrack: (id: string) => void
}

const sectionLabel = "px-3 font-mono text-xs uppercase tracking-wider text-slate-600"

export default function RoadmapTab({
    roadmaps,
    roadmap,
    trackId,
    onSelectRoadmap,
    onSelectTrack,
    onCreateTrack,
    onDeleteTrack
}: RoadmapTabProps) {
    const [trackToDelete, setTrackToDelete] = useState<Track | null>(null)

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
                        <ContextMenu.Root key={t.id}>
                            <ContextMenu.Trigger asChild>
                                <button
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
                            </ContextMenu.Trigger>
                            <ContextMenu.Portal>
                                <ContextMenu.Content className="z-50 min-w-44 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 font-sans text-[15px] shadow-lg">
                                    <ContextMenu.Item
                                        onSelect={() => setTrackToDelete(t)}
                                        className="flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2.5 text-red-700 outline-none data-highlighted:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete track
                                    </ContextMenu.Item>
                                </ContextMenu.Content>
                            </ContextMenu.Portal>
                        </ContextMenu.Root>
                    )
                })}
            </div>

            <button
                type="button"
                className="flex min-h-11 items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 text-left text-slate-600 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
                onClick={() => {
                    const newTrackId = onCreateTrack(roadmap.id)
                    onSelectTrack(newTrackId)
                }}
            >
                <Plus className="h-4 w-4" />
                New track
            </button>

            <ConfirmDeleteDialog
                open={trackToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setTrackToDelete(null)
                }}
                title={`Delete "${trackToDelete?.title}"?`}
                description={trackToDelete ? describeTrackContents(trackToDelete) : ""}
                confirmLabel="Delete track"
                onConfirm={() => {
                    if (trackToDelete) onDeleteTrack(trackToDelete.id)
                }}
            />
        </nav>
    )
}
