import type { Inspection } from '@/types'
import { CHECKS, GROUP_LABELS } from '@/types'

export async function generateInspectionPdf(report: Inspection) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageW = 210
  const margin = 20
  const contentW = pageW - margin * 2
  let y = 20

  const checks = report.checks as Record<string, string>
  const total  = CHECKS.length
  const done   = Object.keys(checks).length
  const fails  = Object.values(checks).filter(v => v === 'fail').length
  const passes = Object.values(checks).filter(v => v === 'pass').length

  doc.setFillColor(230, 57, 70)
  doc.rect(0, 0, pageW, 14, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('FIRE EXTINGUISHER INSPECTION REPORT', margin, 9)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Pet Valu — 10750 Highway 50, Brampton, ON', pageW - margin, 9, { align: 'right' })

  y = 24

  const statusColor: [number, number, number] = report.overall_status === 'PASS'
    ? [46, 196, 182] : report.overall_status === 'FAIL'
    ? [230, 57, 70] : [244, 162, 97]

  doc.setFillColor(...statusColor)
  doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(report.overall_status, margin + 6, y + 9)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`${passes} passed · ${fails} failed · ${total - done} skipped`, pageW - margin - 4, y + 9, { align: 'right' })

  y += 20

  doc.setTextColor(30, 30, 30)
  const infoFields = [
    ['Serial Number', report.serial],
    ['Location', report.location],
    ['Device Type', report.device],
    ['Inspected By', report.inspector_name],
    ['Date', report.inspected_at],
    ['Report ID', report.id.slice(0, 8) + '…'],
  ]

  const colW = contentW / 2
  infoFields.forEach((field, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = margin + col * colW
    const fy = y + row * 14
    doc.setFillColor(248, 248, 250)
    doc.roundedRect(x, fy, colW - 3, 12, 1, 1, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(130, 130, 160)
    doc.text(field[0].toUpperCase(), x + 4, fy + 4.5)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    const val = field[1].length > 35 ? field[1].slice(0, 35) + '…' : field[1]
    doc.text(val, x + 4, fy + 9.5)
  })

  y += Math.ceil(infoFields.length / 2) * 14 + 8

  const groups = ['visual', 'physical', 'access'] as const
  for (const group of groups) {
    const items = CHECKS.filter(c => c.group === group)
    doc.setFillColor(26, 26, 46)
    doc.rect(margin, y, contentW, 8, 'F')
    doc.setTextColor(244, 162, 97)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(GROUP_LABELS[group].toUpperCase(), margin + 4, y + 5.5)
    y += 10

    for (const item of items) {
      const ans = checks[item.key]
      const isFail = ans === 'fail'
      const isPass = ans === 'pass'
      doc.setFillColor(isFail ? 255 : isPass ? 240 : 250, isFail ? 245 : isPass ? 252 : 250, isFail ? 245 : isPass ? 250 : 250)
      doc.rect(margin, y, contentW, 9, 'F')
      const pillColor: [number, number, number] = isPass ? [46, 196, 182] : isFail ? [230, 57, 70] : [180, 180, 190]
      doc.setFillColor(...pillColor)
      doc.roundedRect(margin + contentW - 22, y + 1.5, 18, 6, 1, 1, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(ans ? ans.toUpperCase() : 'N/A', margin + contentW - 13, y + 5.8, { align: 'center' })
      doc.setTextColor(isFail ? 180 : 60, 60, 60)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(item.text, margin + 4, y + 5.8)
      doc.setDrawColor(230, 230, 235)
      doc.line(margin, y + 9, margin + contentW, y + 9)
      y += 9
    }
    y += 6
  }

  if (report.remarks) {
    doc.setFillColor(248, 248, 250)
    doc.roundedRect(margin, y, contentW, 20, 2, 2, 'F')
    doc.setTextColor(130, 130, 160)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('REMARKS', margin + 4, y + 5)
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(report.remarks, contentW - 8)
    doc.text(lines, margin + 4, y + 11)
    y += 26
  }

  doc.setFillColor(245, 245, 248)
  doc.rect(0, 287, pageW, 10, 'F')
  doc.setTextColor(150, 150, 170)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated ${new Date().toLocaleString()} · Report ID: ${report.id}`, margin, 293)
  doc.text('FireInspect — Pet Valu', pageW - margin, 293, { align: 'right' })

  doc.save(`Inspection_${report.serial}_${report.inspected_at}.pdf`)
}
