"use client";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

import { useSale } from "@/context/sale";

const OrdenateIcon = dynamic(() => import("@/components/table/ordenateIcon"));

import { Pagination } from "@/components/table/pagination";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

type Props = {
  totalSales?: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export default function ProductsTable({
  totalSales,
  isLoading,
  onPageChange,
}: Props) {
  const { sales } = useSale();

  const [page, setPage] = useState<number>(1);
  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);

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
            placeholder="Pesquisar vendas"
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
      </div>

      {!isLoading && sales.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                Produto <OrdenateIcon column="name" />
              </th>
              <th>
                Quantidade <OrdenateIcon column="quantity" />
              </th>
              <th className="text-center">
                Preço <OrdenateIcon column="price" />
              </th>
              <th className="text-center">
                Status <OrdenateIcon column="totalSold" />
              </th>
              <th className="text-center">
                Data <OrdenateIcon column="totalValue" />
              </th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.product?.name}</td>
                <td>{sale.quantity}</td>
                <td className="text-center">
                  {isNaN(sale.price) ? "" : `R$${sale.price}`}
                </td>
                <td className="text-center">{sale.status}</td>
                <td className="text-center">
                  {sale.date ? new Date(sale.date).toLocaleDateString() : ""}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                Total de vendas cadastradss: <strong>{totalSales}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
      {!isLoading && sales.length === 0 && (
        <p className="text-center">
          Nenhum produto cadastrado, faça a importação de seus dados para
          visualizar as informações.
        </p>
      )}
      {isLoading && (
        <div className="flex justify-content-center align-content-center align-items-center h-20rem">
          <ProgressSpinner />
        </div>
      )}
      <Pagination
        currentPage={page}
        disabled={isLoading}
        totalPages={totalSales ? Math.ceil(totalSales / 10) : 1}
        onPageChange={(newPage: number) => {
          setPage(newPage);
          onPageChange(newPage);
        }}
      />
    </section>
  );
}
