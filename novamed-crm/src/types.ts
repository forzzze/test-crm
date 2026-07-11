export type Period = 'day' | 'week' | 'month'
export type AppointmentStatus = 'confirmed' | 'waiting' | 'arrived' | 'cancelled'

export interface Metric { id: string; label: string; value: string; delta: string; direction: 'up' | 'down' | 'neutral'; icon: 'calendar' | 'patients' | 'doctors' | 'revenue' }
export interface VisitPoint { label: string; value: number }
export interface PeriodData { metrics: Metric[]; visits: VisitPoint[]; visitsLabel: string; average: number }
export interface Appointment { id: number; time: string; patient: string; patientId: string; avatar?: string; service: string; doctor: string; status: AppointmentStatus; phone: string; note: string }
export interface AppointmentPeriodData { title: string; subtitle: string; items: Appointment[] }
export interface Department { name: string; value: number; color: string }
export interface DepartmentPeriodData { total: number; subtitle: string; items: Department[] }
export interface Doctor { name: string; specialty: string; appointments: number; load: number; initials: string; tone: string }
export interface DoctorPeriodData { subtitle: string; items: Doctor[] }
