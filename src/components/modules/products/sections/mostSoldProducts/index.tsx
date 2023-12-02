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

const ProductsList = dynamic(() => import("./table"), { ssr: false });
const MostSoldProductsChart = dynamic(() => import("./chart"), { ssr: false });

import { ProgressSpinner } from "primereact/progressspinner";

import { parseDateToString } from "@/utils/functions/helpers";

export default function MostSoldProductsSection() {
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
  const [products, setProducts] = useState([]);

  function getCalendarView() {
    switch (period) {
      case "day":
        return "date";
      case "month":
        return "month";
      case "year":
        return "year";
      default:
        return "month";
    }
  }

  const handleGetChartData = (
    data: { month?: number; day?: number; year?: number; quantity: number }[]
  ) => {
    const resData = [];

    switch (period) {
      case "month":
        if (!dates || !dates[0] || !dates[1]) return [];
        for (
          let i = dates[0]?.getMonth() + 1;
          i <= dates[1]?.getMonth() + 1;
          i++
        ) {
          const monthData = data.find((item) => item?.month === i);
          resData.push(monthData?.quantity ?? 0);
        }
        break;
      case "day":
        if (!dates || !dates[0] || !dates[1]) return [];
        for (let i = dates[0]?.getDate(); i <= dates[1]?.getDate(); i++) {
          const dayData = data.find((item) => item?.day === i);
          resData.push(dayData?.quantity ?? 0);
        }
        break;
      case "year":
        if (!dates || !dates[0] || !dates[1]) return [];
        for (
          let i = dates[0]?.getFullYear();
          i <= dates[1]?.getFullYear();
          i++
        ) {
          const yearData = data.find((item) => item?.year === i);
          resData.push(yearData?.quantity ?? 0);
        }
        break;
    }

    return resData;
  };

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const handleGetChartLabels = () => {
    switch (period) {
      case "month":
        if (!dates || !dates[0] || !dates[1]) return [];
        const labels = [];
        for (let i = dates[0]?.getMonth(); i <= dates[1]?.getMonth(); i++) {
          labels.push(dict.monthDict[months[i] as keyof typeof dict.monthDict]);
        }

        return labels.filter((item) => item !== undefined) as string[];
      case "day":
        if (!dates || !dates[0] || !dates[1]) return [];
        const dayLabels = [];
        for (let i = dates[0]?.getDate(); i <= dates[1]?.getDate(); i++) {
          dayLabels.push(i.toString());
        }

        return dayLabels.filter((item) => item !== undefined) as string[];
      case "year":
        if (!dates || !dates[0] || !dates[1]) return [];
        const yearLabels = [];
        for (
          let i = dates[0]?.getFullYear();
          i <= dates[1]?.getFullYear();
          i++
        ) {
          yearLabels.push(i.toString());
        }

        return yearLabels.filter((item) => item !== undefined) as string[];
    }
  };

  function calculateTotalSold(salesData: any[]): number {
    return salesData.reduce(
      (acumulador: number, elemento: any) => acumulador + elemento.quantity,
      0
    );
  }

  const handleGetMostSoldProducts = async () => {
    if (!selectedStore?.id) return;
    setLoading(true);
    try {
      const data = await getMostSoldProducts(
        selectedStore?.id,
        debouncedSearch.length > 3 ? debouncedSearch : "",
        dates && dates[0] ? parseDateToString(dates[0]) : "2023-01-01",
        dates && dates[1] ? parseDateToString(dates[1]) : "2023-12-31",
        period ?? "month"
      );

      if (!data.length) {
        setChartData([]);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(
        data.map((item: any) => ({
          name: item.product.name,
          category: item.product.category,
          totalSold: calculateTotalSold(item.sales) ?? 0,
        }))
      );

      setChartData(
        [
          {
            type: "line",
            label: data[0]?.product?.name,
            borderColor: "rgba(235, 19, 32, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetChartData(data[0]?.sales),
          },
          {
            type: "line",
            label: data[1]?.product?.name,
            borderColor: "rgba(54, 62, 35, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetChartData(data[1]?.sales),
          },
          {
            type: "line",
            label: data[2]?.product?.name,
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: handleGetChartData(data[2]?.sales),
          },
        ].filter((item) => item?.label !== undefined) as chartData[]
      );
    } catch (e) {
      setChartData([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dates || !dates[0] || !dates[1]) return;

    handleGetMostSoldProducts();
  }, [selectedStore, debouncedSearch, dates, period]);

  return (
    <DataAccordion
      title={dict.productsDict.soldProducts.title}
      icon="pi pi-shopping-cart"
    >
      <section className="flex flex-column gap-2">
        <div className="flex flex-row gap-2">
          {/* <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Pesquisar produtos"
              onChange={(e) => setSearch(e.target.value)}
            />
          </span> */}
          <PeriodSelect
            value={period}
            onChange={(e) => setPeriod(e.value)}
            disabled={loading}
          />
          <TimeSelect
            value={dates}
            onChange={(e) => setDates(e.value)}
            dateFormat={period ?? "month"}
            view={getCalendarView()}
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
            <span className="w-full md:w-9">
              <MostSoldProductsChart
                key={debouncedSearch}
                data={chartData}
                chartLabels={handleGetChartLabels()}
                search={
                  debouncedSearch.length > 3 ? debouncedSearch : undefined
                }
              />
            </span>
            <span className="hidden md:flex md:w-3">
              <ProductsList products={products} />
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

const auxData = [
  {
    type: "line",
    label: "Bamboo watch",
    borderColor: "rgba(235, 19, 32, 1)",
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    data: [50, 25, 12, 48, 56, 76, 42],
  },
  {
    type: "line",
    label: "Black watch",
    borderColor: "rgba(54, 62, 35, 1)",
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    data: [30, 15, 17, 48, 16, 46, 62],
  },
  {
    type: "line",
    label: "Blue band",
    borderColor: "rgba(255, 206, 86, 1)",
    borderWidth: 2,
    fill: false,
    tension: 0.4,
    data: [10, 25, 7, 8, 36, 26, 22],
  },
];
