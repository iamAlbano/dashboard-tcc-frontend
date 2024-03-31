"use client";
import { useStore } from "@/context/store";
import api from "@/server/api";
import { COLORS } from "@/utils/contants";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

type CategoryData = {
  category: string;
  total: number;
};

type TotalCategoriesChartProps = {
  totalSellingsByCategory: CategoryData[];
};

export default function TotalCategoriesChart({
  totalSellingsByCategory,
}: TotalCategoriesChartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const { selectedStore } = useStore();

  const handleGetCategoriesTotal = async () => {
    if (!selectedStore?.id) return;

    try {
      setIsLoading(true);
      const { data } = await api.getTotalProductsByCategory(selectedStore.id);

      // const labels = data.categories
      //   ?.map((categories: { _id: string }) => categories._id)
      //   .filter(Boolean);

      // const values = data.categories?.map(
      //   (categories: { total: number }) => categories.total
      // );

      handleSetChartData(
        data.categories.map((category: { _id: string; total: number }) => {
          return {
            category: category._id,
            total: category.total,
          };
        })
      );
    } catch (error) {
      handleSetChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetChartData = (categoriesData: CategoryData[]) => {
    const chartData = categoriesData.map((category) => {
      return {
        category: category.category,
        totalProducts: category.total,
        totalSales:
          totalSellingsByCategory.find(
            (selling) => selling.category === category.category
          )?.total ?? 0,
      };
    });

    function orderByAlpha(
      a: (typeof chartData)[number],
      b: (typeof chartData)[number]
    ): number {
      if (a.category < b.category) {
        return -1;
      } else if (a.category > b.category) {
        return 1;
      } else {
        return 0;
      }
    }

    const orderedChartData = chartData.sort(orderByAlpha);

    const data = {
      labels: orderedChartData.map((category) => category.category),
      datasets: [
        {
          label: "Total de produtos por categoria",
          data: orderedChartData.map((category) => category.totalProducts),
          backgroundColor: COLORS,
          borderColor: getOpaqueColors,
          borderWidth: 1,
        },
        {
          label: "Total de vendas por categoria",
          data: orderedChartData.map((selling) => selling.totalSales),
          backgroundColor: getOpaqueColors,
          borderColor: COLORS,
          borderWidth: 1,
        },
      ],
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  };

  useEffect(() => {
    handleGetCategoriesTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore?.id]);

  return (
    <Chart
      type="bar"
      data={chartData}
      options={chartOptions}
      key={isLoading.toString()}
      className="w-full h-full"
      style={{
        height: "100%",
        width: "90vw",
      }}
    />
  );
}

function getOpaqueColors(): string[] {
  return COLORS.map((cor) => cor.replace(/1\)$/, "0.3)"));
}
