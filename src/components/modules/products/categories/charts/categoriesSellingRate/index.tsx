import { COLORS } from "@/utils/contants";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

type chartProps = {
  labels: string[];
  data: number[];
};

export default function DoughnutChartDemo({ ...props }: chartProps) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: props.labels,
      datasets: [
        {
          data: props.data,
          backgroundColor: props.labels?.map((_, index) => COLORS[index]),
          hoverBackgroundColor: props.labels?.map((_, index) => COLORS[index]),
        },
      ],
    };
    const options = {
      cutout: "60%",
      plugins: {
        legend: {
          display: false,
          labels: {
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: "Total de vendas por categoria",
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="doughnut"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-23rem"
      />
    </div>
  );
}
