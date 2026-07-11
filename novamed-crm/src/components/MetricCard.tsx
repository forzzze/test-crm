import { CalendarCheck2, Stethoscope, UserRoundPlus, WalletCards } from 'lucide-react'
import type { Metric } from '../types'
const icons = { calendar: CalendarCheck2, patients: UserRoundPlus, doctors: Stethoscope, revenue: WalletCards }
export function MetricCard({ metric }: { metric: Metric }) { const Icon = icons[metric.icon]; return <article className="metric-card"><div className="metric-top"><span>{metric.label}</span><span className={`metric-icon metric-icon--${metric.icon}`}><Icon size={17} strokeWidth={1.8} /></span></div><div className="metric-bottom"><strong>{metric.value}</strong><span className={`delta delta--${metric.direction}`}>{metric.direction === 'up' ? '↗' : metric.direction === 'down' ? '↘' : '—'} {metric.delta}</span></div></article> }
