import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBx02lPQg67ZA_hTwoj3o0fyLCVaQvbPos",
  authDomain: "chatgpt-messenger-e17f1.firebaseapp.com",
  projectId: "chatgpt-messenger-e17f1",
  storageBucket: "chatgpt-messenger-e17f1.appspot.com",
  messagingSenderId: "290360490210",
  appId: "1:290360490210:web:7a3ad14aa8a034cbba86bb"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
