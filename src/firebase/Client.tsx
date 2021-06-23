import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)

!firebase.apps.length && firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

// export const addUser = ({ userId, email, userName, rol, state }) => {
//   return db.collection('users').add({
//     userId,
//     email,
//     userName,
//     rol,
//     state,
//     createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
//     lastUpdate: firebase.firestore.Timestamp.fromDate(new Date())
//   })
// }
