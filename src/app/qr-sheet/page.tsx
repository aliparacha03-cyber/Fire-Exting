import Nav from '@/components/Nav'
import AuthGuard from '@/components/AuthGuard'
import QRGrid from './QRGrid'

export default function QRSheetPage() {
  return (
    <AuthGuard>
      <Nav />
      <QRGrid />
    </AuthGuard>
  )
}
