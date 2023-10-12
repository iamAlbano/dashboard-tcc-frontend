'use client'
import style from './style.module.sass'

import { useAccessibility } from '@/context/accessibility'
import { Tooltip } from 'primereact/tooltip'
import { useImport } from '@/context/import'

import { Button } from 'primereact/button'

type IProps = {
  module: "products"
  onCreate?: () => void
}

export default function ModuleHeader({ ...props }: IProps) {

  const { theme, getDict } = useAccessibility()
  const { openImportModal } = useImport()

  const dict = getDict()

  return (
    <section className={ style.header }>
      <span className={ style.container }>
        <i className={dict?.modules[props.module]?.icon} />
        <h1>
          { dict?.modules[props.module]?.title }
        </h1>
        {
          dict?.modules[props.module]?.description && (
            <>
            <i className="pi pi-question-circle text-base" 
              data-pr-tooltip={ dict?.modules[props.module]?.description }
            />
            <Tooltip target=".pi-question-circle" />
            </>
          )
        }
        
      </span>
      <span className={ style.container }>

        {/* <Button 
          label={ dict?.modules[props.module]?.add }
          icon="pi pi-plus" 
          severity="success" 
          outlined={ theme === 'dark' }
          onClick={ props.onCreate }
        /> */}
        <Button 
          label={ dict?.import?.title }
          icon="pi pi-upload" 
          severity="info" 
          outlined={ theme === 'dark' }
          onClick={ () => openImportModal(props.module) }
        />
      </span>
    </section>
  )
}