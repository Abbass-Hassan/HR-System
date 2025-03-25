import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/Toast/Toast.jsx'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Fragment>
)
