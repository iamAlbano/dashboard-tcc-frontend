import style from './style.module.sass'

type IProps = {
  color?: string
  className?: string
  children: React.ReactNode
}

export default function InfoCard({ ...props }: IProps) {
  return (
    <div className={`${style.card} ${props.className ?? ''}`}
      style={{ backgroundColor: props.color ?? 'transparent'}}
    >
      { props.children }
    </div>
  )
}
