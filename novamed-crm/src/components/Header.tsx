import { Bell, Menu, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Appointment, Period, Theme } from '../types'
import { PatientCell } from './PatientCell'
import { PeriodSelector } from './PeriodSelector'
import { StatusBadge } from './StatusBadge'
import { ThemeToggle } from './ThemeToggle'

interface Props { period: Period; onPeriodChange: (period: Period) => void; search: string; onSearch: (value: string) => void; suggestions: Appointment[]; onSuggestionSelect: (appointment: Appointment, element: HTMLButtonElement) => void; onMenu: () => void; onNotifications: () => void; notificationOpen: boolean; onProfile: () => void; profileOpen: boolean; theme: Theme; onThemeChange: (theme: Theme) => void }

export function Header({ period, onPeriodChange, search, onSearch, suggestions, onSuggestionSelect, onMenu, onNotifications, notificationOpen, onProfile, profileOpen, theme, onThemeChange }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const showSuggestions = searchOpen && search.trim().length > 0
  useEffect(() => { if (mobileSearchOpen) searchInputRef.current?.focus() }, [mobileSearchOpen])
  const closeSearch = () => { setSearchOpen(false); setMobileSearchOpen(false) }
  return <header className="header header--compact">
    <button className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Открыть меню"><Menu size={21} /></button>
    <div className="header-page-title"><h1>Обзор клиники</h1><span>Рабочий экран администратора</span></div>
    <div className={`search-wrap ${mobileSearchOpen ? 'is-mobile-open' : ''}`} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeSearch() }}><label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Поиск пациента</span><input ref={searchInputRef} value={search} onChange={(event) => { onSearch(event.target.value); setSearchOpen(true) }} onFocus={() => setSearchOpen(true)} onKeyDown={(event) => { if (event.key === 'Escape') closeSearch() }} placeholder="Найти пациента" aria-expanded={showSuggestions} aria-controls="patient-search-suggestions" autoComplete="off" /></label>{showSuggestions && <div className="search-suggestions" id="patient-search-suggestions" aria-label="Результаты поиска пациентов"><div className="search-suggestions-head"><span>Пациент</span><span>Запись</span></div>{suggestions.length ? suggestions.slice(0, 5).map((appointment) => <button key={appointment.id} className="search-suggestion" onClick={(event) => { closeSearch(); onSuggestionSelect(appointment, event.currentTarget) }}><PatientCell appointment={appointment} size={30} /><span className="suggestion-meta"><strong>{appointment.time}</strong><small>{appointment.doctor}</small></span><StatusBadge status={appointment.status} /></button>) : <div className="search-suggestions-empty"><strong>Ничего не найдено</strong><span>Попробуйте изменить запрос</span></div>}</div>}</div>
    <div className="header-actions">
      <div className="header-right-tools"><PeriodSelector value={period} onChange={onPeriodChange} /><ThemeToggle theme={theme} onChange={onThemeChange} /></div>
      <button className={`icon-button mobile-search-trigger ${mobileSearchOpen ? 'is-active' : ''}`} onClick={() => setMobileSearchOpen((value) => !value)} aria-label={mobileSearchOpen ? 'Закрыть поиск' : 'Открыть поиск'} aria-expanded={mobileSearchOpen}><Search size={19} /></button>
      <button className={`icon-button notification-button ${notificationOpen ? 'is-active' : ''}`} onClick={onNotifications} aria-label="Уведомления, 2 новых" aria-expanded={notificationOpen}><Bell size={19} /><span>2</span></button>
      <button className={`profile-button ${profileOpen ? 'is-active' : ''}`} onClick={onProfile} aria-label="Открыть профиль Марины Волковой" aria-expanded={profileOpen}><span className="profile-avatar">МВ</span><span className="profile-copy"><strong>Марина Волкова</strong><small>Администратор</small></span></button>
    </div>{mobileSearchOpen && <button className="mobile-search-overlay" onClick={closeSearch} aria-label="Закрыть поиск по клику вне поля" />}
  </header>
}
