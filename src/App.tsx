import Navbar from "./components/Navbar"
import TopicsTab from "./components/TopicsTab"
import TopicView from "./components/TopicView"


function App() {
  return (
    <>
      <Navbar />
      <div className="flex w-full h-full">
        <TopicsTab />
        <TopicView />
      </div>
    </>
  )
}

export default App
