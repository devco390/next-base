import firebaseClient from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

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

export const setLocalStorageUserInfo = (user) => {
  if (user === undefined) {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY)
  } else {
    localStorage[LOCAL_STORAGE_USER_KEY] = JSON.stringify(user)
  }
}

export const getLocalStorageUserInfo = () => {
  return localStorage[LOCAL_STORAGE_USER_KEY] === undefined
    ? undefined
    : JSON.parse(localStorage[LOCAL_STORAGE_USER_KEY])
}

const mapUserFromFirebaseAuthToUser = (user) => {
  const psUserData = getLocalStorageUserInfo()
  const { displayName, email, photoURL, uid } = user

  return psUserData === undefined
    ? undefined
    : {
        ...psUserData,
        displayName,
        photoURL,
        email,
        uid
      }
}

export const logoutGmail = () => {
  return firebaseClient.auth().signOut()
}

export const onAuthStateChanged = (onChange) => {
  return firebaseClient.auth().onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null

    onChange(normalizedUser)
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
