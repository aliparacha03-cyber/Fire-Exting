'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Extinguisher } from '@/types'

export default function QRGrid() {
  const [extinguishers, setExtinguishers] = useState<Extinguisher[]>([])
  const [qrUrls, setQrUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/extinguishers')
      .then(r => r.json())
      .then(data => {
        setExtinguishers(data.extinguishers ?? [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (extinguishers.length === 0) return
    let cancelled = false
    async function generateAll() {
      const QRCode = (await import('qrcode')).default
      const urls: Record<string, string> = {}
      for (const ext of extinguishers) {
        urls[ext.serial] = await QRCode.toDataURL(`${window.location.origin}/inspect/${ext.serial}`, {
          width: 200, margin: 2,
          color: { dark: '#1a1a2e', light: '#ffffff' },
          errorCorrectionLevel: 'M',
        })
      }
      if (!cancelled) setQrUrls(urls)
    }
    generateAll()
    return () => { cancelled = true }
  }, [extinguishers])

  if (loading) return (
    <main style={{maxWidth:1100,margin:'0 auto',padding:'36px 20px 60px'}}>
      <p style={{color:'var(--sub)',fontFamily:'DM Mono, monospace',fontSize:13}}>Loading extinguishers...</p>
    </main>
  )

  return (
    <main style={{maxWidth:1100,margin:'0 auto',padding:'36px 20px 60px'}}>
      <div style={{marginBottom:36}}>
        <p className="section-eyebrow">▸ Pet Valu — 10750 Highway 50, Brampton</p>
        <h1 style={{fontSize:'clamp(22px,4vw,32px)',fontWeight:800,letterSpacing:'-0.5px',lineHeight:1.1}}>
          Fire Extinguisher QR Sheet
        </h1>
        <p style={{color:'var(--sub)',fontFamily:'DM Mono, monospace',fontSize:13,marginTop:8}}>
          {extinguishers.length} units · Print and post each card near its unit
        </p>
      </div>
      <div style={{marginBottom:28}}>
        <button className="btn btn-ghost" onClick={() => window.print()} style={{fontSize:13}}>🖨️ Print QR Sheet</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))',gap:14}}>
        {extinguishers.map((ext) => (
          <Link key={ext.serial} href={`/inspect/${ext.serial}`} style={{textDecoration:'none'}}>
            <div className="card" style={{padding:16,textAlign:'center',cursor:'pointer'}}>
              <div className="tag tag-red" style={{marginBottom:8}}>SN: {ext.serial}</div>
              <p style={{fontSize:11,fontWeight:600,lineHeight:1.3,marginBottom:3}}>{ext.location}</p>
              <p style={{fontSize:10,color:'var(--sub)',fontFamily:'DM Mono, monospace',marginBottom:12}}>{ext.device}</p>
              {qrUrls[ext.serial]
                ? <img src={qrUrls[ext.serial]} alt={`QR ${ext.serial}`} style={{width:140,height:140,borderRadius:8,display:'block',margin:'0 auto 10px'}} />
                : <div style={{width:140,height:140,borderRadius:8,background:'rgba(255,255,255,0.04)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px',color:'var(--sub)',fontSize:11}}>loading…</div>
              }
              <p style={{fontFamily:'DM Mono, monospace',fontSize:10,color:'var(--sub)',letterSpacing:1,textTransform:'uppercase'}}>Scan to Inspect</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
