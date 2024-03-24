"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import { useSale } from "@/context/sale";
import { Button } from "primereact/button";

const OrdenateIcon = dynamic(() => import("@/components/table/ordenateIcon"));

import { Pagination } from "@/components/table/pagination";
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
  const [openedIndex, setOpenedIndex] = useState<number>(-1);

  return (
    <section className="flex flex-column gap-2">
      {!isLoading && sales.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Produto(s)</th>
              <th>Quantidade</th>
              <th className="text-center">Valor</th>
              <th className="text-center">Status</th>
              <th className="text-center">Data</th>
            </tr>
          </thead>
          {sales.map((sale, index) => (
            <tbody key={index}>
              <tr className={index % 2 !== 0 ? "bg-gray-100" : undefined}>
                <td>
                  {sale.products.length > 1 && (
                    <Button
                      size="small"
                      className="w-2 py-1"
                      outlined
                      icon={
                        openedIndex === index
                          ? "pi pi-chevron-up"
                          : "pi pi-chevron-down"
                      }
                      onClick={() => {
                        openedIndex === index
                          ? setOpenedIndex(-1)
                          : setOpenedIndex(index);
                      }}
                    />
                  )}
                </td>
                <td>
                  {sale.products[0]?.name}
                  {sale.products.length > 1 && (
                    <span className="text-muted">
                      {" "}
                      +{sale.products.length - 1}
                    </span>
                  )}
                </td>
                <td className="text-center">{sale.quantity}</td>
                <td className="text-center">
                  {isNaN(sale.price) ? "" : `R$${sale.price.toFixed(2)}`}
                </td>
                <td className="text-center">{sale.status ?? "-"}</td>
                <td className="text-center">
                  {sale.date ? new Date(sale.date).toLocaleDateString() : ""}
                </td>
              </tr>

              {openedIndex === index &&
                sale.products.length > 1 &&
                sale.products.map((product, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-primary-50" : undefined}
                  >
                    <td></td>
                    <td className="text-muted">{product.name}</td>
                    <td className="text-center">{product.quantity}</td>
                    <td className="text-center">
                      {isNaN(product.price)
                        ? ""
                        : `R$${product.price.toFixed(2)}`}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                ))}
            </tbody>
          ))}
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
          Nenhuma venda cadastrada, faça a importação de seus dados para
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
