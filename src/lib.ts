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

export function describeTrackContents(track: Track) {
    const tasks = countTasks(track.modules).total
    const modules = track.modules.length
    if (modules === 0) return "This track is empty. This can't be undone."
    return `This also deletes its ${modules} ${modules === 1 ? "module" : "modules"} and ${tasks} ${tasks === 1 ? "task" : "tasks"}. This can't be undone.`
}