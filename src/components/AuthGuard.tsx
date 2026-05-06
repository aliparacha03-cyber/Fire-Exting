'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('fire_auth='))
    const val = cookie?.split('=')[1]?.trim()
    if (val === 'Petvalu2026') {
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
