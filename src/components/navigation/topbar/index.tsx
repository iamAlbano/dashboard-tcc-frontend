'use client'
import styles from './style.module.sass'
import dynamic from 'next/dynamic'

import { useAccessibility } from '@/context/accessibility'

const Search = dynamic(() => import('@/components/utils/search'))
const Calendar = dynamic(() => import('@/components/utils/calendar'))
const Avatar = dynamic (() => import('@/components/user/avatar'))
const ThemeSwitch = dynamic(() => import('@/components/accessibility/themeSwitch'))

export default function Topbar() {

  const { theme } = useAccessibility()

  return (
    <nav className={`
      ${styles.nav}
      ${theme === 'dark' ? 'dark-surface' : 'light-surface'}
    `}>
      <Search />
      <Calendar />
      <Avatar />
			<ThemeSwitch />
    </nav>
  )
}