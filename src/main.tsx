import blueprint from './api/blueprint'
import './index.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App api={blueprint} />
  </React.StrictMode>
)
