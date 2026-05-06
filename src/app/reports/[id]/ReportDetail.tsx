'use client'
import Link from 'next/link'
import { generateInspectionPdf } from '@/lib/generatePdf'
import { CHECKS, GROUP_LABELS } from '@/types'
import type { Inspection } from '@/types'

export default function ReportDetail({ report }: { report: Inspection }) {
  const checks = report.checks as Record<string, string>
  const groups = ['visual','physical','access'] as const
  const total = CHECKS.length
  const done  = Object.keys(checks).length
  const fails = Object.values(checks).filter(v => v === 'fail').length
  const passes = Object.values(checks).filter(v => v === 'pass').length
  const statusColor = report.overall_status==='PASS'?'var(--green)':report.overall_status==='FAIL'?'var(--red)':'var(--accent)'

  return (
    <main style={{maxWidth:720,margin:'0 auto',padding:'32px 16px 80px'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <Link href="/reports" className="tag tag-sub" style={{display:'inline-flex',cursor:'pointer',alignItems:'center',gap:4}}>← All Reports</Link>
        <button onClick={() => generateInspectionPdf(report)} className="btn btn-ghost" style={{fontSize:13,padding:'6px 16px',marginLeft:'auto'}}>
          ⬇ Download PDF
        </button>
      </div>
      <div className="card" style={{padding:'22px 24px',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
          <div>
            <p className="section-eyebrow" style={{marginBottom:4}}>▸ Inspection Report</p>
            <h1 style={{fontSize:20,fontWeight:800,lineHeight:1.2,marginBottom:6}}>{report.location}</h1>
            <p style={{fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--sub)'}}>{report.device} · SN {report.serial}</p>
          </div>
          <div style={{textAlign:'right'}}>
            <p style={{fontSize:32,fontWeight:800,color:statusColor}}>{report.overall_status}</p>
            <p style={{fontFamily:'DM Mono, monospace',fontSize:11,color:'var(--sub)',marginTop:2}}>{passes}P · {fails}F · {total-done} skipped</p>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
        {[{label:'Inspected By',value:report.inspector_name},{label:'Date',value:report.inspected_at}].map(m => (
          <div key={m.label} className="card" style={{padding:'14px 16px'}}>
            <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:2,textTransform:'uppercase',marginBottom:5}}>{m.label}</p>
            <p style={{fontSize:14,fontWeight:600}}>{m.value}</p>
          </div>
        ))}
      </div>
      {groups.map(group => {
        const items = CHECKS.filter(c => c.group === group)
        return (
          <div key={group} style={{marginBottom:24}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,paddingBottom:8,borderBottom:'1px solid var(--border)'}}>
              <div style={{width:8,height:8,background:'var(--accent)',borderRadius:'50%'}} />
              <h3 style={{fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--accent)'}}>{GROUP_LABELS[group]}</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:7}}>
              {items.map(item => {
                const ans = checks[item.key]
                return (
                  <div key={item.key} className="card" style={{padding:'11px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,borderColor:ans==='fail'?'rgba(230,57,70,0.35)':ans==='pass'?'rgba(46,196,182,0.2)':undefined}}>
                    <p style={{fontSize:13,color:ans==='fail'?'var(--text)':'var(--sub)',flex:1}}>{item.text}</p>
                    <span className={`tag ${ans==='fail'?'tag-red':ans==='pass'?'tag-green':'tag-sub'}`}>{ans?ans.toUpperCase():'N/A'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      {report.remarks && (
        <div className="card" style={{padding:'16px 18px',marginBottom:24}}>
          <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:2,textTransform:'uppercase',marginBottom:8}}>Remarks</p>
          <p style={{fontSize:13,lineHeight:1.6}}>{report.remarks}</p>
        </div>
      )}
      <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',textAlign:'center'}}>Report ID: {report.id} · Submitted {new Date(report.created_at).toLocaleString()}</p>
    </main>
  )
}
