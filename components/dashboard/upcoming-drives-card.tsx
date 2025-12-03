"use client"

import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface Drive {
  id: string
  companyName: string
  deadline: string
  appliedPercentage: number
}

interface UpcomingDrivesCardProps {
  drives?: Drive[]
}

export function UpcomingDrivesCard({ drives = [] }: UpcomingDrivesCardProps) {
  return (
    <Card className="bg-white border shadow-sm">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Placement Drives</h3>
          <p className="text-sm text-gray-500">Chronological timeline of upcoming drives with applied percentage.</p>
        </div>
        
        {drives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-1">No Upcoming Drives</p>
            <p className="text-sm text-gray-500">No active placement drives scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drives.map((drive) => (
              <div key={drive.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{drive.companyName}</p>
                  <p className="text-sm text-gray-500">Deadline: {new Date(drive.deadline).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">{drive.appliedPercentage}%</p>
                  <p className="text-xs text-gray-500">Applied</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

