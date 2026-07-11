import { ChevronRight, Clock3, Stethoscope } from 'lucide-react'
import type { Appointment } from '../types'
import { PatientCell } from './PatientCell'
import { StatusBadge } from './StatusBadge'
export function AppointmentMobileList({ appointments, onSelect }: { appointments: Appointment[]; onSelect: (a: Appointment, el: HTMLButtonElement) => void }) { return <div className="appointment-mobile-list">{appointments.map((a) => <button key={a.id} className="appointment-mobile-card" onClick={(e) => onSelect(a, e.currentTarget)}><span className="mobile-card-top"><PatientCell appointment={a} size={34} /><ChevronRight size={18} /></span><span className="mobile-card-service">{a.service}</span><span className="mobile-card-meta"><span><Clock3 size={14} />{a.time}</span><span><Stethoscope size={14} />{a.doctor}</span></span><StatusBadge status={a.status} /></button>)}</div> }
