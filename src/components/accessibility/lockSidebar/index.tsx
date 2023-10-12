'use client'
import { useState } from 'react'

import { useAccessibility } from '@/context/accessibility'

import { Button } from 'primereact/button'
        
export default function LockSIdebar() {

  const { lockSidebar, setLockSidebar } = useAccessibility()

  return (
    <Button 
      aria-label="Toggle Lock Sidebar"
      className="p-1"
      outlined={!lockSidebar}
      onClick={() => setLockSidebar(!lockSidebar)}
      rounded
    >
     {
        lockSidebar 
        ? <i className="pi pi-lock" />
        : <i className="pi pi-unlock" />
     }
     </Button>
  )
}