import { Theme } from '@/utils/types/accessibility'

export const setTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined')
    localStorage.setItem('theme', theme)
}

export const getTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    var theme = localStorage.getItem('theme') || 'light'
    return theme === 'light' ? 'light' : 'dark'
  }
  return 'light'
}

export const toggleTheme = () => {
  if (typeof window !== 'undefined')
    setTheme(getTheme() === 'light' ? 'dark' : 'light')
}

