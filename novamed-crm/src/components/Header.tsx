import { Bell, Menu, Search } from 'lucide-react'
import { PeriodSelector } from './PeriodSelector'
import type { Period } from '../types'

interface Props { period: Period; onPeriodChange: (p: Period) => void; search: string; onSearch: (v: string) => void; onMenu: () => void; onNotifications: () => void; notificationOpen: boolean }
export function Header({ period, onPeriodChange, search, onSearch, onMenu, onNotifications, notificationOpen }: Props) {
  return <header className="header"><div className="header-title"><button className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Открыть меню"><Menu size={21} /></button><div><p>Суббота, 11 июля</p><h1>Обзор клиники</h1></div></div><div className="header-actions"><label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Поиск пациента</span><input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Найти пациента" /></label><PeriodSelector value={period} onChange={onPeriodChange} /><div className="notification-anchor"><button className={`icon-button notification-button ${notificationOpen ? 'is-active' : ''}`} onClick={onNotifications} aria-label="Уведомления, 2 новых" aria-expanded={notificationOpen}><Bell size={19} /><span>2</span></button></div><button className="profile-button" aria-label="Профиль Марины Волковой"><span className="profile-avatar">МВ</span><span className="profile-copy"><strong>Марина Волкова</strong><small>Администратор</small></span></button></div></header>
}
