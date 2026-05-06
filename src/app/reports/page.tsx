import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import AuthGuard from '@/components/AuthGuard'
import ReportsClient from './ReportsClient'
import type { Inspection } from '@/types'

export const revalidate = 0

export default async function ReportsPage() {
  const { data: inspections, error } = await supabase.from('inspections').select('*').order('created_at', { ascending: false })
  if (error) return <><Nav /><div style={{padding:40,color:'var(--red)'}}>Error: {error.message}</div></>
  const total  = inspections?.length ?? 0
  const passes = inspections?.filter(i => i.overall_status === 'PASS').length ?? 0
  const fails  = inspections?.filter(i => i.overall_status === 'FAIL').length ?? 0
  return (
    <AuthGuard>
      <Nav />
      <main style={{maxWidth:900,margin:'0 auto',padding:'36px 20px 60px'}}>
        <div style={{marginBottom:32}}>
          <p className="section-eyebrow">▸ Inspection History</p>
          <h1 style={{fontSize:'clamp(22px,4vw,30px)',fontWeight:800,letterSpacing:'-0.5px'}}>All Reports</h1>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:32}}>
          {[{label:'Total',value:total,color:'var(--text)'},{label:'Passed',value:passes,color:'var(--green)'},{label:'Failed',value:fails,color:'var(--red)'}].map(s => (
            <div key={s.label} className="card" style={{padding:'18px 20px'}}>
              <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:2,textTransform:'uppercase',marginBottom:6}}>{s.label}</p>
              <p style={{fontSize:28,fontWeight:800,color:s.color}}>{s.value}</p>
            </div>
          ))}
        </div>
        <ReportsClient inspections={(inspections ?? []) as Inspection[]} />
      </main>
    </AuthGuard>
  )
}
