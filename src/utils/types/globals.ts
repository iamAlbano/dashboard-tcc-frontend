export type Module = "products"

export type Period = "year"|"month"|"week"|"day"|"hour"|"minute"|"second"

export type Option = {
	label: string,
	value: string,
	onClick?: () => void
}