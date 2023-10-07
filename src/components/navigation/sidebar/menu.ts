type menuOption = {
  label: string
  icon: string
  items?: menuOption[]
}

export default function getMenu():menuOption[] {
	return [
    {
      label: 'Produtos',
      icon: 'pi pi-fw pi-home',
      items: [
        {
          label: 'Novo produto',
          icon: 'pi pi-fw pi-home',
        },
        {
          label: 'Importar',
          icon: 'pi pi-fw pi-file',
        },
      ],
    },
    {
      label: 'Vendas',
      icon: 'pi pi-fw pi-file',
      items: [
        {
          label: 'Nova venda',
          icon: 'pi pi-fw pi-home',
        },
        {
          label: 'Importar',
          icon: 'pi pi-fw pi-file',
        },
      ],
    },
  ]
}