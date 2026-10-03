import { useState } from "react"
import Dropdown from "./DropdownMenu"

const roadmaps = [
    {
        value: "coding-review",
        label: "Coding Review",
    },
    {
        value: "system-design",
        label: "System Design",
    },
    {
        value: "algorithms",
        label: "Algorithms",
    },
    {
        value: "databases",
        label: "Databases",
    },
]

const tracks = [
    {
        value: "algorithms",
        label: "Algorithms",
        tasks: 7,
        completedTasks: 2
    },
    {
        value: "system-design",
        label: "System Design",
        tasks: 4,
        completedTasks: 0
    },
    {
        value: "mini-projects",
        label: "Mini Projects",
        tasks: 3,
        completedTasks: 0
    },
    {
        value: "devops",
        label: "DevOps",
        tasks: 2,
        completedTasks: 0
    },
]

export default function TopicsTab() {
    const [roadmap, setRoadmap] = useState("coding-review")
    const [track, setTrack] = useState("algorithms")

    return (
        <div id="topics-tab" className="flex-col w-1/4 h-full">
            {/* RoadMaps */}
            <div className="flex-col pl-5">
                <h1 className="uppercase text-sm text-slate-600 pt-5 pl-2">roadmap</h1>
                <div className="w-48 pt-2">
                    <Dropdown
                        options={roadmaps}
                        value={roadmap}
                        onChange={setRoadmap}
                    />
                </div>
                <div className="pt-1 pl-1">
                    <button className="text-sm text-blue-900 font-light hover:text-slate-500"> New roadmap </button>
                </div>
            </div>

            {/* Tracks */}
            <div className="flex-col pl-5 pt-5">
                <h1 className="uppercase text-sm text-slate-600 pt-5 pl-2">tracks</h1>
                <div className="w-48 pt-2">
                    {tracks.map((t) => (
                        <div className={`rounded-md ${track === t.value ? "bg-blue-200/65 text-blue-500 font-bold" : "hover:bg-blue-200/25 hover:text-blue-500"}`}>
                            <button onClick={() => setTrack(t.value)} className="p-2">
                                <text>
                                    {t.label}
                                </text>
                                <text>
                                    {t.completedTasks}/{t.tasks}
                                </text>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="border-2 border-dashed border-slate-200 text-slate-500 rounded-md mt-5 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700">
                    <button className="p-2">
                        + New track
                    </button>
                </div>
            </div>
        </div>
    )
}