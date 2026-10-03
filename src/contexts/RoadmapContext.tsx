import { createContext, use, useEffect, useReducer, useState } from "react"
import type { ReactNode } from "react"
import type { Roadmap, Task } from "../types"
import { loadRoadmaps, saveRoadmaps } from "../data/roadmapRepo"

// ----- Reducer -----
type Action =
    | { type: "loaded"; roadmaps: Roadmap[] }
    | { type: "taskUpdated"; id: string; patch: Partial<Task> }

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
    }
}

// ----- Context -----

type RoadmapStore = {
    loaded: boolean
    roadmaps: Roadmap[]
    updateTask: (id: string, patch: Partial<Task>) => void
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
        updateTask: (id, patch) => dispatch({ type: "taskUpdated", id, patch })
    }
    return <RoadmapContext value={store}> {children} </RoadmapContext>
}

export function useRoadmaps() {
    const store = use(RoadmapContext)
    if (!store) throw new Error("useRoadmaps must be used inside <RoadmapProvider>")
    return store
}