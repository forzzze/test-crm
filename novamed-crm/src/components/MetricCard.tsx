import { Banknote, CalendarCheck2, Stethoscope, UserRoundPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Metric } from '../types'

const icons = { calendar: CalendarCheck2, patients: UserRoundPlus, doctors: Stethoscope, revenue: Banknote }

function parseMetricValue(value: string) {
  return Number(value.replace(/\s/g, '').replace('₽', '').replace(',', '.'))
}

function formatMetricValue(value: number, template: string) {
  if (template.includes('₽')) return `${Math.round(value).toLocaleString('ru-RU')} ₽`
  if (template.includes(',')) return value.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return Math.round(value).toLocaleString('ru-RU')
}

export function MetricCard({ metric, collapsed = false }: { metric: Metric; collapsed?: boolean }) {
  const Icon = icons[metric.icon]
  const numericValue = parseMetricValue(metric.value)
  const previousValue = useRef(numericValue)
  const [displayValue, setDisplayValue] = useState(metric.value)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = parseMetricValue(metric.value)
    previousValue.current = endValue

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || startValue === endValue) {
      setDisplayValue(metric.value)
      return
    }

    const duration = 480
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(formatMetricValue(startValue + (endValue - startValue) * eased, metric.value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [metric.value])

  return <article className={`metric-card ${collapsed ? 'metric-card--collapsed' : ''}`} aria-hidden={collapsed}>
    <div className="metric-top"><span>{metric.label}</span><span className={`metric-icon metric-icon--${metric.icon}`}><Icon size={18} strokeWidth={2.15} /></span></div>
    <div className="metric-bottom"><strong aria-label={metric.value}>{displayValue}</strong><span className={`delta delta--${metric.direction}`}>{metric.direction === 'up' ? '↗' : metric.direction === 'down' ? '↘' : '—'} {metric.delta}</span></div>
  </article>
}
