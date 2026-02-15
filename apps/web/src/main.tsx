import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryProvider } from './providers/QueryProvider'
import { WorkoutProvider } from './context/WorkoutContext' // 1. Import the provider
import { App } from './App'
import './style.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <QueryProvider>
      {/* 2. Wrap the App component so all pages can access the data */}
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </QueryProvider>
  </StrictMode>
)
