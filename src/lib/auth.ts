// lib/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth"

import { auth, db } from "./firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

interface ExtraUserData {
  name: string
  contactNumber: string
  nic: string
  profileImageUrl: string
}

// Register new user with email/password and store extra data in Firestore
export const register = async (
  email: string,
  password: string,
  extraData: ExtraUserData
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: extraData.name,
    nic: extraData.nic,
    contactNumber: extraData.contactNumber,
   profileImageUrl: extraData.profileImageUrl || "",
    createdAt: serverTimestamp(),
    role: "user",
  })

  return user
}

// Login
export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

// Logout
export const logout = async () => {
  return await signOut(auth)
}

// Get current user (subscribe to auth changes)
export const onUserChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
