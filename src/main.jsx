import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Blog pages are prerendered for crawlers (scripts/prerender-blog.mjs). Their
// structured data and article meta are for non-JS crawlers only; once the app
// runs, the Seo component owns those tags, so drop the static copies.
document.querySelectorAll('[data-prerender]').forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
