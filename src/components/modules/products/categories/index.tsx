"use client";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";

import { parseDateToString } from "@/utils/functions/helpers";
import { Period } from "@/utils/types/globals";
import { ProgressSpinner } from "primereact/progressspinner";
import { Nullable } from "primereact/ts-helpers";
import { type chartData } from "./charts/mostSoldCategoriesChart";

import DataAccordion from "@/components/modules/dataAccordion";
import MostSoldCategories from "./charts/mostSoldCategoriesChart";

import {
  getCalendarView,
  handleGetChartLabels,
  handleGetPeriodChartData,
} from "@/components/utils/chartFunctions";

const PeriodSelect = dynamic(
  () => import("@/components/utils/time/periodSelect"),
  { ssr: false }
);
const TimeSelect = dynamic(() => import("@/components/utils/time/timeSelect"), {
  ssr: false,
});
const SellingRate = dynamic(() => import("./charts/categoriesSellingRate"), {
  ssr: false,
});
const TotalCategories = dynamic(() => import("./charts/totalCategories"), {
  ssr: false,
});

import { InputText } from "primereact/inputtext";

export default function CategoriesSection() {
  const { selectedStore } = useStore();
  const { getMostSoldCategories } = useProduct();
  const { getDict } = useAccessibility();
  const dict = getDict();

  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState<chartData[]>([]);

  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  const handleGetMostSoldCategories = async () => {
    if (!selectedStore?.id) return;
    setLoading(true);
    try {
      const data = await getMostSoldCategories(
        selectedStore?.id,
        debouncedSearch.length > 3 ? debouncedSearch : "",
        dates && dates[0] ? parseDateToString(dates[0]) : "2023-01-01",
        dates && dates[1] ? parseDateToString(dates[1]) : "2023-12-31",
        period ?? "month"
      );

      if (!data.length) {
        setChartData([]);
        setLoading(false);
        return;
      }

      const periodAux = period ?? "month";
      const startDate = dates && dates[0] ? dates[0] : new Date("01/01/2023");
      const endDate = dates && dates[1] ? dates[1] : new Date("12/31/2023");

      setChartData(
        [
          {
            type: "line",
            label: data[0]?.category,
            borderColor: "rgba(235, 19, 32, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetPeriodChartData(
              period ?? "month",
              data[0]?.sales,
              startDate,
              endDate
            ),
          },
          {
            type: "line",
            label: data[1]?.category,
            borderColor: "rgba(54, 62, 35, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetPeriodChartData(
              period ?? "month",
              data[1]?.sales,
              startDate,
              endDate
            ),
          },
          {
            type: "line",
            label: data[2]?.category,
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetPeriodChartData(
              period ?? "month",
              data[2]?.sales,
              startDate,
              endDate
            ),
          },
        ].filter((item) => item?.label !== undefined) as chartData[]
      );
    } catch (e) {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dates || !dates[0] || !dates[1]) return;

    handleGetMostSoldCategories();
  }, [selectedStore, debouncedSearch, dates, period]);

  return (
    <DataAccordion
      title={dict.productsDict.categoriesSection.title}
      icon="pi pi-tag"
    >
      <section className="flex flex-column gap-2">
        <span className="flex flex-row gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Pesquisar categorias"
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
          <PeriodSelect value={period} onChange={(e) => setPeriod(e.value)} />
          <TimeSelect
            value={dates}
            onChange={(e) => setDates(e.value)}
            dateFormat={period ?? "month"}
            view={getCalendarView(period ?? "month")}
            showIcon
            key={period}
          />
        </span>

        {!loading && chartData.length === 0 && (
          <div className="w-full">
            <p className="flex flex-row align-items-center justify-content-center w-full p-4 text-center">
              {dict.noData}
            </p>
          </div>
        )}
        <div className="flex flex-row w-full">
          <section className="w-9">
            {loading && (
              <div className="flex flex-row align-items-center w-full p-4">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              </div>
            )}
            {!loading && chartData.length > 0 && (
              <MostSoldCategories
                data={chartData}
                chartLabels={handleGetChartLabels(
                  period ?? "month",
                  dates && dates[0] ? dates[0] : new Date("01/01/2023"),
                  dates && dates[1] ? dates[1] : new Date("12/31/2023"),
                  dict
                )}
                search={
                  debouncedSearch.length > 3 ? debouncedSearch : undefined
                }
              />
            )}
          </section>
          {!loading && chartData.length > 0 && (
            <div className="flex flex-column w-3 gap-2">
              <SellingRate
                labels={chartData.map((item) => item.label)}
                data={chartData.map((item) =>
                  item.data.reduce((acc, curr) => acc + curr, 0)
                )}
              />
              <TotalCategories />
            </div>
          )}
        </div>
      </section>
    </DataAccordion>
  );
}
