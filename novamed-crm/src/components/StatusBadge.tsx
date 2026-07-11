import type { AppointmentStatus } from '../types'

const statusText: Record<AppointmentStatus, string> = { confirmed: 'Подтверждена', waiting: 'Ожидает', arrived: 'В клинике', cancelled: 'Отменена' }

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return <span className={`status status--${status}`}><span aria-hidden="true" />{statusText[status]}</span>
}
