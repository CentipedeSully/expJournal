import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createPortal } from 'react-dom'
import { Entry } from './entry.tsx'







const root = document.getElementById('root')

if (root){
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,

  )
}





  
