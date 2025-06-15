import React, { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Signup() {
  const { signup } = useAuth()
  const [email, setEmail] = useState("")
  const [pass, setPass]   = useState("")
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      await signup(email, pass)
    } catch (err:any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <input
        type="email" placeholder="Email"
        value={email} onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password" placeholder="Password"
        value={pass} onChange={e => setPass(e.target.value)}
      />
      <button type="submit">Create Account</button>
    </form>
  )
}