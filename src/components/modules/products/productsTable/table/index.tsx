"use client";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

import { useProduct } from "@/context/product";

const OrdenateIcon = dynamic(() => import("@/components/table/ordenateIcon"));

import { Pagination } from "@/components/table/pagination";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

type Props = {
  totalProducts?: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export default function ProductsTable({
  totalProducts,
  isLoading,
  onPageChange,
}: Props) {
  const { products } = useProduct();

  const [page, setPage] = useState<number>(1);
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

      {products.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>
                Produto <OrdenateIcon column="name" />
              </th>
              <th>
                Categoria <OrdenateIcon column="category" />
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
                <td className="text-center">
                  {isNaN(product.price) ? "" : `R$${product.price}`}
                </td>
                <td className="text-center">
                  {typeof product.total_sold === "number"
                    ? product.total_sold.toFixed(2)
                    : product?.total_sold}
                </td>
                <td className="text-center">
                  {isNaN(product.price)
                    ? ""
                    : `R$${(product.price * product.total_sold)?.toFixed(2)}`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                Total de produtos cadastrados: <strong>{totalProducts}</strong>
              </td>
              {/*             <td className="text-center">R$25,00</td>
            <td className="text-center">96</td>
            <td className="text-center">R$460,00</td> */}
            </tr>
          </tfoot>
        </table>
      ) : (
        <p className="text-center">
          Nenhum produto cadastrado, faça a importação de seus dados para
          visualizar as informações.
        </p>
      )}
      <Pagination
        currentPage={page}
        disabled={isLoading}
        totalPages={totalProducts ? Math.ceil(totalProducts / 10) : 1}
        onPageChange={(newPage: number) => {
          setPage(newPage);
          onPageChange(newPage);
        }}
      />
    </section>
  );
}
