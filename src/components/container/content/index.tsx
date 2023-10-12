'use client'
import style from './style.module.sass'

import { useAccessibility } from '@/context/accessibility'

export default function ContentContainer({ children }: { children: React.ReactNode }) {

  const { theme, openedSidebar } = useAccessibility()

  return (
    <section 
      className={`
        ${style.container} 
        ${openedSidebar ? style.margin200 : style.margin70}
      `}
    >
      { children }
    </section>
  )
}