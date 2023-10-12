'use client'
import React from 'react'
import styles from './style.module.sass'
import dynamic from 'next/dynamic'

import { useAccessibility } from '@/context/accessibility'

import { Button } from 'primereact/button'

const Search = dynamic(() => import('@/components/utils/search'), { ssr: false })
const Avatar = dynamic (() => import('@/components/user/info'), { ssr: false })
const ThemeSwitch = dynamic(() => import('@/components/accessibility/themeSwitch'), { ssr: false })
const LanguageSelect = dynamic(() => import('@/components/accessibility/languageSelect'), { ssr: false })

export default function Topbar() {

  const { theme, openedSidebar } = useAccessibility()

  return (
    <nav className={`
      ${styles.nav}
      ${theme === 'dark' ? 'dark-surface' : 'light-surface'}
    `}>
      <span className={`
        ${openedSidebar ? styles.margin200 : styles.margin70 }
      `}>
        <Search />
      </span>
      <span className={`
        ${styles.dataContainer}
      `}>
        <Avatar />
        <LanguageSelect />
        <ThemeSwitch />
        <Button 
          icon="pi pi-sign-out"
          text
          rounded
        />
      </span>
    </nav>
  )
}