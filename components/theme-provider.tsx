import * as React from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  storageKey?: string
}

export function ThemeProvider({ children, defaultTheme = 'light', storageKey = 'ui-theme' }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<string>(defaultTheme)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setTheme(stored)
        document.documentElement.classList.toggle('dark', stored === 'dark')
      } else {
        document.documentElement.classList.toggle('dark', defaultTheme === 'dark')
      }
    }
  }, [defaultTheme, storageKey])

  const value = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: string) => {
      setTheme(newTheme)
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      }
    }
  }), [theme, storageKey])

  return <>{children}</>
}
