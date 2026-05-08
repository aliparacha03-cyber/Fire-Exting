import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const all = []
  let from = 0
  const step = 50

  while (true) {
    const { data, error } = await supabase
      .from('extinguishers')
      .select('*')
      .order('created_at')
      .range(from, from + step - 1)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < step) break
    from += step
  }

  return NextResponse.json({ extinguishers: all })
}
