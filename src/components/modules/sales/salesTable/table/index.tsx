"use client";
import { useEffect, useState } from "react";

import { Pagination } from "@/components/table/pagination";
import { getCalendarView } from "@/components/utils/chartFunctions";
import PeriodSelect from "@/components/utils/time/periodSelect";
import TimeSelect from "@/components/utils/time/timeSelect";
import { useSale } from "@/context/sale";
import { Period } from "@/utils/types/globals";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Nullable } from "primereact/ts-helpers";

type Props = {
  totalSales?: number;
  isLoading?: boolean;
  onFilterChange: (
    page: number,
    startDate: string | null | undefined,
    endDate: string | null | undefined
  ) => void;
};

export default function ProductsTable({
  totalSales,
  isLoading,
  onFilterChange,
}: Props) {
  const { sales } = useSale();

  const [page, setPage] = useState<number>(1);

  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  const [openedIndex, setOpenedIndex] = useState<number>(-1);

  function formatDate(date?: Date | null) {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (!dates?.[0] || !dates?.[1]) return;

    onFilterChange(1, formatDate(dates[0]), formatDate(dates[1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates]);

  return (
    <section className="flex flex-column gap-2">
      <div className="flex flex-row gap-2 flex-wrap">
        <PeriodSelect
          value={period}
          onChange={(e) => setPeriod(e.value)}
          disabled={isLoading}
        />
        <TimeSelect
          value={dates}
          onChange={(e) => {
            setDates(e.value);
          }}
          dateFormat={period ?? "month"}
          view={getCalendarView(period ?? "month")}
          disabled={isLoading}
          showIcon
          key={period}
        />
      </div>
      {!isLoading && sales.length > 0 && (
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Produto(s)</th>
              <th>Quantidade</th>
              <th className="text-center">Valor</th>
              <th>Cliente</th>
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
                <td>{sale.customer?.name ?? "-"}</td>
                <td className="text-center">{sale.status ?? "-"}</td>
                <td className="text-center">
                  {sale.date ? new Date(sale.date).toLocaleDateString() : ""}
                </td>
              </tr>

              {openedIndex === index &&
                sale.products.length > 1 &&
                sale.products.map(
                  (
                    product: {
                      name: string;
                      quantity: number;
                      price: number;
                    },
                    i: number
                  ) => (
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
                  )
                )}
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
          onFilterChange(
            newPage,
            formatDate(dates?.[0]),
            formatDate(dates?.[1])
          );
        }}
      />
    </section>
  );
}
