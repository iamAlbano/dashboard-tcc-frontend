import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

export default function ProfitProductsChart() {
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
      labels: [
        "brinquedos",
        "eletrodomesticos",
        "moveis_decoracao",
        "instrumentos_musicais",
      ],
      datasets: [
        {
          type: "bar",
          label: "Gasto de compra",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          data: [20, 10, 8, 14],
        },
        {
          type: "bar",
          label: "Valor total de vendas",
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          data: [37, 27, 19, 15],
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: "index",
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          stacked: true,
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
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
