import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(token ? jwtDecode(token) : null)

  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token))
    } else {
      setUser(null)
    }
  }, [token])

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}
