export type button = {
  label?: string
  severity?: "secondary" | "success" | "info" | "warning" | "danger" | undefined
  icon?: string
  iconPos?: "left" | "top" | "bottom" | "right" | undefined
  text?: boolean
  raised?: boolean
  rounded?: boolean
  outlined?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  children?: React.ReactNode
  size?: "small" | "large" | undefined
}