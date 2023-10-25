'use client'
import { useAccessibility  } from "@/context/accessibility"

export type menuOption = {
  label: string
  icon: string
  route?: string
  items?: menuOption[]
}

export function GetMenu():menuOption[] {

  const { getDict } = useAccessibility()
  const dict = getDict()

	return [
    {
      label: dict['sidebar']['overview'],
      icon: 'pi pi-fw pi-home',
      route: '/dashboard',
    },
    {
      label: dict['sidebar']['products'],
      icon: 'pi pi-fw pi-box',
      route: `/dashboard/${dict['sidebar']['products'].toLowerCase()}`,
    },
    {
      label: dict['sidebar']['customers'],
      icon: 'pi pi-fw pi-users',
      route: '/dashboard/customers',
    },
    {
      label: dict['sidebar']['sales'],
      icon: 'pi pi-fw pi-shopping-cart',
      route: '/dashboard/sales',
    },
    {
      label: dict['sidebar']['import'],
      icon: 'pi pi-fw pi-upload',
      route: '/dashboard/import',
    }
  ]
}