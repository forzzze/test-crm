import { BarChart3, CalendarDays, CircleHelp, LayoutDashboard, LogOut, Settings, Stethoscope, UsersRound, X } from 'lucide-react'

const navItems = [
  { label: 'Обзор', icon: LayoutDashboard }, { label: 'Записи', icon: CalendarDays }, { label: 'Пациенты', icon: UsersRound }, { label: 'Врачи', icon: Stethoscope }, { label: 'Аналитика', icon: BarChart3 }, { label: 'Настройки', icon: Settings },
]

interface SidebarProps { active: string; onNavigate: (label: string) => void; mobile?: boolean; onClose?: () => void }
export function Sidebar({ active, onNavigate, mobile = false, onClose }: SidebarProps) {
  return <aside className={`sidebar ${mobile ? 'sidebar--mobile' : ''}`} aria-label="Основная навигация">
    <div className="brand-row"><div className="brand-mark" aria-hidden="true"><span /><span /></div><div className="brand-copy"><strong>NovaMed</strong><small>clinic system</small></div>{mobile && <button className="icon-button sidebar-close" onClick={onClose} aria-label="Закрыть меню"><X size={20} /></button>}</div>
    <nav><p className="nav-caption">Рабочее пространство</p>{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => onNavigate(label)} className={`nav-item ${active === label ? 'is-active' : ''}`} aria-current={active === label ? 'page' : undefined}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{active === label && <span className="active-line" />}</button>)}</nav>
    <div className="sidebar-footer"><button className="nav-item"><CircleHelp size={18} /><span>Центр помощи</span></button><button className="nav-item nav-item--logout"><LogOut size={18} /><span>Выйти</span></button><div className="system-status"><span /><div><strong>Система работает</strong><small>Все сервисы доступны</small></div></div></div>
  </aside>
}
