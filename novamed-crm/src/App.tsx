import { CalendarClock, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { AppointmentDrawer } from './components/AppointmentDrawer'
import { AppointmentMobileList } from './components/AppointmentMobileList'
import { AppointmentsTable } from './components/AppointmentsTable'
import { DepartmentChart } from './components/DepartmentChart'
import { DoctorsLoad } from './components/DoctorsLoad'
import { Header } from './components/Header'
import { MetricCard } from './components/MetricCard'
import { MobileNavigation } from './components/MobileNavigation'
import { NotificationsPanel } from './components/NotificationsPanel'
import { VisitsChart } from './components/VisitsChart'
import { appointmentPeriodData, periodData } from './data/mockData'
import type { Appointment, Period } from './types'

const reminders: Record<Period, { label: string; time: string; detail: string }> = {
  day: { label: 'Ближайшее окно', time: 'Сегодня, 13:30–14:00', detail: 'Кабинет УЗИ · Елена Соколова' },
  week: { label: 'Свободные окна за неделю', time: '6 доступных интервалов', detail: 'Больше всего — в четверг' },
  month: { label: 'Резерв на месяц', time: '28 доступных интервалов', detail: 'Средняя заполняемость — 86%' },
}

export function App() {
  const [activeNav, setActiveNav] = useState('Обзор')
  const [period, setPeriod] = useState<Period>('week')
  const [search, setSearch] = useState('')
  const [drawer, setDrawer] = useState<Appointment | null>(null)
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeDrawer = useCallback(() => setDrawer(null), [])
  const current = periodData[period]
  const doctorMetric = periodData.day.metrics.find((metric) => metric.id === 'doctors')!
  const metricsForLayout = period === 'day' ? current.metrics : [current.metrics[0], current.metrics[1], doctorMetric, current.metrics[2]]
  const currentAppointments = appointmentPeriodData[period]
  const reminder = reminders[period]
  const searchResults = useMemo(() => currentAppointments.items.filter((appointment) => appointment.patient.toLowerCase().includes(search.trim().toLowerCase())), [currentAppointments, search])

  const showToast = (message: string, duration = 2400) => {
    setToast(message)
    window.setTimeout(() => setToast(null), duration)
  }

  const navigate = (label: string) => {
    setActiveNav(label)
    setMenuOpen(false)
    if (label !== 'Обзор') showToast(`${label}: раздел появится в следующей версии`, 2800)
  }

  const openAppointment = (appointment: Appointment, element: HTMLButtonElement) => {
    setReturnFocus(element)
    setDrawer(appointment)
  }

  return <AppShell active={activeNav} onNavigate={navigate}>
    <Header period={period} onPeriodChange={setPeriod} search={search} onSearch={setSearch} suggestions={searchResults} onSuggestionSelect={openAppointment} onMenu={() => setMenuOpen(true)} notificationOpen={notificationsOpen} onNotifications={() => setNotificationsOpen((value) => !value)} />
    <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    <main className="dashboard">
      <section className={`metrics-grid metrics-grid--${current.metrics.length}`} aria-label="Ключевые показатели">{metricsForLayout.map((metric) => <MetricCard key={metric.id} metric={metric} collapsed={period !== 'day' && metric.id === 'doctors'} />)}</section>
      <section className="analytics-grid"><VisitsChart data={current.visits} label={current.visitsLabel} average={current.average} /><DepartmentChart period={period} /></section>
      <section className="lower-grid">
        <section className="surface appointments-card">
          <div className="section-heading"><div><h2>{currentAppointments.title}</h2><p>{currentAppointments.subtitle}</p></div><button className="text-button" onClick={() => { setSearch(''); showToast(`Показаны все записи: ${currentAppointments.title.toLowerCase()}`) }}>Все записи</button></div>
          <AppointmentsTable appointments={currentAppointments.items} onSelect={openAppointment} /><AppointmentMobileList appointments={currentAppointments.items} onSelect={openAppointment} />
        </section>
        <div className="right-column">
          <DoctorsLoad period={period} />
          <section className="reminder-card"><span className="reminder-icon"><CalendarClock size={18} /></span><div><span>{reminder.label}</span><strong>{reminder.time}</strong><small>{reminder.detail}</small></div><button onClick={() => showToast('Данные добавлены в список для обзвона')}>Заполнить окно</button></section>
        </div>
      </section>
    </main>
    <MobileNavigation open={menuOpen} active={activeNav} onNavigate={navigate} onClose={closeMenu} />
    <AppointmentDrawer appointment={drawer} onClose={closeDrawer} returnFocus={returnFocus} />
    {toast && <div className="toast" role="status"><span>{toast}</span><button onClick={() => setToast(null)} aria-label="Закрыть уведомление"><X size={16} /></button></div>}
  </AppShell>
}
