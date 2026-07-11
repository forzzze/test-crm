import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { departmentPeriodData } from '../data/mockData'
import type { Period } from '../types'

export function DepartmentChart({ period }: { period: Period }) {
  const data = departmentPeriodData[period]
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return <section className="surface department-card">
    <div className="section-heading"><div><h2>Направления</h2><p>{data.subtitle}</p></div></div>
    <div className="department-content">
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie key={period} data={data.items} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={2} stroke="none" isAnimationActive={!reduceMotion} animationDuration={520} animationEasing="ease-out">
              {data.items.map((department) => <Cell key={department.name} fill={department.color} />)}
            </Pie>
            <Tooltip formatter={(value) => [`${Number(value ?? 0)}%`, 'Доля']} contentStyle={{ border: '1px solid #E4EAEE', borderRadius: 8, boxShadow: '0 5px 18px rgba(27,47,59,.08)', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center"><strong>{data.total.toLocaleString('ru-RU')}</strong><span>записей</span></div>
      </div>
      <ul className="legend">{data.items.map((department) => <li key={department.name}><span className="legend-label"><i style={{ background: department.color }} />{department.name}</span><strong>{department.value}%</strong></li>)}</ul>
    </div>
  </section>
}
