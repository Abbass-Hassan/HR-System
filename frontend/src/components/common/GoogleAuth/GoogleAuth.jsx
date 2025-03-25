import { useEffect } from 'react'

const GoogleAuth = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')

    if (token) {
      window.opener.postMessage({ token }, window.location.origin)
    } else if (error) {
      window.opener.postMessage({ error }, window.location.origin)
    }

    window.close()
  }, [])

  return <div></div>
}

export default GoogleAuth
