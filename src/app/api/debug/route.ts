import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error, count } = await supabase
    .from('extinguishers')
    .select('*', { count: 'exact' })
    .range(0, 999)

  return NextResponse.json({
    count,
    returned: data?.length,
    error: error?.message,
    first: data?.[0],
    last: data?.[data?.length - 1]
  })
}
