import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from '../../services/Api'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(token ? jwtDecode(token) : null)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setUser(null)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('api/v0.1/profile')
      setUser(response.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}
