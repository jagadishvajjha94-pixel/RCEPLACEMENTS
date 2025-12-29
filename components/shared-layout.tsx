"use client"

import type React from "react"

interface SharedLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
}

export function SharedLayout({ children, sidebar, header, className = "" }: SharedLayoutProps) {
  return (
    <div className={`flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-hidden ${className}`}>
      {sidebar}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

