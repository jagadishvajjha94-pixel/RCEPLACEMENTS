"use client"

import { Card } from "@/components/ui/card"
import { Star, Briefcase } from "lucide-react"

interface Company {
  name: string
  salary?: string
  offers?: number
}

interface TopCompaniesProps {
  type: "salary" | "offers"
  companies?: Company[]
}

export function TopCompanies({ type, companies = [] }: TopCompaniesProps) {
  const title = type === "salary" 
    ? "Top 5 Companies by Salary" 
    : "Top 5 Companies by Offers"
  const subtitle = type === "salary"
    ? "Highest paying companies for placements in the selected year."
    : "Companies with highest number of placement offers."
  const Icon = type === "salary" ? Star : Briefcase
  const emptyMessage = type === "salary"
    ? "No Top Companies Data"
    : "No Top Companies Offers Data"
  const emptyDescription = type === "salary"
    ? "No company salary data available for the selected year."
    : "No company offers data available for the selected year."

  return (
    <Card className="bg-white border shadow-sm">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        
        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-1">{emptyMessage}</p>
            <p className="text-sm text-gray-500">{emptyDescription}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{company.name}</span>
                </div>
                {type === "salary" && company.salary && (
                  <span className="text-sm font-semibold text-gray-700">{company.salary}</span>
                )}
                {type === "offers" && company.offers !== undefined && (
                  <span className="text-sm font-semibold text-gray-700">{company.offers} offers</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

