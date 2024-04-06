"use client";
import { useAccessibility } from "@/context/accessibility";

export type menuOption = {
  label: string;
  icon: string;
  route?: string;
  items?: menuOption[];
};

export function GetMenu(): menuOption[] {
  const { getDict } = useAccessibility();
  const dict = getDict();

  return [
    {
      label: "Importação",
      icon: "pi pi-fw pi-home",
      route: "/dashboard",
    },
    {
      label: dict["sidebar"]["sales"],
      icon: "pi pi-fw pi-shopping-cart",
      route: "/dashboard/vendas",
    },
    {
      label: dict["sidebar"]["products"],
      icon: "pi pi-fw pi-box",
      route: `/dashboard/produtos`,
    },
    {
      label: dict["sidebar"]["customers"],
      icon: "pi pi-fw pi-users",
      route: "/dashboard/clientes",
    },
    /*   {
      label: dict["sidebar"]["import"],
      icon: "pi pi-fw pi-upload",
      route: "/dashboard/import",
    }, */
  ];
}
