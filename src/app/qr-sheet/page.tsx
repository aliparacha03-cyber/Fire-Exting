import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import QRGrid from './QRGrid'
import AuthGuard from '@/components/AuthGuard'

export const dynamic = 'force-dynamic'

export default async function QRSheetPage() {
  const { data: extinguishers, error } = await supabase
    .from('extinguishers')
    .select('*')
    .order('created_at')
    .range(0, 999)

  if (error) return <><Nav /><div style={{padding:40,color:'var(--red)'}}>Error: {error.message}</div></>

  return (
    <AuthGuard>
      <Nav />
      <main style={{maxWidth:1100,margin:'0 auto',padding:'36px 20px 60px'}}>
        <div style={{marginBottom:36}}>
          <p className="section-eyebrow">▸ Pet Valu — 10750 Highway 50, Brampton</p>
          <h1 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:800,letterSpacing:'-0.5px',lineHeight:1.1}}>
            Fire Extinguisher QR Sheet
          </h1>
          <p style={{color:'var(--sub)',fontFamily:'DM Mono, monospace',fontSize:13,marginTop:8}}>
            {extinguishers?.length ?? 0} units · Print and post each card near its unit
          </p>
        </div>
        <QRGrid extinguishers={extinguishers ?? []} />
      </main>
    </AuthGuard>
  )
}
