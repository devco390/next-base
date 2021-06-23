import firebaseClient from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { USER_LOGIN_STATES } from 'models/login'
import { IUser } from 'models/user'

const LOCAL_STORAGE_USER_KEY = 'habi-user-data'

const firebaseConfig = {
  apiKey: 'AIzaSyCSchj7fZjtIm-6E9nSLjzN3H8pnc_P7hM',
  authDomain: 'habi-fe.firebaseapp.com',
  projectId: 'habi-fe',
  storageBucket: 'habi-fe.appspot.com',
  messagingSenderId: '806269648544',
  appId: '1:806269648544:web:48821239482dc44df913c5'
}

!firebaseClient.apps.length && firebaseClient.initializeApp(firebaseConfig)
const db = firebaseClient.firestore()

export const addUser = ({ userId, email, userName, rol, state }) => {
  return db.collection('users').add({
    userId,
    email,
    userName,
    rol,
    state,
    createdAt: firebaseClient.firestore.Timestamp.fromDate(new Date()),
    lastUpdate: firebaseClient.firestore.Timestamp.fromDate(new Date())
  })
}

export const setLocalStorageUserInfo = (user: IUser | undefined | null) => {
  if (user) {
    localStorage[LOCAL_STORAGE_USER_KEY] = JSON.stringify(user)
  }
}

export const clearLocalStorageUserInfo = () => {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
}

export const getLocalStorageUserInfo = (): IUser | null => {
  return localStorage[LOCAL_STORAGE_USER_KEY] === undefined
    ? null
    : JSON.parse(localStorage[LOCAL_STORAGE_USER_KEY])
}

export const logoutGmail = () => {
  return firebaseClient.auth().signOut()
}

const isLocalStorageSet = (): boolean => {
  return localStorage[LOCAL_STORAGE_USER_KEY] === undefined ? false : true
}

export const onAuthStateChanged = (setUser: any) => {
  return firebaseClient.auth().onAuthStateChanged((user) => {
    if (!isLocalStorageSet() || user === USER_LOGIN_STATES.NOT_LOGGED) {
      logoutGmail()
      clearLocalStorageUserInfo()
    }

    const normalizedUser = user === null ? null : getLocalStorageUserInfo()

    setUser(normalizedUser)
  })
}

export const loginWithGmail = () => {
  const googleProvider = new firebaseClient.auth.GoogleAuthProvider()

  return firebaseClient.auth().signInWithPopup(googleProvider)
}

export const findUserByEmail = (userEmail: string) => {
  return db
    .collection('users')
    .where('email', '==', userEmail)
    .get()
    .then(({ docs }) => {
      return docs.map((doc) => {
        const data = doc.data()
        const id = doc.id
        const { createdAt } = data

        const date = new Date(createdAt.seconds * 1000)
        const normalizedCreatedAt = new Intl.DateTimeFormat('es-CO').format(
          date
        )

        return {
          ...data,
          id,
          createdAt: normalizedCreatedAt
        }
      })
    })
}
