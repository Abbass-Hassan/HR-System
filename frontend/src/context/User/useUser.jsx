import { useContext } from 'react'
import { UserContext } from './UserContext'
export const useUser = () => {
  const { user, setUser, token, setToken } = useContext(UserContext)

  return { user, setUser, token, setToken }
}
