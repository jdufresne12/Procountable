export type Status = "not-started" | "in-progress" | "done"

export type TaskLink = {
    label: string
    url: string
}

export type Task = {
    id: string
    title: string
    ref?: string
    status: Status
    week: number
    notes: string
    links: TaskLink[]
}

export type Module = {
    id: string
    title: string
    tasks: Task[]
}

export type Track = {
    id: string
    title: string
    modules: Module[]
}

export type Roadmap = {
    id: string
    title: string
    tracks: Track[]
}
