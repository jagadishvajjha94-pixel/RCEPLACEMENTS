"use client"

import { Card } from "@/components/ui/card"
import { Target } from "lucide-react"

interface SalaryRangeChartProps {
  data?: Array<{ range: string; count: number }>
}

export function SalaryRangeChart({ data = [] }: SalaryRangeChartProps) {
  return (
    <Card className="bg-white border shadow-sm">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Salary Range Distribution</h3>
          <p className="text-sm text-gray-500">Student distribution across salary brackets.</p>
        </div>
        
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Target className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-1">No Salary Range Data</p>
            <p className="text-sm text-gray-500">No salary distribution data available for the selected year.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{item.range}</span>
                <span className="text-sm text-gray-600">{item.count} students</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

