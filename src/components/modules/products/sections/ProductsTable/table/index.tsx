"use client";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

import { useProduct } from "@/context/product";

const OrdenateIcon = dynamic(() => import("@/components/table/ordenateIcon"));

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Rating } from "primereact/rating";

type Props = {
  onPageChange: (page: number) => void;
};

export default function ProductsTable({ onPageChange }: Props) {
  const { products } = useProduct();

  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [category, setCategory] = useState<string | null>(null);

  const [sortedColumn, setSortedColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"up" | "down" | "">("");

  const categories = [
    { label: "Alimentos", value: "Alimentos" },
    { label: "Bebidas", value: "Bebidas" },
    { label: "Limpeza", value: "Limpeza" },
    { label: "Higiene", value: "Higiene" },
    { label: "Outros", value: "Outros" },
  ];

  return (
    <section className="flex flex-column gap-2">
      <div className="flex flex-row py-2 gap-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Pesquisar produtos"
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
        <Dropdown
          value={category}
          onChange={(e: DropdownChangeEvent) => setCategory(e.value)}
          options={categories}
          optionLabel="label"
          placeholder="Categoria"
          className="w-full md:w-14rem bg-transparent"
          clearIcon
          filter
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>
              Produto <OrdenateIcon column="name" />
            </th>
            <th>
              Categoria <OrdenateIcon column="category" />
            </th>
            <th>
              Nota <OrdenateIcon column="rating" />
            </th>
            <th className="text-center">
              Preço <OrdenateIcon column="price" />
            </th>
            <th className="text-center">
              Total vendidos <OrdenateIcon column="totalSold" />
            </th>
            <th className="text-center">
              Valor total <OrdenateIcon column="totalValue" />
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>
                <Rating value={product.rating} readOnly cancel={false} />
              </td>
              <td className="text-center">${product.price}</td>
              <td className="text-center">
                {Math.floor(Math.random() * 100) + 1}
              </td>
              <td className="text-center">
                ${Math.floor(Math.random() * 100) + 1}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              Total de produtos cadastrados: <strong>26</strong>
            </td>
            <td>
              <Rating value={4} readOnly cancel={false} />
            </td>
            <td className="text-center">R$25,00</td>
            <td className="text-center">96</td>
            <td className="text-center">R$460,00</td>
          </tr>
        </tfoot>
      </table>
      <Paginator
        first={1}
        rows={5}
        totalRecords={120}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={(e: PaginatorPageChangeEvent) => onPageChange(e.page + 1)}
        className="bg-transparent"
      />
    </section>
  );
}
