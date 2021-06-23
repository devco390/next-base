import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  logoutGmail,
  getLocalStorageUserInfo
} from 'firebase/Client'
import { useRouter } from 'next/router'

import { USER_LOGIN_STATES } from 'models/login'

const LOGIN_ROUTE = `/login`

export default function useUser() {
  const [user, setUser] = useState(USER_LOGIN_STATES.NOT_KNOWN)
  const router = useRouter()

  useEffect(() => {
    if (getLocalStorageUserInfo() === undefined) {
      logout()
    } else {
      onAuthStateChanged(setUser)
    }
  }, [])

  useEffect(() => {
    if (user === USER_LOGIN_STATES.NOT_LOGGED) {
      router.replace(LOGIN_ROUTE)
    } else if (user && router.asPath === LOGIN_ROUTE) {
      router.replace('/')
    }
  }, [user])

  const logout = () => {
    logoutGmail()
      .then(() => {
        console.log('logout success')
      })
      .catch((error) => {
        console.log(`Logout failed ${error}`)
      })
  }

  return { user, logout }
}
