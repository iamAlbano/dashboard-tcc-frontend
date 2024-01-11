"use client";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useState } from "react";

import { useAccessibility } from "@/context/accessibility";

interface Option {
  label: string;
  path: string;
}

export default function IconsDemo() {
  const { theme } = useAccessibility();

  const [options, setOptions] = useState<Option[]>([
    {
      label: "Produtos",
      path: "/products",
    },
    {
      label: "Categorias",
      path: "/categories",
    },
    {
      label: "Clientes",
      path: "/clients",
    },
    {
      label: "Fornecedores",
      path: "/suppliers",
    },
    {
      label: "Funcionários",
      path: "/employees",
    },
    {
      label: "Pedidos",
      path: "/orders",
    },
    {
      label: "Vendas",
      path: "/sales",
    },
    {
      label: "Compras",
      path: "/purchases",
    },
    {
      label: "Estoque",
      path: "/stock",
    },
  ]);

  return (
    <span className="p-input-icon-left desktop">
      <i className="pi pi-search" />
      <Dropdown
        onChange={(e: DropdownChangeEvent) => console.log(e.value)}
        options={options}
        optionLabel="label"
        editable
        placeholder="Search"
        className="w-full"
      />
    </span>
  );
}
