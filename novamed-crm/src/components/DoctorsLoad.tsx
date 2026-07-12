import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { doctorPeriodData } from '../data/mockData'
import type { Period } from '../types'

export function DoctorsLoad({ period }: { period: Period }) {
  const data = doctorPeriodData[period]
  const [expanded, setExpanded] = useState(() => !window.matchMedia('(max-width: 560px)').matches)
  const [showAll, setShowAll] = useState(false)
  const visibleDoctors = showAll ? data.items : data.items.slice(0, 3)

  return <section className={`surface doctors-card ${expanded ? '' : 'is-collapsed'}`}>
    <div className="section-heading"><div><h2>Загрузка врачей</h2><p>{data.subtitle}</p></div><button className="collapse-button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls="doctors-load-content">{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}<span>{expanded ? 'Свернуть' : 'Развернуть'}</span></button></div>
    <div className="doctors-collapse" id="doctors-load-content" aria-hidden={!expanded} inert={!expanded}><div><div className="doctors-list">{visibleDoctors.map((doctor) => <div className="doctor-row" key={doctor.name}>
        <span className="doctor-avatar" style={{ background: doctor.tone }}>{doctor.initials}</span>
        <div className="doctor-info"><div><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div><span>{doctor.appointments} записей</span><div className="progress-meta"><div className="progress"><i style={{ width: `${doctor.load}%` }} /></div><b>{doctor.load}%</b></div></div>
      </div>)}{data.items.length > 3 && <button className="doctors-show-all" type="button" onClick={() => setShowAll((value) => !value)} aria-expanded={showAll}>{showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}<span>{showAll ? 'Скрыть полный список' : `Показать всех врачей (${data.items.length})`}</span></button>}</div></div></div>
  </section>
}
