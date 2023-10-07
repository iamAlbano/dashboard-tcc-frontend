
import style from './style.module.sass'
import { Calendar } from 'primereact/calendar'

import { useAccessibility } from '@/context/accessibility'

export default function BasicDemo() {

  const { theme } = useAccessibility()

  return (
    <Calendar 
      value={new Date()} 
      locale="en"
      className={`w-7rem ${ theme === 'dark' ? style.dark: style.light }`}
    />
  )
}
        