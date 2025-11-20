import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { CursorProvider } from './context/CursorContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <CursorProvider>
        <App />
      </CursorProvider>
    </LanguageProvider>
  </StrictMode>,
)
