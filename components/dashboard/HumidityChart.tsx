'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'

interface HumidityChartProps {
  data: { time: string; [zone: string]: string | number }[]
  zones: string[]
}

const COLORS = ['#3b82f6', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#ec4899']

export function HumidityChart({ data, zones }: HumidityChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: 13 }}>
        Pas encore de données historiques
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 16, left: -16, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
        <YAxis
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: 10, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          formatter={(value: number) => [`${value}%`, '']}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Min', fontSize: 9, fill: '#f59e0b' }} />
        <ReferenceLine y={70} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: 'Max', fontSize: 9, fill: '#3b82f6' }} />
        {zones.map((zone, i) => (
          <Line
            key={zone}
            type="monotone"
            dataKey={zone}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}