import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import AuthGuard from '@/components/AuthGuard'
import ReportDetail from './ReportDetail'
import type { Inspection } from '@/types'

export const revalidate = 0

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const { data: insp, error } = await supabase.from('inspections').select('*').eq('id', params.id).single()
  if (error || !insp) notFound()
  return (
    <AuthGuard>
      <Nav />
      <ReportDetail report={insp as Inspection} />
    </AuthGuard>
  )
}
