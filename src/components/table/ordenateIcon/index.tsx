'use client'
import { useState } from 'react'

type IDirection = "up" | "down"
type IType = "numeric" | "alpha" | "slash"

type IProps = {
  column: string
  direction?: IDirection
  type?: IType
  className?: string
  onChange?: (column: string, direction: IDirection|undefined) => void
}

export default function OrdenateIcon ({ ...props }: IProps) {

  const [type, setType] = useState<IType|undefined>(props.type)
  const [direction, setDirection] = useState<IDirection|undefined>(props.direction)

  function getIcon () {
    if (!direction) return `pi-sort-alt`

    switch (type) {
      case "numeric":
        return `pi-sort-numeric-${direction}`
      case "alpha":
        return `pi-sort-alpha-${direction}`
      case "slash":
        return `pi-sort-alt-slash`
      default:
        return `pi-sort-amount-${direction}`
    }
  }

  function changeDirection () {
    const newDirection = 
      direction === 'down' ? undefined : 
        direction === undefined ? 'up' : 'down'

    setDirection(newDirection)
    props.onChange?.(props.column, newDirection)
  }

  return (
    <i 
      className={`pi ${getIcon()} cursor-pointer ${props.className}`} 
      onClick={changeDirection}
    />
  )
}