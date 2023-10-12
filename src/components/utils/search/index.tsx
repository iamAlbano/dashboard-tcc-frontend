import { InputText } from "primereact/inputtext"

import { useAccessibility } from '@/context/accessibility'

export default function IconsDemo() {

  const { theme } = useAccessibility()

  return (
    <span className="p-input-icon-left desktop">
      <i className="pi pi-search" />
      <InputText 
        placeholder="Search" 
        className="border-primary"
      />
    </span>
  )
}
