// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC3dAW4RatDqhWR-7rgCld1eyIXTXC_UgM",
  authDomain: "mytravelwebsite-d5170.firebaseapp.com",
  projectId: "mytravelwebsite-d5170",
  storageBucket: "mytravelwebsite-d5170.firebasestorage.app",
  messagingSenderId: "324638234234",
  appId: "1:324638234234:web:fce304857ddedbd2f40dc3"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)