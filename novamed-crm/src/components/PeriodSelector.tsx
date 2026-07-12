import type { Period } from '../types'

const labels: Record<Period, string> = { day: 'День', week: 'Неделя', month: 'Месяц' }
const shortLabels: Record<Period, string> = { day: 'Д', week: 'Н', month: 'М' }
export function PeriodSelector({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  return <div className="period-selector" role="group" aria-label="Период статистики">{(Object.keys(labels) as Period[]).map((period) => <button key={period} className={value === period ? 'is-active' : ''} aria-label={labels[period]} aria-pressed={value === period} onClick={() => onChange(period)}><span className="period-label-long">{labels[period]}</span><span className="period-label-short" aria-hidden="true">{shortLabels[period]}</span></button>)}</div>
}
