import { CalendarClock, CircleAlert, X } from 'lucide-react'
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
import { appointments, periodData } from './data/mockData'
import type { Appointment, Period } from './types'

export function App() {
  const [activeNav, setActiveNav] = useState('Обзор'), [period, setPeriod] = useState<Period>('week'), [search, setSearch] = useState(''), [drawer, setDrawer] = useState<Appointment | null>(null), [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null), [menuOpen, setMenuOpen] = useState(false), [notificationsOpen, setNotificationsOpen] = useState(false), [toast, setToast] = useState<string | null>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), []), closeDrawer = useCallback(() => setDrawer(null), [])
  const filtered = useMemo(() => appointments.filter(a => a.patient.toLowerCase().includes(search.trim().toLowerCase())), [search])
  const navigate = (label: string) => { setActiveNav(label); setMenuOpen(false); if (label !== 'Обзор') { setToast(`${label}: раздел появится в следующей версии`); window.setTimeout(() => setToast(null), 2800) } }
  const openAppointment = (a: Appointment, el: HTMLButtonElement) => { setReturnFocus(el); setDrawer(a) }
  const current = periodData[period]
  return <AppShell active={activeNav} onNavigate={navigate}><Header period={period} onPeriodChange={setPeriod} search={search} onSearch={setSearch} onMenu={() => setMenuOpen(true)} notificationOpen={notificationsOpen} onNotifications={() => setNotificationsOpen(v => !v)} /><NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} /><main className="dashboard"><section className="metrics-grid" aria-label="Ключевые показатели">{current.metrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}</section><section className="analytics-grid"><VisitsChart data={current.visits} label={current.visitsLabel} average={current.average} /><DepartmentChart /></section><section className="lower-grid"><section className="surface appointments-card"><div className="section-heading"><div><h2>Записи на сегодня</h2><p>{filtered.length === appointments.length ? '5 ближайших визитов' : `Найдено: ${filtered.length}`}</p></div><button className="text-button" onClick={() => { setSearch(''); setToast('Показаны все записи на сегодня'); window.setTimeout(() => setToast(null), 2200) }}>Все записи</button></div>{filtered.length ? <><AppointmentsTable appointments={filtered} onSelect={openAppointment} /><AppointmentMobileList appointments={filtered} onSelect={openAppointment} /></> : <div className="empty-state"><CircleAlert size={22} /><strong>Пациент не найден</strong><span>Проверьте написание имени или очистите поиск.</span><button className="text-button" onClick={() => setSearch('')}>Очистить поиск</button></div>}</section><div className="right-column"><DoctorsLoad /><section className="reminder-card"><span className="reminder-icon"><CalendarClock size={18} /></span><div><span>Ближайшее окно</span><strong>Сегодня, 13:30–14:00</strong><small>Кабинет УЗИ · Елена Соколова</small></div><button onClick={() => { setToast('Окно добавлено в список для обзвона'); window.setTimeout(() => setToast(null), 2500) }}>Заполнить окно</button></section></div></section></main><MobileNavigation open={menuOpen} active={activeNav} onNavigate={navigate} onClose={closeMenu} /><AppointmentDrawer appointment={drawer} onClose={closeDrawer} returnFocus={returnFocus} />{toast && <div className="toast" role="status"><span>{toast}</span><button onClick={() => setToast(null)} aria-label="Закрыть уведомление"><X size={16} /></button></div>}</AppShell>
}
