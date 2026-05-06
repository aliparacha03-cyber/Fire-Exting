import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CHECKS } from '@/types'
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serial, location, device, inspector_name, inspected_at, checks, remarks } = body
    if (!serial || !inspector_name || !inspected_at || !checks)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    const total = CHECKS.length
    const done  = Object.keys(checks).length
    const fails = Object.values(checks).filter((v) => v === 'fail').length
    const status = fails > 0 ? 'FAIL' : done === total ? 'PASS' : 'INCOMPLETE'
    const { data: ext } = await supabase.from('extinguishers').select('id').eq('serial', serial).single()
    const { data, error } = await supabase.from('inspections').insert({
      extinguisher_id: ext?.id ?? null, serial, location, device,
      inspector_name, inspected_at, overall_status: status, checks, remarks: remarks || null,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ inspection: data }, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
export async function GET() {
  const { data, error } = await supabase.from('inspections').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inspections: data })
}
