"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"

interface MonthlyTrendsChartProps {
  data?: Array<{ month: string; placements: number; internships: number }>
}

export function MonthlyTrendsChart({ data = [] }: MonthlyTrendsChartProps) {
  return (
    <Card className="bg-white border shadow-sm">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Placement Trends</h3>
          <p className="text-sm text-gray-500">Placement activity throughout the academic year.</p>
        </div>
        
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-1">No Monthly Trends</p>
            <p className="text-sm text-gray-500">No monthly placement activity data available for the selected year.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="placements" stroke="#3b82f6" strokeWidth={2} name="Placements" />
              <Line type="monotone" dataKey="internships" stroke="#10b981" strokeWidth={2} name="Internships" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}

