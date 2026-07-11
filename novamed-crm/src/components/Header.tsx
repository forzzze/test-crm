import { Bell, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import type { Appointment, Period } from '../types'
import { PeriodSelector } from './PeriodSelector'
import { StatusBadge } from './StatusBadge'

interface Props {
  period: Period
  onPeriodChange: (period: Period) => void
  search: string
  onSearch: (value: string) => void
  suggestions: Appointment[]
  onSuggestionSelect: (appointment: Appointment, element: HTMLButtonElement) => void
  onMenu: () => void
  onNotifications: () => void
  notificationOpen: boolean
}

export function Header({ period, onPeriodChange, search, onSearch, suggestions, onSuggestionSelect, onMenu, onNotifications, notificationOpen }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const showSuggestions = searchOpen && search.trim().length > 0

  return <header className="header">
    <div className="header-title"><button className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Открыть меню"><Menu size={21} /></button><div><p>Суббота, 11 июля</p><h1>Обзор клиники</h1></div></div>
    <div className="header-actions">
      <div className="search-wrap" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false) }}>
        <label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Поиск пациента</span><input value={search} onChange={(event) => { onSearch(event.target.value); setSearchOpen(true) }} onFocus={() => setSearchOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false) }} placeholder="Найти пациента" aria-expanded={showSuggestions} aria-controls="patient-search-suggestions" autoComplete="off" /></label>
        {showSuggestions && <div className="search-suggestions" id="patient-search-suggestions" aria-label="Результаты поиска пациентов">
          <div className="search-suggestions-head"><span>Пациент</span><span>Запись</span></div>
          {suggestions.length ? suggestions.slice(0, 5).map((appointment) => <button key={appointment.id} className="search-suggestion" onClick={(event) => { setSearchOpen(false); onSuggestionSelect(appointment, event.currentTarget) }}>
            <span className="suggestion-patient"><span className="mini-avatar">{appointment.patient.split(' ').map((name) => name[0]).join('')}</span><span><strong>{appointment.patient}</strong><small>{appointment.service}</small></span></span>
            <span className="suggestion-meta"><strong>{appointment.time}</strong><small>{appointment.doctor}</small></span>
            <StatusBadge status={appointment.status} />
          </button>) : <div className="search-suggestions-empty"><strong>Ничего не найдено</strong><span>Попробуйте изменить запрос</span></div>}
        </div>}
      </div>
      <PeriodSelector value={period} onChange={onPeriodChange} />
      <div className="notification-anchor"><button className={`icon-button notification-button ${notificationOpen ? 'is-active' : ''}`} onClick={onNotifications} aria-label="Уведомления, 2 новых" aria-expanded={notificationOpen}><Bell size={19} /><span>2</span></button></div>
      <button className="profile-button" aria-label="Профиль Марины Волковой"><span className="profile-avatar">МВ</span><span className="profile-copy"><strong>Марина Волкова</strong><small>Администратор</small></span></button>
    </div>
  </header>
}
