'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
export default function Nav() {
  const path = usePathname()
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <div className="flame">🔥</div>
        <span>FireInspect</span>
      </Link>
      <div className="nav-links">
        <Link href="/qr-sheet" className={`nav-link ${path === '/qr-sheet' ? 'active' : ''}`}>QR Sheet</Link>
        <Link href="/reports" className={`nav-link ${path.startsWith('/reports') ? 'active' : ''}`}>Reports</Link>
      </div>
    </nav>
  )
}
