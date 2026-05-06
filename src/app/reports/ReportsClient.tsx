'use client'
import Link from 'next/link'
import { generateInspectionPdf } from '@/lib/generatePdf'
import type { Inspection } from '@/types'

function StatusBadge({ status }: { status: string }) {
  return <span className={`tag ${status==='PASS'?'tag-green':status==='FAIL'?'tag-red':'tag-amber'}`}>{status}</span>
}

export default function ReportsClient({ inspections }: { inspections: Inspection[] }) {
  if (inspections.length === 0) return (
    <div className="card" style={{padding:40,textAlign:'center',color:'var(--sub)'}}>
      <p style={{fontFamily:'DM Mono, monospace',fontSize:13}}>No inspections yet. Scan a QR code to start.</p>
      <Link href="/qr-sheet" className="btn btn-primary" style={{marginTop:20,display:'inline-flex'}}>Go to QR Sheet</Link>
    </div>
  )
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'1px solid var(--border)'}}>
            {['Date','Serial','Location','Inspector','Status','PDF',''].map(h => (
              <th key={h} style={{padding:'12px 16px',textAlign:'left',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--sub)',fontWeight:500}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {inspections.map((insp, idx) => (
            <tr key={insp.id} style={{borderBottom:idx < inspections.length-1?'1px solid var(--border)':'none'}}>
              <td style={{padding:'13px 16px',fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--sub)'}}>{insp.inspected_at}</td>
              <td style={{padding:'13px 16px',fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--accent)'}}>{insp.serial}</td>
              <td style={{padding:'13px 16px',fontSize:13,maxWidth:180}}><span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{insp.location}</span></td>
              <td style={{padding:'13px 16px',fontSize:13}}>{insp.inspector_name}</td>
              <td style={{padding:'13px 16px'}}><StatusBadge status={insp.overall_status} /></td>
              <td style={{padding:'13px 16px'}}>
                <button onClick={() => generateInspectionPdf(insp)} className="tag tag-sub" style={{cursor:'pointer',border:'none',background:'rgba(255,255,255,0.04)',display:'inline-flex',alignItems:'center',gap:4}}>
                  ⬇ PDF
                </button>
              </td>
              <td style={{padding:'13px 16px'}}>
                <Link href={`/reports/${insp.id}`} className="tag tag-sub">View →</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
