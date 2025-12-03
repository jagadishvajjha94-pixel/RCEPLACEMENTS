"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlacementStatusData {
  name: string
  value: number
  color: string
}

interface PlacementStatusChartProps {
  data?: PlacementStatusData[]
}

const COLORS = {
  "Not Placed": "#10b981",
  "Placed": "#3b82f6",
  "Pending": "#f59e0b",
}

export function PlacementStatusChart({ data = [] }: PlacementStatusChartProps) {
  const defaultData: PlacementStatusData[] = data.length > 0 
    ? data 
    : [{ name: "Not Placed", value: 100, color: COLORS["Not Placed"] }]

  return (
    <Card className="bg-white border shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Placement Status Breakdown</h3>
            <p className="text-sm text-gray-500">Overall student placement status distribution.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-8">
          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defaultData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {defaultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {defaultData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

