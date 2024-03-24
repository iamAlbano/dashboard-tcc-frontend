"use client";

import { useStore } from "@/context/store";
import { useEffect, useState } from "react";

import DataAccordion from "@/components/modules/dataAccordion";
import SearchProducts from "@/components/utils/searchProduct";
import PeriodSelect from "@/components/utils/time/periodSelect";
import TimeSelect from "@/components/utils/time/timeSelect";
import { parseDateToString } from "@/utils/functions/helpers";
import { Option, Period } from "@/utils/types/globals";
import { Nullable } from "primereact/ts-helpers";
import ProfitProductsChart from "./chart";

import { getCalendarView } from "@/components/utils/chartFunctions";
import api from "@/server/api";
import { ProgressSpinner } from "primereact/progressspinner";

export default function BestProfitProducts() {
  const { selectedStore } = useStore();
  const [loading, setLoading] = useState(false);

  const [currentData, setCurrentData] = useState<
    Nullable<{
      category: string;
      name: string;
      price: number;
      productId: string;
      purchase_price: number;
      quantity_sold: number;
      stock: number;
      total_sold: number;
      total_bought: number;
    }>
  >(null);

  const [selectedProduct, setSelectedProducts] = useState<Option | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  async function getMostProfitableProducts() {
    if (!selectedStore?.id) return;

    try {
      setLoading(true);
      const { data } = await api.getMostProfitableProducts(
        selectedStore.id,
        selectedProductIds,
        dates && dates[0] ? parseDateToString(dates[0]) : "2023-01-01",
        dates && dates[1] ? parseDateToString(dates[1]) : "2023-12-31",
        period ?? "month",
        1
      );

      setCurrentData(data?.products[0] ?? null);

      setSelectedProducts(
        data?.products[0]?.productId
          ? {
              label: data?.products[0]?.name,
              value: data?.products[0]?.productId,
            }
          : null
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMostProfitableProducts();
  }, [selectedStore, period, dates, selectedProductIds]);

  return (
    <DataAccordion title="Lucratividade de produtos" icon="pi pi-shopping-cart">
      <section className="flex flex-column gap-2">
        <div className="flex flex-row gap-2">
          <SearchProducts
            initialProducts={selectedProduct ? [selectedProduct] : []}
            onChange={(productIds) => setSelectedProductIds(productIds)}
            className="max-w-30rem w-full"
            loading={loading}
            key={selectedProductIds[0]}
          />
          <PeriodSelect
            value={period}
            onChange={(e) => setPeriod(e.value)}
            disabled={loading}
          />
          <TimeSelect
            value={dates}
            onChange={(e) => setDates(e.value)}
            dateFormat={period ?? "month"}
            view={getCalendarView(period ?? "month")}
            disabled={loading}
            showIcon
            key={period}
          />
        </div>
        {loading && (
          <div className="flex flex-row align-items-center w-full p-4">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        )}
        {!loading && !!currentData && (
          <ProfitProductsChart
            productName={currentData.name}
            total_sold={currentData.total_sold}
            total_bought={currentData.total_bought}
            total_stock={(currentData.stock ?? 0) * currentData.purchase_price}
          />
        )}
      </section>
    </DataAccordion>
  );
}
