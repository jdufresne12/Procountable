import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RoadmapProvider } from './contexts/RoadmapContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoadmapProvider>
      <App />
    </RoadmapProvider>
  </StrictMode>,
)
