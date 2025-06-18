import React, { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../utils/firebase"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User} from "firebase/auth"

interface AuthContextType {
  user: User | null
  signup: (email: string, pass: string) => Promise<void>
  login:  (email: string, pass: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signup = (email: string, pass: string) =>
    createUserWithEmailAndPassword(auth, email, pass).then(() => {})

  const login = (email: string, pass: string) =>
    signInWithEmailAndPassword(auth, email, pass).then(() => {})

  const logout = () => signOut(auth)

  if (loading) return <div>Loading…</div>

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
