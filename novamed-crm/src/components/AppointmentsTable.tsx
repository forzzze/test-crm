import { ChevronRight } from 'lucide-react'
import type { Appointment } from '../types'
import { PatientCell } from './PatientCell'
import { StatusBadge } from './StatusBadge'
export function AppointmentsTable({ appointments, onSelect }: { appointments: Appointment[]; onSelect: (a: Appointment, el: HTMLButtonElement) => void }) { return <div className="appointments-table"><table><thead><tr><th>Время</th><th>Пациент</th><th>Услуга</th><th>Врач</th><th>Статус</th><th><span className="sr-only">Открыть</span></th></tr></thead><tbody>{appointments.map((a) => <tr key={a.id}><td><strong className="time">{a.time}</strong></td><td><PatientCell appointment={a} /></td><td>{a.service}</td><td>{a.doctor}</td><td><StatusBadge status={a.status} /></td><td><button className="row-action" onClick={(e) => onSelect(a, e.currentTarget)} aria-label={`Открыть запись пациента ${a.patient}`}><ChevronRight size={17} /></button></td></tr>)}</tbody></table></div> }
