"use client";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";

import { Period } from "@/utils/types/globals";
import { Nullable } from "primereact/ts-helpers";

import { useAccessibility } from "@/context/accessibility";

import DataAccordion from "@/components/modules/dataAccordion";
import PeriodSelect from "@/components/utils/time/periodSelect";
import TimeSelect from "@/components/utils/time/timeSelect";
import { type chartData } from "./chart";

const MostSoldProductsChart = dynamic(() => import("./chart"), { ssr: false });

import {
  getCalendarView,
  handleGetChartLabels,
  handleGetPeriodChartData,
} from "@/components/utils/chartFunctions";
import api from "@/server/api";
import { parseDateToString } from "@/utils/functions/helpers";
import { ProgressSpinner } from "primereact/progressspinner";

export default function SalesByPeriodSection() {
  const { selectedStore } = useStore();
  const { getMostSoldProducts } = useProduct();
  const [loading, setLoading] = useState(false);

  const { getDict, theme } = useAccessibility();
  const dict = getDict();

  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  const [chartData, setChartData] = useState<chartData[]>([]);
  const [totalData, setTotalData] = useState<number[]>([]);

  const handleGetSalesByPeriod = async () => {
    if (!selectedStore?.id || !period || !dates || !dates[0] || !dates[1])
      return;
    setLoading(true);
    try {
      const { data } = await api.getSalesByPeriod(
        selectedStore?.id,
        debouncedSearch.length > 3 ? debouncedSearch : "",
        dates && dates[0] ? parseDateToString(dates[0]) : "2023-01-01",
        dates && dates[1] ? parseDateToString(dates[1]) : "2023-12-31",
        3,
        period ?? "month"
      );

      if (!data?.sales.length) {
        setChartData([]);
        setTotalData([]);
        setLoading(false);
        return;
      }

      const periodAux = period ?? "month";
      const startDate = dates && dates[0] ? dates[0] : new Date("01/01/2023");
      const endDate = dates && dates[1] ? dates[1] : new Date("12/31/2023");

      setTotalData(
        data.sales.reduce((acc: number[], item: any) => {
          return item?.quantity ? item.quantity + acc : acc;
        }, [])
      );

      setChartData(
        [
          {
            type: "line",
            label: "Vendas",
            borderColor: "rgba(235, 19, 32, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetPeriodChartData(
              period ?? "month",
              data?.sales,
              startDate,
              endDate
            ),
          },
        ].filter((item) => item?.label !== undefined) as chartData[]
      );
    } catch (e) {
      setChartData([]);
      setTotalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetSalesByPeriod();
  }, [selectedStore, debouncedSearch, dates, period]);

  return (
    <DataAccordion title="Total de vendas" icon="pi pi-shopping-cart">
      <section className="flex flex-column gap-2">
        <div className="flex flex-row gap-2">
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
        {!loading && chartData.length > 0 && (
          <div className="flex flex-row w-full align-items-center">
            <span className="w-full">
              <MostSoldProductsChart
                data={chartData}
                totalSoldData={totalData}
                chartLabels={handleGetChartLabels(
                  period ?? "month",
                  dates && dates[0] ? dates[0] : new Date("01/01/2023"),
                  dates && dates[1] ? dates[1] : new Date("12/31/2023"),
                  dict
                )}
              />
            </span>
          </div>
        )}
        {!loading && chartData.length === 0 && (
          <p className="flex flex-row align-items-center justify-content-center w-full p-4 text-center">
            {dict.noData}
          </p>
        )}
      </section>
    </DataAccordion>
  );
}
