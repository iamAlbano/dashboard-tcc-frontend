'use client'
import { useState, useEffect } from "react"
import { usePathname  } from 'next/navigation'

import { useAccessibility } from "@/context/accessibility"

import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"

export default function BasicDemo() {

  const pathname = usePathname()
  const { theme } = useAccessibility()

  const [items, setItems] = useState<MenuItem[]>([])

  const home: MenuItem = { icon: "pi pi-home", url: "/dashboard" }

  const handleSetItems = () => {
    
    const breadcrumbs = pathname.split('/').filter((item) => item && item?.length && item !== 'dashboard')
 
    const items = breadcrumbs.map((item, index) => {
      return {
        label: item,
        url: `/${breadcrumbs.slice(0, index + 1).join('/')}`
      }
    })

    setItems(items)
  }

  useEffect(() => {
    handleSetItems()
  }, [])

  return (  
    <BreadCrumb 
      model={items} 
      home={home} 
      className={`
        border-none shadow-2
        ${theme === 'dark' ? 'dark-surface' : 'light-surface'}
      `}
    />
  )
}
