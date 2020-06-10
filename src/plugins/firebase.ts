import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBivLALqqp8VyN4vQKpYZam7BzIGw-i9uk',
    authDomain: 'linzin-44b96.firebaseapp.com',
    databaseURL: 'https://linzin-44b96.firebaseio.com',
    projectId: 'linzin-44b96',
    storageBucket: 'linzin-44b96.appspot.com',
    messagingSenderId: '1067673168663',
    appId: '1:1067673168663:web:37767f16d04e1516126552',
    measurementId: 'G-75628B088Y'
  })
}
export const storage = firebase.storage()
export const db = firebase.database()
