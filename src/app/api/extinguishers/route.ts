import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabase
    .from('extinguishers')
    .select('*')
    .order('created_at')
    .range(0, 999)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ extinguishers: data })
}
