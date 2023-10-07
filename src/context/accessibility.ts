import { create } from 'zustand'

import en from '@/dict/en.json'
import pt from '@/dict/pt.json'

import { option } from '@/utils/types/globals'
import { theme, dict } from '@/utils/types/accessibility'

type AccessibilityState = {
  language: string
  languages: option[]
  setLanguage: (language: string) => void
  getDict: () => dict
  theme: theme
  setTheme: (theme: theme) => void
  lockSidebar: boolean
  setLockSidebar: (locked: boolean) => void
}

export const useAccessibility = create<AccessibilityState>((set) => ({
  language: 'en',
  theme: 'light',
  lockSidebar: false,
  languages: [
    { label: 'English', value: 'en', onClick: () => set({ language: 'en' }) },
    { label: 'Português', value: 'pt', onClick: () => set({ language: 'pt' }) },
  ],
  setLanguage: (language: string) => set({ language }),
  getDict: () => getDict(),
  setTheme: (theme: theme) => set({ theme }),
  setLockSidebar: (locked: boolean) => set({ lockSidebar: locked })
}))

function getDict(): dict {
  const { language } = useAccessibility.getState()
  return language === 'en' ? en : pt
}