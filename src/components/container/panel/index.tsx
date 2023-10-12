'use client'
import style from './style.module.sass'

import { useAccessibility } from '@/context/accessibility'

export default function Panel({ children }: { children: React.ReactNode}) {

  const { theme } = useAccessibility()

  return (
    <section className={`
      border-round
      ${style.panel}
      ${theme === 'dark' ? 'dark-surface' : 'light-surface'}
    `}>
      { children }
    </section>
  )
}