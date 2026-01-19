"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TimeSpentData {
  day: string
  applications: number
  interviews: number
  resumeBuilding: number
  training: number
  total: number
}

interface TimeSpentChartProps {
  data?: TimeSpentData[]
  onPeriodChange?: (period: 'last-week' | 'this-week' | 'last-month') => void
}

const COLORS = {
  applications: "#EF4444", // Red - matches Linglee Vocabulary
  interviews: "#1E3A8A", // Dark Blue - matches Linglee Grammar
  resumeBuilding: "#60A5FA", // Light Blue - matches Linglee Listening
  training: "#9CA3AF", // Grey - matches Linglee Writing
}

export function TimeSpentChart({ data = [], onPeriodChange }: TimeSpentChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"last-week" | "this-week" | "last-month">("last-week")

  const handlePeriodChange = (value: "last-week" | "this-week" | "last-month") => {
    setSelectedPeriod(value)
    onPeriodChange?.(value)
  }

  // Default mock data matching Linglee style
  const defaultData: TimeSpentData[] = [
    { day: "Mon", applications: 45, interviews: 30, resumeBuilding: 20, training: 15, total: 110 },
    { day: "Tue", applications: 60, interviews: 40, resumeBuilding: 25, training: 20, total: 145 },
    { day: "Wed", applications: 50, interviews: 35, resumeBuilding: 30, training: 25, total: 140 },
    { day: "Thu", applications: 70, interviews: 45, resumeBuilding: 35, training: 30, total: 180 },
    { day: "Fri", applications: 55, interviews: 40, resumeBuilding: 40, training: 20, total: 155 },
    { day: "Sat", applications: 40, interviews: 25, resumeBuilding: 15, training: 10, total: 90 },
    { day: "Sun", applications: 30, interviews: 20, resumeBuilding: 10, training: 5, total: 65 },
  ]

  const chartData = data.length > 0 ? data : defaultData

  return (
    <Card className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-900">Time spent on learning</h3>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-28 h-7 text-xs border-gray-200 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">Last week</SelectItem>
            <SelectItem value="this-week">This week</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            barCategoryGap="25%"
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="transparent"
              tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis 
              stroke="transparent"
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={35}
              tickMargin={5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              formatter={(value: number, name: string) => {
                const categoryNames: { [key: string]: string } = {
                  applications: 'Applications',
                  interviews: 'Interviews',
                  resumeBuilding: 'Resume Building',
                  training: 'Training'
                }
                return [`${value} min`, categoryNames[name] || name]
              }}
              labelStyle={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}
            />
            <Bar 
              dataKey="applications" 
              stackId="a" 
              fill={COLORS.applications}
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="interviews" 
              stackId="a" 
              fill={COLORS.interviews}
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="resumeBuilding" 
              stackId="a" 
              fill={COLORS.resumeBuilding}
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="training" 
              stackId="a" 
              fill={COLORS.training}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 flex-wrap pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.applications }}></div>
          <span className="text-xs text-gray-600 font-medium">Applications</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.interviews }}></div>
          <span className="text-xs text-gray-600 font-medium">Interviews</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.resumeBuilding }}></div>
          <span className="text-xs text-gray-600 font-medium">Resume Building</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.training }}></div>
          <span className="text-xs text-gray-600 font-medium">Training</span>
        </div>
      </div>
    </Card>
  )
}

