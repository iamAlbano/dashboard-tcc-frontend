import { button } from '@/utils/types/button'

import { Button } from 'primereact/button'

export default function Option (props: button) {
  return (
    <>
      <Button 
        label={props.label} 
        icon={props.icon ?? undefined}
        iconPos={props.iconPos ?? 'left'}
        severity={props.severity}
        disabled={props.disabled}
        text={props.text}
        raised={props.raised}
        rounded={props.rounded}
        outlined={props.outlined}
        onClick={props.onClick}
        className={props.className ?? ''}
        size={props.size ?? undefined}
      />
      {
        props?.children && (
          <>
            {props.children}
          </>
        )
      }
    </>
  )
}