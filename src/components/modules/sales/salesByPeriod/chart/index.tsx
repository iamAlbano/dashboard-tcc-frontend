import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

export type chartData = {
  type: "line" | "bar";
  label: string;
  borderColor: string;
  borderWidth: number;
  fill: boolean;
  tension: number;
  data: number[];
};

type SellingsChartProps = {
  dates?: (Date | null)[];
  data: chartData[];
  chartLabels?: string[];
  totalSoldData?: number[];
};

export default function MostSoldProductsChart({
  ...props
}: SellingsChartProps) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels: props.chartLabels,
      datasets: [...props.data],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      responsive: true,
      plugins: {
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: "legend-container",
        },
        legend: {
          position: "top",
          font: {
            size: 18,
          },
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card">
      <Chart
        type="line"
        aria-label="most sold products by period"
        data={chartData}
        options={chartOptions}
        unstyled
      />
    </div>
  );
}
