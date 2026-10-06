import { createContext, use, useEffect, useReducer, useState } from "react"
import type { ReactNode } from "react"
import type { Roadmap, Track, Module, Task } from "../types"
import { loadRoadmaps, saveRoadmaps } from "../data/roadmapRepo"

// ----- Reducer -----
type Action =
    | { type: "loaded"; roadmaps: Roadmap[] }
    | { type: "taskUpdated"; id: string; patch: Partial<Task> }
    | { type: "taskCreated"; moduleId: string, task: Task }
    | { type: "taskDeleted"; id: string }
    | { type: "moduleUpdated"; id: string; patch: Partial<Module> }
    | { type: "moduleCreated"; trackId: string, module: Module }
    | { type: "moduleDeleted"; id: string }
    | { type: "trackUpdated"; id: string, patch: Partial<Track> }
    | { type: "trackCreated"; roadmapId: string, track: Track }
    | { type: "trackDeleted"; id: string, }

function roadmapReducer(state: Roadmap[], action: Action): Roadmap[] {
    switch (action.type) {
        case "loaded":
            return action.roadmaps
        case "taskUpdated":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) => ({
                    ...track,
                    modules: track.modules.map((module) => ({
                        ...module,
                        tasks: module.tasks.map((task) =>
                            task.id === action.id ? { ...task, ...action.patch } : task
                        ),
                    })),
                })),
            }))
        case "taskCreated":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) => ({
                    ...track,
                    modules: track.modules.map((module) =>
                        module.id === action.moduleId
                            ? { ...module, tasks: [...module.tasks, action.task] }
                            : module,
                    )
                }))
            }))
        case "taskDeleted":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) => ({
                    ...track,
                    modules: track.modules.map((module) => ({
                        ...module,
                        tasks: module.tasks.filter((task) => task.id !== action.id)
                    }))
                }))
            }))
        case "moduleUpdated":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) => ({
                    ...track,
                    modules: track.modules.map((module) =>
                        module.id === action.id ? { ...module, ...action.patch } : module
                    )
                }))
            }))
        case "moduleCreated":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) =>
                    track.id === action.trackId
                        ? { ...track, modules: [...track.modules, action.module] }
                        : track
                )
            }))
        case "moduleDeleted":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) => ({
                    ...track,
                    modules: track.modules.filter((module) => module.id !== action.id)
                }))
            }))
        case "trackUpdated":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.map((track) =>
                    track.id === action.id ? { ...track, ...action.patch } : track
                )
            }))
        case "trackCreated":
            return state.map((roadmap) => roadmap.id === action.roadmapId
                ? { ...roadmap, tracks: [...roadmap.tracks, action.track] } : roadmap
            )
        case "trackDeleted":
            return state.map((roadmap) => ({
                ...roadmap,
                tracks: roadmap.tracks.filter((track) => track.id !== action.id)
            }))
    }
}

// ----- Context -----
type RoadmapStore = {
    loaded: boolean
    roadmaps: Roadmap[]
    updateTask: (id: string, patch: Partial<Task>) => void
    createTask: (moduleid: string, week: number) => string
    deleteTask: (id: string) => void
    updateModule: (id: string, patch: Partial<Module>) => void
    createModule: (trackId: string) => void
    deleteModule: (id: string) => void
    updateTrack: (id: string, patch: Partial<Track>) => void
    createTrack: (roadmapId: string) => string
    deleteTrack: (id: string) => void
}

const RoadmapContext = createContext<RoadmapStore | null>(null)
export function RoadmapProvider({ children }: { children: ReactNode }) {
    const [roadmaps, dispatch] = useReducer(roadmapReducer, [])
    const [loaded, setLoaded] = useState(false)

    // Load data
    useEffect(() => {
        loadRoadmaps()
            .then((data) => {
                console.log(data)
                dispatch({ type: "loaded", roadmaps: data })
                setLoaded(true)
            })
    }, [])

    useEffect(() => {
        if (!loaded) return
        const timer = setTimeout(() => {
            saveRoadmaps(roadmaps).catch((error) => console.error("Failed to save roadmaps", error))
        }, 1000)
        return () => clearTimeout(timer)
    }, [roadmaps, loaded])

    const store: RoadmapStore = {
        loaded,
        roadmaps,
        updateTask: (id, patch) => dispatch({
            type: "taskUpdated",
            id,
            patch
        }),
        createTask: (moduleId, week) => {
            const id = crypto.randomUUID()
            dispatch({
                type: "taskCreated",
                moduleId,
                task: {
                    id: id,
                    title: "New task",
                    ref: "",
                    status: "not-started",
                    week: week,
                    notes: "",
                    links: []
                }
            })
            return id
        },
        deleteTask: (id) => dispatch({ type: "taskDeleted", id }),
        updateModule: (id, patch) => dispatch({
            type: "moduleUpdated",
            id,
            patch
        }),
        createModule: (trackId) =>
            dispatch({
                type: "moduleCreated",
                trackId,
                module: {
                    id: crypto.randomUUID(),
                    title: "New module",
                    tasks: []
                }
            }),
        deleteModule: (id) => dispatch({ type: "moduleDeleted", id }),
        updateTrack: (id, patch) => dispatch({
            type: "trackUpdated",
            id,
            patch
        }),
        createTrack: (roadmapId) => {
            const id = crypto.randomUUID()
            dispatch({
                type: "trackCreated",
                roadmapId,
                track: {
                    id: id,
                    title: "New track",
                    modules: []
                }
            })
            return id
        },
        deleteTrack: (id) => dispatch({ type: "trackDeleted", id }),
    }
    return <RoadmapContext value={store}> {children} </RoadmapContext>
}

export function useRoadmaps() {
    const store = use(RoadmapContext)
    if (!store) throw new Error("useRoadmaps must be used inside <RoadmapProvider>")
    return store
}