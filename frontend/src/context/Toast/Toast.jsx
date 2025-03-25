import { createContext, useState, useContext, useEffect } from 'react'
import './Toast.css'
import SuccessIcon from '../../assets/images/circle-check-solid.svg'
import ErrorIcon from '../../assets/images/circle-xmark-solid.svg'
import InfoIcon from '../../assets/images/circle-info-solid.svg'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = (type, message) => {
    setTimeout(() => {
      setToast({ type, message })
    }, 300)
  }

  const closeToast = () => setToast(null)

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          {...toast}
          onClose={closeToast}
        />
      )}
    </ToastContext.Provider>
  )
}

const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast ${type} toast-top`}>
      <div className='container-1'>
        <i className='toast-info-icon'>
          <img
            src={
              type === 'Success'
                ? SuccessIcon
                : type === 'Error'
                ? ErrorIcon
                : InfoIcon
            }
            alt='icon.svg'
          />
        </i>
      </div>
      <div className='container-2'>
        <p>{type}</p>
        <p>{message}</p>
      </div>
      <button onClick={onClose}>&times;</button>
    </div>
  )
}

export default Toast
