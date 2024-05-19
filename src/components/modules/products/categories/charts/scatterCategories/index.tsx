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

export default function ScatterCategoriesChart({
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
        totalProducts: category.total,
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
      labels: orderedChartData.map((category) => `${category.category}%`),
      datasets: orderedChartData.map((selling, index) => {
        return {
          label: selling.category,
          data: [
            {
              x: selling.totalProducts,
              y: selling.percentage,
            },
          ],
          backgroundColor: getOpaqueColors()[index],
          borderColor: COLORS[index],
          borderWidth: 1,
        };
      }),
    };
    const options = {
      type: "scatter",
      data: data,
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
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
    <div className="flex flex-column gap-4">
      <Chart
        type="scatter"
        data={chartData}
        options={chartOptions}
        key={isLoading.toString()}
        className="w-full h-full"
        style={{
          height: "100vh",
          width: "90vw",
        }}
      />
      <div className="flex flex-row gap-4 justify-content-center">
        <span className="text-sm">
          Eixo X: Quantidade de produtos cadastrados na categoria
        </span>
        <span className="text-sm">Eixo Y: Porcentagem total vendas</span>
      </div>
    </div>
  );
}

function getOpaqueColors(): string[] {
  return COLORS.map((cor) => cor.replace(/1\)$/, "0.4)"));
}
