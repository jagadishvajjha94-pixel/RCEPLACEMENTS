"use client"

import { Card } from "@/components/ui/card"
import { LucideIcon, TrendingUp } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor: string
  bgColor: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function KPICard({ title, value, subtitle, icon: Icon, iconColor, bgColor, trend }: KPICardProps) {
  return (
    <Card className={`${bgColor} border-0 shadow-sm`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${iconColor} bg-white/20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className={`w-3 h-3 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
              <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>{trend.value}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}

