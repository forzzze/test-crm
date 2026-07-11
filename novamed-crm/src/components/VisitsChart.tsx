import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { VisitPoint } from '../types'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return <div className="chart-tooltip"><small>{label}</small><strong>{payload[0].value} посещений</strong></div>
}

export function VisitsChart({ data, label, average }: { data: VisitPoint[]; label: string; average: number }) {
  const maximum = Math.max(...data.map((point) => point.value))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return <section className="surface visits-card">
    <div className="section-heading">
      <div><h2>{label}</h2><p>Динамика записей за выбранный период</p></div>
      <div className="chart-summary"><span>В среднем</span><strong>{average.toLocaleString('ru-RU')} <small>в день</small></strong></div>
    </div>
    <div className="visits-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart key={label} data={data} margin={{ top: 17, right: 8, left: -24, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid vertical={false} stroke="#EEF1F4" strokeDasharray="3 4" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#74808B', fontSize: 11 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A959E', fontSize: 10 }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(53,104,232,.035)' }} />
          <Bar dataKey="value" radius={[6, 6, 2, 2]} maxBarSize={70} isAnimationActive={!reduceMotion} animationBegin={0} animationDuration={520} animationEasing="ease-out">
            {data.map((point) => <Cell key={`${label}-${point.label}`} fill={point.value === maximum ? '#3568E8' : '#E3E7EC'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
}
