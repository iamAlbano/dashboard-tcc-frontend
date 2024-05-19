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

  const totalSales = totalSellingsByCategory.reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  const totalProducts = totalSellingsByCategory.reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  const handleSetChartData = (categoriesData: CategoryData[]) => {
    const chartData = categoriesData.map((category) => {
      const totalCategorySales =
        totalSellingsByCategory.find(
          (selling) => selling.category === category.category
        )?.total ?? 0;

      return {
        category: category.category,
        totalProducts: totalProducts,
        totalSales: totalCategorySales,
        percentage: (totalCategorySales * 100) / totalSales,
      };
    });

    function orderByPercentage(
      a: (typeof chartData)[number],
      b: (typeof chartData)[number]
    ): number {
      if (a.percentage < b.percentage) {
        return 1;
      } else if (a.percentage > b.percentage) {
        return -1;
      } else {
        return 0;
      }
    }

    const orderedChartData = chartData
      .sort(orderByPercentage)
      .filter((data) => data.percentage > 0)
      .slice(0, 5);

    const data = {
      labels: orderedChartData.map((category) => category.category),
      datasets: [
        {
          label: "% total de vendas",
          data: orderedChartData.map((selling) => selling.percentage),
          backgroundColor: COLORS,
          borderColor: getOpaqueColors,
          borderWidth: 1,
        },
        {
          label: "Quantidade de produtos cadastrados na categoria",
          data: orderedChartData.map((category) => category.totalProducts),
          backgroundColor: getOpaqueColors,
          borderColor: COLORS,
          borderWidth: 1,
        },
      ],
    };
    const options = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      scales: {
        y: {
          beginAtZero: true,
          font: {
            weight: 900,
          },
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
        height: "100vh",
        width: "90vw",
      }}
    />
  );
}

function getOpaqueColors(): string[] {
  return COLORS.map((cor) => cor.replace(/1\)$/, "0.4)"));
}
