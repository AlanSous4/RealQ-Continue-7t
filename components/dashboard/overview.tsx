"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "01/05",
    total: 12,
  },
  {
    name: "05/05",
    total: 18,
  },
  {
    name: "10/05",
    total: 8,
  },
  {
    name: "15/05",
    total: 15,
  },
  {
    name: "20/05",
    total: 10,
  },
  {
    name: "25/05",
    total: 22,
  },
  {
    name: "30/05",
    total: 16,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
