import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { doctorPeriodData } from '../data/mockData'
import type { Period } from '../types'

export function DoctorsLoad({ period }: { period: Period }) {
  const data = doctorPeriodData[period]
  const [expanded, setExpanded] = useState(true)

  return <section className={`surface doctors-card ${expanded ? '' : 'is-collapsed'}`}>
    <div className="section-heading"><div><h2>Загрузка врачей</h2><p>{data.subtitle}</p></div><div className="section-actions"><button className="text-button">Все врачи</button><button className="collapse-button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-controls="doctors-load-content">{expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}<span>{expanded ? 'Свернуть' : 'Развернуть'}</span></button></div></div>
    <div className="doctors-collapse" id="doctors-load-content" aria-hidden={!expanded} inert={!expanded}><div><div className="doctors-list">{data.items.map((doctor) => <div className="doctor-row" key={doctor.name}>
        <span className="doctor-avatar" style={{ background: doctor.tone }}>{doctor.initials}</span>
        <div className="doctor-info"><div><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div><span>{doctor.appointments} записей</span><div className="progress-meta"><div className="progress"><i style={{ width: `${doctor.load}%` }} /></div><b>{doctor.load}%</b></div></div>
      </div>)}</div></div></div>
  </section>
}
