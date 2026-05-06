import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import Link from 'next/link'
import type { Inspection } from '@/types'
export const revalidate = 0
function StatusBadge({ status }: { status: string }) {
  return <span className={`tag ${status==='PASS'?'tag-green':status==='FAIL'?'tag-red':'tag-amber'}`}>{status}</span>
}
export default async function ReportsPage() {
  const { data: inspections, error } = await supabase.from('inspections').select('*').order('created_at', { ascending: false })
  if (error) return <><Nav /><div style={{padding:40,color:'var(--red)'}}>Error: {error.message}</div></>
  const total  = inspections?.length ?? 0
  const passes = inspections?.filter(i => i.overall_status === 'PASS').length ?? 0
  const fails  = inspections?.filter(i => i.overall_status === 'FAIL').length ?? 0
  return (
    <>
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
        {total === 0 ? (
          <div className="card" style={{padding:40,textAlign:'center',color:'var(--sub)'}}>
            <p style={{fontFamily:'DM Mono, monospace',fontSize:13}}>No inspections yet. Scan a QR code to start.</p>
            <Link href="/qr-sheet" className="btn btn-primary" style={{marginTop:20,display:'inline-flex'}}>Go to QR Sheet</Link>
          </div>
        ) : (
          <div className="card" style={{overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid var(--border)'}}>
                  {['Date','Serial','Location','Inspector','Status',''].map(h => (
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--sub)',fontWeight:500}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(inspections as Inspection[]).map((insp, idx) => (
                  <tr key={insp.id} style={{borderBottom:idx < inspections.length-1?'1px solid var(--border)':'none'}}>
                    <td style={{padding:'13px 16px',fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--sub)'}}>{insp.inspected_at}</td>
                    <td style={{padding:'13px 16px',fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--accent)'}}>{insp.serial}</td>
                    <td style={{padding:'13px 16px',fontSize:13,maxWidth:200}}><span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{insp.location}</span></td>
                    <td style={{padding:'13px 16px',fontSize:13}}>{insp.inspector_name}</td>
                    <td style={{padding:'13px 16px'}}><StatusBadge status={insp.overall_status} /></td>
                    <td style={{padding:'13px 16px'}}><Link href={`/reports/${insp.id}`} className="tag tag-sub">View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  )
}
