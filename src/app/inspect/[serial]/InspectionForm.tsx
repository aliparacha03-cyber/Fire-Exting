'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Extinguisher } from '@/types'
import { CHECKS, GROUP_LABELS } from '@/types'
interface Props {
  extinguisher: Extinguisher
  lastInspection: { inspected_at: string; overall_status: string; inspector_name: string } | null
}
type Answers = Record<string, 'pass' | 'fail'>
const GROUPS = ['visual', 'physical', 'access'] as const
export default function InspectionForm({ extinguisher: ext, lastInspection }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Answers>({})
  const [inspector, setInspector] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [remarks, setRemarks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const total = CHECKS.length
  const done  = Object.keys(answers).length
  const fails = Object.values(answers).filter(v => v === 'fail').length
  const passes = Object.values(answers).filter(v => v === 'pass').length
  const overallStatus = fails > 0 ? 'FAIL' : done === total ? 'PASS' : 'INCOMPLETE'
  function setAnswer(key: string, val: 'pass' | 'fail') { setAnswers(prev => ({ ...prev, [key]: val })) }
  async function handleSubmit() {
    if (!inspector.trim()) { setError('Please enter your name.'); return }
    if (!date) { setError('Please enter the date.'); return }
    setError(''); setSubmitting(true)
    try {
      const res = await fetch('/api/inspections', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial: ext.serial, location: ext.location, device: ext.device, inspector_name: inspector, inspected_at: date, checks: answers, remarks }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submit failed')
      setReportId(json.inspection.id); setSubmitted(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submission failed')
    } finally { setSubmitting(false) }
  }
  if (submitted) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'70vh',padding:32,textAlign:'center'}}>
      <div style={{fontSize:64,marginBottom:24}}>{overallStatus === 'PASS' ? '✅' : '⚠️'}</div>
      <h2 style={{fontSize:28,fontWeight:800,marginBottom:8}}>{overallStatus === 'PASS' ? 'All Clear!' : 'Issues Found'}</h2>
      <p style={{color:'var(--sub)',fontFamily:'DM Mono, monospace',fontSize:13,marginBottom:8}}>{ext.location} · SN {ext.serial}</p>
      <div className={`tag ${overallStatus === 'PASS' ? 'tag-green' : 'tag-red'}`} style={{marginBottom:32}}>{overallStatus} · {passes} pass · {fails} fail</div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center'}}>
        {reportId && <button className="btn btn-ghost" onClick={() => router.push(`/reports/${reportId}`)}>View Report</button>}
        <button className="btn btn-ghost" onClick={() => router.push('/reports')}>All Reports</button>
        <button className="btn btn-primary" onClick={() => router.push('/qr-sheet')}>Back to QR Sheet</button>
      </div>
    </div>
  )
  return (
    <div style={{maxWidth:680,margin:'0 auto',padding:'28px 16px 80px'}}>
      <div className="card" style={{padding:'18px 20px',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <p className="section-eyebrow" style={{marginBottom:4}}>▸ Inspection Form</p>
            <h1 style={{fontSize:18,fontWeight:800,lineHeight:1.2,marginBottom:4}}>{ext.location}</h1>
            <p style={{fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--sub)'}}>{ext.device} · SN {ext.serial}</p>
          </div>
          {lastInspection && (
            <div style={{textAlign:'right'}}>
              <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',marginBottom:4}}>LAST INSPECTION</p>
              <div className={`tag ${lastInspection.overall_status === 'PASS' ? 'tag-green' : 'tag-red'}`}>{lastInspection.overall_status}</div>
              <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',marginTop:4}}>{lastInspection.inspected_at} · {lastInspection.inspector_name}</p>
            </div>
          )}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
        <div className="card" style={{padding:'14px 16px'}}>
          <label style={{display:'block',fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:2,textTransform:'uppercase',marginBottom:6}}>Inspected By</label>
          <input type="text" value={inspector} onChange={e => setInspector(e.target.value)} placeholder="Your name" style={{width:'100%',background:'transparent',border:'none',outline:'none',fontSize:14,fontWeight:600,color:'var(--text)'}} />
        </div>
        <div className="card" style={{padding:'14px 16px'}}>
          <label style={{display:'block',fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:2,textTransform:'uppercase',marginBottom:6}}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{width:'100%',background:'transparent',border:'none',outline:'none',fontSize:14,fontWeight:600,color:'var(--text)'}} />
        </div>
      </div>
      {GROUPS.map(group => {
        const items = CHECKS.filter(c => c.group === group)
        return (
          <div key={group} style={{marginBottom:28}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,paddingBottom:10,borderBottom:'1px solid var(--border)'}}>
              <div style={{width:8,height:8,background:'var(--accent)',borderRadius:'50%'}} />
              <h3 style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--accent)'}}>{GROUP_LABELS[group]}</h3>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {items.map(item => {
                const ans = answers[item.key]
                return (
                  <div key={item.key} className="card" style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:12,borderColor:ans==='pass'?'rgba(46,196,182,0.35)':ans==='fail'?'rgba(230,57,70,0.35)':undefined,transition:'border-color 0.15s'}}>
                    <p style={{flex:1,fontSize:13,lineHeight:1.4}}>{item.text}</p>
                    <div style={{display:'flex',gap:6,flexShrink:0}}>
                      {(['pass','fail'] as const).map(v => (
                        <button key={v} onClick={() => setAnswer(item.key, v)} style={{padding:'5px 12px',borderRadius:6,border:'1px solid',fontFamily:'DM Mono, monospace',fontSize:11,fontWeight:500,cursor:'pointer',transition:'all 0.15s',borderColor:ans===v?(v==='pass'?'var(--green)':'var(--red)'):(v==='pass'?'rgba(46,196,182,0.3)':'rgba(230,57,70,0.3)'),background:ans===v?(v==='pass'?'var(--green)':'var(--red)'):'transparent',color:ans===v?(v==='pass'?'var(--dark)':'#fff'):(v==='pass'?'var(--green)':'var(--red)')}}>
                          {v.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="card" style={{padding:'12px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,fontFamily:'DM Mono, monospace',fontSize:12}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:done===0?'var(--sub)':fails>0?'var(--red)':done===total?'var(--green)':'var(--accent)',transition:'background 0.3s'}} />
          <span style={{color:fails>0?'var(--red)':done===total?'var(--green)':'var(--sub)'}}>
            {done===0?'Not started':fails>0?`${fails} failure(s) — action required`:done===total?'All checks complete':'In progress…'}
          </span>
        </div>
        <span style={{color:'var(--sub)'}}>{done} / {total}</span>
      </div>
      <div className="card" style={{padding:'14px 16px',marginBottom:20}}>
        <label style={{display:'block',fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:2,textTransform:'uppercase',marginBottom:8}}>Remarks / Notes</label>
        <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Note any issues, maintenance required, or observations…" rows={3} style={{width:'100%',background:'transparent',border:'none',outline:'none',fontSize:13,color:'var(--text)',resize:'vertical'}} />
      </div>
      {error && <p style={{color:'var(--red)',fontFamily:'DM Mono, monospace',fontSize:12,marginBottom:12}}>⚠ {error}</p>}
      <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} style={{width:'100%',justifyContent:'center',fontSize:16,padding:'15px',opacity:submitting?0.7:1}}>
        {submitting ? 'Saving…' : '✓ Submit Inspection Report'}
      </button>
    </div>
  )
}
