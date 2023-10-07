import { InputText } from "primereact/inputtext"

import { useAccessibility } from '@/context/accessibility'

export default function IconsDemo() {

  const { theme } = useAccessibility()

  return (
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText 
        placeholder="Search" 
        className={`${theme === 'dark' ? 'dark-surface' : 'light-surface'}`}
      />
    </span>
  )
}
