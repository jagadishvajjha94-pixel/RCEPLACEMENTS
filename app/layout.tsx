import type React from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased overflow-x-hidden w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ fontFamily: 'var(--font-geist)' }}>
      {children}
    </div>
  )
}
