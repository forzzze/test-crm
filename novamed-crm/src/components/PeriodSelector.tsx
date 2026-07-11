import type { Period } from '../types'

const labels: Record<Period, string> = { day: 'День', week: 'Неделя', month: 'Месяц' }
export function PeriodSelector({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  return <div className="period-selector" role="group" aria-label="Период статистики">{(Object.keys(labels) as Period[]).map((period) => <button key={period} className={value === period ? 'is-active' : ''} aria-pressed={value === period} onClick={() => onChange(period)}>{labels[period]}</button>)}</div>
}
