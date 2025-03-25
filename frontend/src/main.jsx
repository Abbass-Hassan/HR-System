import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/Toast/Toast.jsx'
import { UserProvider } from './context/User/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <Fragment>
    <UserProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UserProvider>
  </Fragment>
)
