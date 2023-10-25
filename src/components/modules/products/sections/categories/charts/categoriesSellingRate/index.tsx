import React, { useState, useEffect } from "react"
import { Chart } from "primereact/chart"

export default function DoughnutChartDemo() {
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement)
    const data = {
      labels: ["Vestuário", "Acessórios", "Sapatos", "Outros"],
      datasets: [
        {
          data: [305, 53, 120, 23],
          backgroundColor: [
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--blue-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--blue-400"),
          ],
        },
      ],
    }
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
        }
      },
    }

    setChartData(data)
    setChartOptions(options)
  }, [])

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="doughnut"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-23rem"
      />
    </div>
  )
}
