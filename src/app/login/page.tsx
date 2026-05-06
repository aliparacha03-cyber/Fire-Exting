'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (password === 'Petvalu2026') {
        document.cookie = 'fire_auth=Petvalu2026; path=/; max-age=86400'
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
          <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:3,textTransform:'uppercase',marginBottom:20}}>Enter Password</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••••••"
              autoFocus
              style={{width:'100%',background:'rgba(255,255,255,0.05)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',fontSize:18,color:'var(--text)',outline:'none',marginBottom:12,letterSpacing:4}}
            />
            {error && <p style={{color:'var(--red)',fontFamily:'DM Mono, monospace',fontSize:12,marginBottom:12}}>⚠ {error}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading || !password} style={{width:'100%',justifyContent:'center',fontSize:15,padding:'14px',opacity:loading?0.7:1}}>
              {loading ? 'Checking…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
