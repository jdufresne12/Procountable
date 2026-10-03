import type { Module, Track } from "./types"

export function countTasks(modules: Module[]) {
    const tasks = modules.flatMap((m) => m.tasks)
    return {
        total: tasks.length,
        done: tasks.filter((t) => t.status === "done").length,
    }
}

export function weeksInTrack(track: Track) {
    const weeks = new Set(track.modules.flatMap((m) => m.tasks.map((t) => t.week)))
    return [...weeks].sort((a, b) => a - b)
}
