import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/auth'

// Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  apiKey: 'AIzaSyAehGfPEzYsIlAcS3HWwjxgxzoPB29HtS4',
  authDomain: 'react-apps-e06b2.firebaseapp.com',
  databaseURL: 'https://react-apps-e06b2.firebaseio.com',
  projectId: 'react-apps-e06b2',
  storageBucket: 'react-apps-e06b2.appspot.com',
  messagingSenderId: '422301719317',
  appId: '1:422301719317:web:f739e6fddc9a718ffd271c'
}

const fireAuth = firebase.initializeApp(firebaseConfig) // needed for Authentification
const storage = firebase.storage() // for uploading images
const db = firebase.firestore() // for saving strings and numbers in database

export { fireAuth, storage, db, firebase }
