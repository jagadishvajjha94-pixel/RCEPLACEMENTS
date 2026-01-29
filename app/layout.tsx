import type React from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased overflow-x-hidden w-full min-h-screen bg-gray-50" style={{ fontFamily: 'var(--font-geist)' }}>
      {children}
    </div>
  )
}
