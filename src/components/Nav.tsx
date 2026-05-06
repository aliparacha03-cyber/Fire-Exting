'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

export default function Nav() {
  const path = usePathname()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <div className="flame">🔥</div>
        <span>FireInspect</span>
      </Link>
      <div className="nav-links">
        <Link href="/qr-sheet" className={`nav-link ${path === '/qr-sheet' ? 'active' : ''}`}>QR Sheet</Link>
        <Link href="/reports" className={`nav-link ${path.startsWith('/reports') ? 'active' : ''}`}>Reports</Link>
        <button className="nav-link" onClick={handleLogout} style={{color:'var(--red)',cursor:'pointer'}}>Sign Out</button>
      </div>
    </nav>
  )
}
