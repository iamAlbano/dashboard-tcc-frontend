import { create } from 'zustand'

import en from '@/dict/en.json'
import pt from '@/dict/pt.json'

import { Option } from '@/utils/types/globals'
import { Theme, Dict, Language } from '@/utils/types/accessibility'

type AccessibilityState = {
  language: Language
  languages: Option[]
  setLanguage: (language: Language) => void
  getDict: () => Dict
  theme: Theme
  setTheme: (theme: Theme) => void
  openedSidebar: boolean
  lockSidebar: boolean
  setOpenedSidebar: (opened: boolean) => void
  setLockSidebar: (locked: boolean) => void
}

export const useAccessibility = create<AccessibilityState>((set) => ({
  language: 'pt',
  theme: 'light',
  lockSidebar: false,
  openedSidebar: false,
  setOpenedSidebar: (opened: boolean) => set({ openedSidebar: opened }),
  languages: [
    { label: 'English', value: 'en' },
    { label: 'Português', value: 'pt' },
  ],
  setLanguage: (language: Language) => set({ language }),
  getDict: () => getDict(),
  setTheme: (theme: Theme) => set({ theme }),
  setLockSidebar: (locked: boolean) => set({ lockSidebar: locked })
}))

function getDict(): Dict {
  const { language } = useAccessibility.getState()
  return language === 'en' ? en : pt
}