'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { generateInspectionPdf } from '@/lib/generatePdf'
import type { Inspection } from '@/types'

function StatusBadge({ status }: { status: string }) {
  return <span className={`tag ${status==='PASS'?'tag-green':status==='FAIL'?'tag-red':'tag-amber'}`}>{status}</span>
}

function getMonthLabel(dateStr: string): string {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

function groupByMonth(inspections: Inspection[]): Record<string, Inspection[]> {
  const groups: Record<string, Inspection[]> = {}
  for (const insp of inspections) {
    const [year, month] = insp.inspected_at.split('-')
    const key = `${year}-${month}`
    if (!groups[key]) groups[key] = []
    groups[key].push(insp)
  }
  return groups
}

async function downloadAllPdfs(inspections: Inspection[], monthLabel: string) {
  for (const insp of inspections) {
    await generateInspectionPdf(insp)
    await new Promise(r => setTimeout(r, 300))
  }
}

export default function ReportsClient({ inspections, totalUnits }: { inspections: Inspection[], totalUnits: number }) {
  const [openMonth, setOpenMonth] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const grouped = groupByMonth(inspections)
  const monthKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  if (inspections.length === 0) return (
    <div className="card" style={{padding:40,textAlign:'center',color:'var(--sub)'}}>
      <p style={{fontFamily:'DM Mono, monospace',fontSize:13}}>No inspections yet. Scan a QR code to start.</p>
      <Link href="/qr-sheet" className="btn btn-primary" style={{marginTop:20,display:'inline-flex'}}>Go to QR Sheet</Link>
    </div>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {monthKeys.map(monthKey => {
        const monthInspections = grouped[monthKey]
        const monthLabel = getMonthLabel(monthInspections[0].inspected_at)
        const passes = monthInspections.filter(i => i.overall_status === 'PASS').length
        const fails  = monthInspections.filter(i => i.overall_status === 'FAIL').length
        const count  = monthInspections.length
        const pct    = Math.round((count / totalUnits) * 100)
        const isOpen = openMonth === monthKey

        return (
          <div key={monthKey} className="card" style={{overflow:'hidden'}}>
            <div
              onClick={() => setOpenMonth(isOpen ? null : monthKey)}
              style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',transition:'background 0.15s',background:isOpen?'rgba(255,255,255,0.03)':undefined}}
            >
              <div style={{fontSize:22,flexShrink:0}}>{isOpen ? '📂' : '📁'}</div>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:15,marginBottom:3}}>{monthLabel}</p>
                <p style={{fontFamily:'DM Mono, monospace',fontSize:11,color:'var(--sub)'}}>
                  {count} inspection{count !== 1 ? 's' : ''} · {passes} passed · {fails} failed
                </p>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{
                  display:'inline-flex',alignItems:'center',gap:6,
                  background: pct === 100 ? 'rgba(46,196,182,0.1)' : 'rgba(244,162,97,0.1)',
                  border: `1px solid ${pct === 100 ? 'rgba(46,196,182,0.3)' : 'rgba(244,162,97,0.3)'}`,
                  borderRadius:8,padding:'4px 10px',
                }}>
                  <div style={{width:7,height:7,borderRadius:'50%',background: pct === 100 ? 'var(--green)' : 'var(--accent)'}} />
                  <span style={{fontFamily:'DM Mono, monospace',fontSize:11,fontWeight:500,color: pct === 100 ? 'var(--green)' : 'var(--accent)'}}>
                    {count} / {totalUnits} ({pct}%)
                  </span>
                </div>
                <div style={{marginTop:6,width:120,height:3,background:'rgba(255,255,255,0.08)',borderRadius:2}}>
                  <div style={{width:`${pct}%`,height:'100%',borderRadius:2,background: pct === 100 ? 'var(--green)' : 'var(--accent)',transition:'width 0.4s ease'}} />
                </div>
              </div>
              <div style={{color:'var(--sub)',fontSize:12,flexShrink:0,marginLeft:8}}>{isOpen ? '▲' : '▼'}</div>
            </div>

            {isOpen && (
              <div style={{borderTop:'1px solid var(--border)'}}>
                <div style={{padding:'12px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <p style={{fontFamily:'DM Mono, monospace',fontSize:11,color:'var(--sub)'}}>
                    {monthLabel} — {count} report{count !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={async () => {
                      setDownloading(monthKey)
                      await downloadAllPdfs(monthInspections, monthLabel)
                      setDownloading(null)
                    }}
                    disabled={downloading === monthKey}
                    className="btn btn-ghost"
                    style={{fontSize:12,padding:'6px 14px',opacity:downloading===monthKey?0.6:1}}
                  >
                    {downloading === monthKey ? '⏳ Downloading...' : `⬇ Download All PDFs (${count})`}
                  </button>
                </div>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{borderBottom:'1px solid var(--border)'}}>
                      {['Date','Serial','Location','Inspector','Status','PDF',''].map(h => (
                        <th key={h} style={{padding:'10px 16px',textAlign:'left',fontFamily:'DM Mono, monospace',fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--sub)',fontWeight:500}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthInspections.map((insp, idx) => (
                      <tr key={insp.id} style={{borderBottom:idx < monthInspections.length-1?'1px solid var(--border)':'none'}}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background='')}
                      >
                        <td style={{padding:'11px 16px',fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--sub)'}}>{insp.inspected_at}</td>
                        <td style={{padding:'11px 16px',fontFamily:'DM Mono, monospace',fontSize:12,color:'var(--accent)'}}>{insp.serial}</td>
                        <td style={{padding:'11px 16px',fontSize:13,maxWidth:180}}><span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{insp.location}</span></td>
                        <td style={{padding:'11px 16px',fontSize:13}}>{insp.inspector_name}</td>
                        <td style={{padding:'11px 16px'}}><StatusBadge status={insp.overall_status} /></td>
                        <td style={{padding:'11px 16px'}}>
                          <button onClick={() => generateInspectionPdf(insp)} className="tag tag-sub" style={{cursor:'pointer',border:'none',background:'rgba(255,255,255,0.04)',display:'inline-flex',alignItems:'center',gap:4}}>
                            ⬇ PDF
                          </button>
                        </td>
                        <td style={{padding:'11px 16px'}}>
                          <Link href={`/reports/${insp.id}`} className="tag tag-sub">View →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
