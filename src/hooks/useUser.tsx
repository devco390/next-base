import { useEffect, useState } from 'react'
import { onAuthStateChanged, getLocalStorageUserInfo } from 'firebase/Client'
import { useRouter } from 'next/router'

import { USER_LOGIN_STATES } from 'models/login'
import { IUser } from 'models/user'

const LOGIN_ROUTE = `/login`

export default function useUser() {
  const [user, setUser] = useState<IUser | undefined>(
    USER_LOGIN_STATES.NOT_KNOWN
  )
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(setUser)
  }, [])

  useEffect(() => {
    if (user === USER_LOGIN_STATES.NOT_LOGGED) {
      router.replace(LOGIN_ROUTE)
    } else if (user && router.asPath === LOGIN_ROUTE) {
      router.replace('/')
    }
  }, [user])

  return { user }
}
