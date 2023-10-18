export type Module = "products"

export type Period = "year"|"month"|"week"|"day"

export type Option = {
	label: string,
	value: string,
	onClick?: () => void
}