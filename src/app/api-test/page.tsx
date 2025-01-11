'use client'
import React from 'react'
import { Button } from '../components/ui/button'
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function AuthLoginTestPage() {
  const router = useRouter()
  const { update, data: session } = useSession()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  async function handleLogin({ email, pass }: { email: string; pass: string }) {
    try {
      const res = await signIn('credentials', {
        email,
        password: pass,
        redirect: false,
        callbackUrl: '/'
      })
      if (res?.error) {
        console.error(res)
      } else {
        console.log(session)
        window.location.href = '/'
      }
    } catch (e) {}
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-2">
      <h1>Auth Test Page</h1>
      <div className="border-1 flex flex-col gap-y-2 border px-2">
        <label>Email</label>
        <input
          type="text"
          className="bg-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="bg-white"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button onClick={() => handleLogin({ email, pass: password })}>Login</Button>
      </div>
    </div>
  )
}

export default AuthLoginTestPage
