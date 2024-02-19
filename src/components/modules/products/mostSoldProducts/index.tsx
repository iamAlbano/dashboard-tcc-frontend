"use client";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Period, type Option } from "@/utils/types/globals";
import { Nullable } from "primereact/ts-helpers";

import { useAccessibility } from "@/context/accessibility";

import DataAccordion from "@/components/modules/dataAccordion";
import CategoriesFilter from "@/components/utils/categoriesFilter";
import SearchProducts from "@/components/utils/searchProduct";
import PeriodSelect from "@/components/utils/time/periodSelect";
import TimeSelect from "@/components/utils/time/timeSelect";
import { type chartData } from "./chart";

const ProductsList = dynamic(() => import("./table"), { ssr: false });
const MostSoldProductsChart = dynamic(() => import("./chart"), { ssr: false });

import {
  calculateTotalSold,
  getCalendarView,
  handleGetChartLabels,
  handleGetPeriodChartData,
} from "@/components/utils/chartFunctions";
import { parseDateToString } from "@/utils/functions/helpers";
import { ProgressSpinner } from "primereact/progressspinner";

export default function MostSoldProductsSection() {
  const { selectedStore } = useStore();
  const { getMostSoldProducts } = useProduct();
  const [loading, setLoading] = useState(false);

  const { getDict, theme } = useAccessibility();
  const dict = getDict();

  const [categories, setCategories] = useState<string[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<Option[]>([]);

  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  const [chartData, setChartData] = useState<chartData[]>([]);
  const [totalData, setTotalData] = useState<number[]>([]);
  const [products, setProducts] = useState([]);

  const handleGetMostSoldProducts = async () => {
    if (!selectedStore?.id || !period || !dates || !dates[0] || !dates[1])
      return;

    setLoading(true);
    try {
      const data = await getMostSoldProducts(
        selectedStore?.id,
        dates && dates[0] ? parseDateToString(dates[0]) : "2023-01-01",
        dates && dates[1] ? parseDateToString(dates[1]) : "2023-12-31",
        period ?? "month",
        productIds,
        categories
      );

      if (!data?.products.length) {
        setChartData([]);
        setProducts([]);
        setTotalData([]);
        setLoading(false);
        return;
      }

      setProducts(
        data?.products
          .slice(0, colors.length)
          .map((item: any, index: number) => ({
            name: item.product.name,
            category: item.product.category,
            totalSold: calculateTotalSold(item.sales) ?? 0,
            color: colors[index],
          }))
      );

      const startDate = dates && dates[0] ? dates[0] : new Date("01/01/2023");
      const endDate = dates && dates[1] ? dates[1] : new Date("12/31/2023");

      if (data?.total_sellings?.length)
        setTotalData(
          data.total_sellings.map((selling: any) => selling?.total ?? 0)
        );

      const newChartData = data.products
        .slice(0, colors.length)
        .map((product: any, index: number) => ({
          type: "line",
          label: product?.product?.name,
          borderColor: colors[index],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: handleGetPeriodChartData(
            period ?? "month",
            product?.sales,
            startDate,
            endDate
          ),
        }))
        .filter(
          (item: (typeof newChartData)[number]) => item?.label !== undefined
        ) as chartData[];

      setChartData(newChartData);

      const newProductsList = data?.products.map((item: any) => ({
        label: item.product.name,
        value: item.product.id,
      }));

      setProductsList(newProductsList);
    } catch (e) {
      setChartData([]);
      setProducts([]);
      setTotalData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMostSoldProducts();
  }, [selectedStore, productIds, dates, period, categories]);

  return (
    <DataAccordion
      title={dict.productsDict.soldProducts.title}
      icon="pi pi-shopping-cart"
    >
      <section className="flex flex-column gap-2">
        <div className="flex flex-row gap-2 flex-wrap">
          {productsList.length > 0 && (
            <SearchProducts
              initialProducts={productsList}
              onChange={(productIds) => setProductIds(productIds)}
              className="max-w-30rem w-full"
              loading={loading}
              disabled={loading}
            />
          )}

          <CategoriesFilter
            className="max-w-20rem w-full"
            onChange={(categories) => setCategories(categories)}
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
          <div className="flex flex-row align-items-center h-30rem w-full p-4">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        )}
        {!loading && chartData.length > 0 && (
          <div className="flex flex-row w-full align-items-center">
            <span className="w-full md:w-9">
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
            <span className="hidden md:flex md:w-3 pl-2">
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

const colors = [
  "rgba(235, 19, 32, 1)",
  "rgba(54, 62, 35, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(235, 19, 32, 1)",
  "rgba(54, 62, 35, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
];
