"use client";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";

import { useProduct } from "@/context/product";

import OrdenateIcon, { Direction } from "@/components/table/ordenateIcon";

import { Pagination } from "@/components/table/pagination";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

type Props = {
  totalProducts?: number;
  isLoading?: boolean;
  onChange: (
    page: number,
    search: string,
    columnSort: string,
    direction: Direction | undefined,
    category: string | null
  ) => void;
};

export default function ProductsTable({
  totalProducts,
  isLoading,
  onChange,
}: Props) {
  const { products } = useProduct();

  const [page, setPage] = useState<number>(1);
  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [category, setCategory] = useState<string | null>(null);

  const [sortedColumn, setSortedColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<Direction | undefined>(undefined);

  const categories = [
    { label: "Alimentos", value: "Alimentos" },
    { label: "Bebidas", value: "Bebidas" },
    { label: "Limpeza", value: "Limpeza" },
    { label: "Higiene", value: "Higiene" },
    { label: "Outros", value: "Outros" },
  ];

  useEffect(() => {
    onChange(page, debouncedSearch, sortedColumn, sortOrder, category);
  }, [page]);

  useEffect(() => {
    // Reset page to 1 when search or category changes
    if (page !== 1) setPage(1);
    else onChange(page, debouncedSearch, sortedColumn, sortOrder, category);
  }, [debouncedSearch, category, sortedColumn, sortOrder]);

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

      {products.length > 0 && (
        <table className={isLoading ? "opacity-50" : ""}>
          <thead>
            <tr>
              <th>
                Produto{" "}
                <OrdenateIcon
                  column="name"
                  direction={sortedColumn === "name" ? sortOrder : undefined}
                  onChange={(column, direction) => {
                    setSortedColumn(column);
                    setSortOrder(direction ?? undefined);
                  }}
                />
              </th>
              <th>
                Categoria{" "}
                <OrdenateIcon
                  column="category"
                  onChange={(column, direction) => {
                    setSortedColumn(column);
                    setSortOrder(direction ?? undefined);
                  }}
                />
              </th>
              <th className="text-center">
                Preço de venda{" "}
                <OrdenateIcon
                  column="price"
                  onChange={(column, direction) => {
                    setSortedColumn(column);
                    setSortOrder(direction ?? undefined);
                  }}
                />
              </th>
              <th className="text-center">
                Preço de compra{" "}
                <OrdenateIcon
                  column="purchase_price"
                  onChange={(column, direction) => {
                    setSortedColumn(column);
                    setSortOrder(direction ?? undefined);
                  }}
                />
              </th>
              <th className="text-center">
                Total vendidos{" "}
                <OrdenateIcon
                  column="total_sold"
                  onChange={(column, direction) => {
                    setSortedColumn(column);
                    setSortOrder(direction ?? undefined);
                  }}
                />
              </th>
              <th className="text-center">
                Valor total{" "}
                <OrdenateIcon
                  column="total_value"
                  onChange={(column, direction) => {
                    setSortedColumn(column);
                    setSortOrder(direction ?? undefined);
                  }}
                />
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
                  {isNaN(product.purchase_price)
                    ? ""
                    : `R$${product.purchase_price}`}
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
      )}
      {!isLoading && products.length === 0 && (
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
        }}
      />
    </section>
  );
}
