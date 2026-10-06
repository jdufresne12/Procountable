import { useState } from "react"
import Navbar from "./components/Navbar"
import RoadmapTap from "./components/RoadmapTab"
import TrackView from "./components/TrackView"
import TaskDetail from "./components/TaskDetail"
import { useRoadmaps } from "./contexts/RoadmapContext"
import Loading from "./components/Loading"

function App() {
  const { loaded, roadmaps, updateTask, createTask, deleteTask, updateModule, createModule, deleteModule, createTrack, updateTrack, deleteTrack } = useRoadmaps()
  const [roadmapId, setRoadmapId] = useState<string | undefined>()
  const [trackId, setTrackId] = useState<string | undefined>()
  const [taskId, setTaskId] = useState<string | undefined>()

  if (!loaded) return <Loading />
  if (roadmaps.length === 0) return <p>No roadmaps yet.</p>

  const roadmap = roadmaps.find((r) => r.id === roadmapId) ?? roadmaps[0]
  const track = roadmap.tracks.find((t) => t.id === trackId) ?? roadmap.tracks[0]
  const currentModule =
    track?.modules.find((m) => m.tasks.some((t) => t.id === taskId)) ?? track?.modules[0]
  const task = currentModule?.tasks.find((t) => t.id === taskId) ?? currentModule?.tasks[0]

  return (
    <div className="flex min-h-full flex-col font-sans lg:h-full text-[15px] text-slate-900">
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col bg-slate-50 lg:flex-row">
        <RoadmapTap
          roadmaps={roadmaps}
          roadmap={roadmap}
          trackId={track?.id}
          onSelectRoadmap={setRoadmapId}
          onSelectTrack={setTrackId}
          onCreateTrack={createTrack}
          onDeleteTrack={deleteTrack}
        />
        <TrackView
          track={track}
          selectedTaskId={task?.id}
          onSelectTask={setTaskId}
          onUpdateTask={updateTask}
          onCreateTask={createTask}
          onUpdateModule={updateModule}
          onCreateModule={createModule}
          onDeleteModule={deleteModule}
          onUpdateTrack={updateTrack}
          onDeleteTrack={deleteTrack}
        />
        <TaskDetail
          breadcrumb={[roadmap.title, track?.title, currentModule?.title].filter(Boolean).join(" / ")}
          task={task}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  )
}

export default App
