import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeColors {
  primary?: string
  background?: string
  backgroundPanel?: string
  foreground?: string
  foregroundDim?: string
  foregroundBright?: string
  border?: string
  success?: string
  warning?: string
  error?: string
  accentCyan?: string
  accentBlue?: string
  accentPurple?: string
}

interface ThemeTypography {
  fontMono?: string
  fontSans?: string
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  colors?: ThemeColors
  typography?: ThemeTypography
}

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const colorMap: Record<keyof ThemeColors, string> = {
  primary: '--color-primary',
  background: '--color-background',
  backgroundPanel: '--color-background-panel',
  foreground: '--color-foreground',
  foregroundDim: '--color-foreground-dim',
  foregroundBright: '--color-foreground-bright',
  border: '--color-border',
  success: '--color-success',
  warning: '--color-warning',
  error: '--color-error',
  accentCyan: '--color-accent-cyan',
  accentBlue: '--color-accent-blue',
  accentPurple: '--color-accent-purple',
}

const typographyMap: Record<keyof ThemeTypography, string> = {
  fontMono: '--font-mono',
  fontSans: '--font-sans',
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'ghost-ui-theme',
  colors,
  typography,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme
  })

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)
  }, [storageKey])

  useEffect(() => {
    const root = document.documentElement
    root.style.colorScheme = resolvedTheme
    root.setAttribute('data-theme', resolvedTheme)

    if (colors) {
      for (const [key, value] of Object.entries(colors)) {
        if (value) {
          const cssVar = colorMap[key as keyof ThemeColors]
          if (cssVar) root.style.setProperty(cssVar, value)
        }
      }
    }

    if (typography) {
      for (const [key, value] of Object.entries(typography)) {
        if (value) {
          const cssVar = typographyMap[key as keyof ThemeTypography]
          if (cssVar) root.style.setProperty(cssVar, value)
        }
      }
    }

    return () => {
      if (colors) {
        for (const key of Object.keys(colors)) {
          const cssVar = colorMap[key as keyof ThemeColors]
          if (cssVar) root.style.removeProperty(cssVar)
        }
      }
      if (typography) {
        for (const key of Object.keys(typography)) {
          const cssVar = typographyMap[key as keyof ThemeTypography]
          if (cssVar) root.style.removeProperty(cssVar)
        }
      }
    }
  }, [resolvedTheme, colors, typography])

  useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setThemeState((prev) => (prev === 'system' ? 'system' : prev))
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
