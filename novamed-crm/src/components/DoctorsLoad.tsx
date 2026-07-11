import { doctorPeriodData } from '../data/mockData'
import type { Period } from '../types'

export function DoctorsLoad({ period }: { period: Period }) {
  const data = doctorPeriodData[period]

  return <section className="surface doctors-card">
    <div className="section-heading"><div><h2>Загрузка врачей</h2><p>{data.subtitle}</p></div><button className="text-button">Все врачи</button></div>
    <div className="doctors-list">{data.items.map((doctor) => <div className="doctor-row" key={doctor.name}>
      <span className="doctor-avatar" style={{ background: doctor.tone }}>{doctor.initials}</span>
      <div className="doctor-info"><div><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div><span>{doctor.appointments} записей</span><div className="progress-meta"><div className="progress"><i style={{ width: `${doctor.load}%` }} /></div><b>{doctor.load}%</b></div></div>
    </div>)}</div>
  </section>
}
