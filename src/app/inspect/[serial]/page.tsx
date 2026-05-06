import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Nav from '@/components/Nav'
import InspectionForm from './InspectionForm'
import AuthGuard from '@/components/AuthGuard'

export const revalidate = 0

export default async function InspectPage({ params }: { params: { serial: string } }) {
  const { data: ext, error } = await supabase.from('extinguishers').select('*').eq('serial', params.serial).single()
  if (error || !ext) notFound()
  const { data: lastInspection } = await supabase.from('inspections').select('inspected_at, overall_status, inspector_name').eq('serial', params.serial).order('created_at', { ascending: false }).limit(1).single()
  return (
    <AuthGuard>
      <Nav />
      <InspectionForm extinguisher={ext} lastInspection={lastInspection ?? null} />
    </AuthGuard>
  )
}
