import type { Appointment } from '../types'
import { Avatar } from './Avatar'

export function PatientCell({ appointment, size = 36 }: { appointment: Appointment; size?: number }) {
  return <span className="patient-cell"><Avatar name={appointment.patient} src={appointment.avatar} size={size} className="patient-avatar" /><span className="patient-copy"><strong>{appointment.patient}</strong><small>ID {appointment.patientId}</small></span></span>
}
