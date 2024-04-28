"use client";
import CategoriesFilter from "@/components/utils/categoriesFilter";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import { COLORS } from "@/utils/contants";
import { parseDateToString } from "@/utils/functions/helpers";
import { Period } from "@/utils/types/globals";
import dynamic from "next/dynamic";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabPanel, TabView } from "primereact/tabview";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useState } from "react";
import ScatterCategoriesChart from "./charts/scatterCategories";

import DataAccordion from "@/components/modules/dataAccordion";
import MultiChart, {
  type chartData,
} from "@/components/utils/chart/multiChart";

import {
  getCalendarView,
  handleGetChartLabels,
  handleGetPeriodChartData,
} from "@/components/utils/chartFunctions";
import TotalCategories from "./charts/totalCategories";

const PeriodSelect = dynamic(
  () => import("@/components/utils/time/periodSelect"),
  { ssr: false }
);
const TimeSelect = dynamic(() => import("@/components/utils/time/timeSelect"), {
  ssr: false,
});

export default function CategoriesSection() {
  const { selectedStore } = useStore();
  const { getMostSoldCategories } = useProduct();
  const { getDict } = useAccessibility();
  const dict = getDict();

  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [chartData, setChartData] = useState<chartData[]>([]);
  const [totalData, setTotalData] = useState<number[]>([]);

  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  const handleGetMostSoldCategories = async () => {
    if (!selectedStore?.id) return;

    setLoading(true);
    try {
      const { categories, total_sellings } = await getMostSoldCategories(
        selectedStore?.id,
        selectedCategories,
        dates && dates[0] ? parseDateToString(dates[0]) : "2023-01-01",
        dates && dates[1] ? parseDateToString(dates[1]) : "2023-12-31",
        period ?? "month"
      );

      if (!categories.length) {
        setChartData([]);
        setTotalData([]);
        setLoading(false);
        return;
      }

      const startDate = dates && dates[0] ? dates[0] : new Date("01/01/2023");
      const endDate = dates && dates[1] ? dates[1] : new Date("12/31/2023");

      setCategoriesList(categories.map((item: any) => item.category));

      if (total_sellings?.length)
        setTotalData(total_sellings.map((selling: any) => selling?.total ?? 0));

      const newChartData = categories
        .slice(0, COLORS.length)
        .map((category: any, index: number) => ({
          type: "line",
          label: category?.category,
          borderColor: COLORS[index],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: handleGetPeriodChartData(
            period ?? "month",
            category?.sales,
            startDate,
            endDate
          ),
        }))
        .filter(
          (item: (typeof newChartData)[number]) => item?.label !== undefined
        ) as chartData[];

      setChartData(newChartData);
    } catch (e) {
      setChartData([]);
      setTotalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dates || !dates[0] || !dates[1]) return;

    handleGetMostSoldCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore, dates, period, selectedCategories]);

  return (
    <DataAccordion
      title="Categorias de produtos mais vendidas"
      icon="pi pi-tag"
    >
      <section className="flex flex-column gap-2 w-full">
        <span className="flex flex-row gap-2 w-full flex-wrap">
          <CategoriesFilter
            initialCategories={categoriesList}
            className="max-w-30rem w-full"
            key={categoriesList.join("")}
            onChange={(categories) => setSelectedCategories(categories)}
          />

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
        <div className="flex flex-column w-full">
          <section className="flex w-full">
            {loading && (
              <div className="flex flex-row align-items-center w-full p-4">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
              </div>
            )}
            {!loading && chartData.length > 0 && (
              <MultiChart
                data={chartData}
                totalSoldData={totalData}
                chartLabels={handleGetChartLabels(
                  period ?? "month",
                  dates && dates[0] ? dates[0] : new Date("01/01/2023"),
                  dates && dates[1] ? dates[1] : new Date("12/31/2023"),
                  dict
                )}
              />
            )}
          </section>
          {!loading && chartData.length > 0 && (
            <div className="flex flex-column align-items-start w-full">
              <h4 className="vertical-align-middle">
                Porcentagem de produtos e vendas por categoria
              </h4>
              <TabView className="w-full">
                <TabPanel header="Dispersão">
                  <ScatterCategoriesChart
                    totalSellingsByCategory={chartData.map((item) => {
                      return {
                        category: item.label,
                        total: item.data.reduce((acc, curr) => acc + curr, 0),
                      };
                    })}
                  />
                </TabPanel>
                <TabPanel header="Barras">
                  <TotalCategories
                    totalSellingsByCategory={chartData.map((item) => {
                      return {
                        category: item.label,
                        total: item.data.reduce((acc, curr) => acc + curr, 0),
                      };
                    })}
                  />
                </TabPanel>
              </TabView>
            </div>
          )}
        </div>
      </section>
    </DataAccordion>
  );
}
