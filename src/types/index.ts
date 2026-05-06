export interface Extinguisher {
  id: string
  serial: string
  location: string
  device: string
  created_at: string
}
export interface Inspection {
  id: string
  extinguisher_id: string
  serial: string
  location: string
  device: string
  inspector_name: string
  inspected_at: string
  overall_status: 'PASS' | 'FAIL' | 'INCOMPLETE'
  checks: Record<string, 'pass' | 'fail'>
  remarks: string | null
  created_at: string
}
export interface CheckItem {
  key: string
  group: 'visual' | 'physical' | 'access'
  text: string
}
export const CHECKS: CheckItem[] = [
  { key: 'visual_0',   group: 'visual',   text: 'Pressure gauge is in the green/operable zone' },
  { key: 'visual_1',   group: 'visual',   text: 'Safety pin is in place and tamper seal is intact' },
  { key: 'visual_2',   group: 'visual',   text: 'Inspection tag / service label is attached and current' },
  { key: 'visual_3',   group: 'visual',   text: 'No visible corrosion, dents, or physical damage to cylinder' },
  { key: 'visual_4',   group: 'visual',   text: 'Nozzle / discharge horn is unobstructed and undamaged' },
  { key: 'physical_0', group: 'physical', text: 'Pull ring / handle is not bent or broken' },
  { key: 'physical_1', group: 'physical', text: 'Operating instructions are legible and facing outward' },
  { key: 'physical_2', group: 'physical', text: 'Hose / discharge hose is flexible, not cracked' },
  { key: 'physical_3', group: 'physical', text: 'Unit weight feels appropriate (not discharged / overloaded)' },
  { key: 'physical_4', group: 'physical', text: 'No powder leakage or chemical residue on exterior' },
  { key: 'access_0',   group: 'access',   text: 'Extinguisher is mounted securely on bracket / cabinet' },
  { key: 'access_1',   group: 'access',   text: 'Location is unobstructed — minimum 36 inch clearance' },
  { key: 'access_2',   group: 'access',   text: 'Extinguisher is clearly visible with signage' },
  { key: 'access_3',   group: 'access',   text: 'Location matches last recorded position in inspection log' },
]
export const GROUP_LABELS: Record<string, string> = {
  visual:   'Visual Inspection',
  physical: 'Physical Condition',
  access:   'Accessibility & Mounting',
}
