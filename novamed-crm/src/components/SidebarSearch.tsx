import { Search, X } from 'lucide-react'
import { useState } from 'react'
import type { Appointment } from '../types'
import { PatientCell } from './PatientCell'
import { StatusBadge } from './StatusBadge'

interface Props { search: string; onSearch: (value: string) => void; suggestions: Appointment[]; onSelect: (appointment: Appointment, element: HTMLButtonElement) => void }

export function SidebarSearch({ search, onSearch, suggestions, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  return <div className="sidebar-tool-wrap" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <button className={`sidebar-tool ${open ? 'is-active' : ''}`} onClick={() => setOpen((value) => !value)} aria-label="Поиск пациента" aria-expanded={open}><Search size={16} /></button>
    {open && <div className="sidebar-search-panel">
      <label className="sidebar-search-input"><Search size={16} /><input autoFocus value={search} onChange={(event) => onSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }} placeholder="Найти пациента" aria-label="Поиск пациента" /><button type="button" onClick={() => { onSearch(''); setOpen(false) }} aria-label="Закрыть поиск"><X size={15} /></button></label>
      {search.trim() && <div className="sidebar-search-results">{suggestions.length ? suggestions.slice(0, 5).map((appointment) => <button key={appointment.id} className="sidebar-search-result" onClick={(event) => { setOpen(false); onSelect(appointment, event.currentTarget) }}><PatientCell appointment={appointment} size={30} /><span><strong>{appointment.time}</strong><small>{appointment.doctor}</small></span><StatusBadge status={appointment.status} /></button>) : <div className="search-suggestions-empty"><strong>Ничего не найдено</strong><span>Попробуйте изменить запрос</span></div>}</div>}
    </div>}
  </div>
}
