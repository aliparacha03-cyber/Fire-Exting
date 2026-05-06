'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (login(password)) {
        router.push('/qr-sheet')
      } else {
        setError('Incorrect password. Try again.')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--dark)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <div style={{width:56,height:56,background:'var(--red)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 16px'}}>🔥</div>
          <h1 style={{fontSize:26,fontWeight:800,letterSpacing:'-0.5px',marginBottom:6}}>FireInspect</h1>
          <p style={{color:'var(--sub)',fontFamily:'DM Mono, monospace',fontSize:12}}>Pet Valu — 10750 Highway 50</p>
        </div>
        <div className="card" style={{padding:'32px 28px'}}>
          <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:3,textTransform:'uppercase',marginB

cat > src/components/AuthGuard.tsx << 'EOF'
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthed(true)
    } else {
      router.replace('/login')
    }
    setChecked(true)
  }, [router])

  if (!checked) return (
    <div style={{minHeight:'100vh',background:'var(--dark)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p style={{color:'var(--sub)',fontFamily:'DM Mono, monospace',fontSize:13}}>Loading…</p>
    </div>
  )

  if (!authed) return null
  return <>{children}</>
}
