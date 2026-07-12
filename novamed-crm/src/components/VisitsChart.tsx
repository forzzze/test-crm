import { BarChart3, ChartSpline } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { VisitPoint } from '../types'

type ChartMode = 'bars' | 'line'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><small>{label}</small><strong>{payload[0].value} посещений</strong></div>
}

export function VisitsChart({ data, label }: { data: VisitPoint[]; label: string; average: number }) {
  const [mode, setMode] = useState<ChartMode>('bars')
  const maximum = Math.max(...data.map((point) => point.value))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.matchMedia('(max-width: 560px)').matches
  const nextMode = mode === 'bars' ? 'line' : 'bars'

  const axes = <>
    <CartesianGrid vertical={false} stroke="#EEF1F4" strokeDasharray="3 4" />
    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#74808B', fontSize: 11 }} dy={10} />
    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A959E', fontSize: 10 }} allowDecimals={false} />
    <Tooltip content={<CustomTooltip />} cursor={mode === 'bars' ? { fill: 'rgba(53,104,232,.035)' } : { stroke: '#AFC2F1', strokeDasharray: '4 4' }} />
  </>

  return <section className="surface visits-card">
    <div className="section-heading">
      <div><h2>{label}</h2><p>Динамика записей за выбранный период</p></div>
      <button className="chart-switch" type="button" onClick={() => setMode(nextMode)} aria-label={`Показать график: ${nextMode === 'line' ? 'линия' : 'столбцы'}`}>
        {nextMode === 'line' ? <ChartSpline size={16} /> : <BarChart3 size={16} />}
        <span>{nextMode === 'line' ? 'Линия' : 'Столбцы'}</span>
      </button>
    </div>
    <div className="visits-chart" data-chart-mode={mode}>
      <ResponsiveContainer width="100%" height="100%">
        {mode === 'bars' ? <BarChart key={`bars-${label}`} data={data} margin={{ top: 17, right: 8, left: -24, bottom: 0 }} barCategoryGap="18%" accessibilityLayer={false}>
          {axes}
          <Bar dataKey="value" radius={isMobile ? [6, 6, 3, 3] : [10, 10, 5, 5]} maxBarSize={70} isAnimationActive={!reduceMotion} animationBegin={0} animationDuration={520} animationEasing="ease-out">
            {data.map((point) => <Cell key={`${label}-${point.label}`} fill={point.value === maximum ? '#3568E8' : '#BCC5CD'} />)}
          </Bar>
        </BarChart> : <AreaChart key={`line-${label}`} data={data} margin={{ top: 17, right: 8, left: -24, bottom: 0 }} accessibilityLayer={false}>
          <defs><linearGradient id="visitsLineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3568E8" stopOpacity={0.18} /><stop offset="94%" stopColor="#3568E8" stopOpacity={0} /></linearGradient></defs>
          {axes}
          <Area type="monotone" dataKey="value" stroke="#3568E8" strokeWidth={2.5} fill="url(#visitsLineFill)" dot={{ r: 3, fill: '#fff', stroke: '#3568E8', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#fff', stroke: '#3568E8', strokeWidth: 2.5 }} isAnimationActive={!reduceMotion} animationDuration={520} animationEasing="ease-out" />
        </AreaChart>}
      </ResponsiveContainer>
    </div>
  </section>
}
