import React, { useState, useEffect } from "react"
import { Chart } from "primereact/chart"

export default function PieChartDemo() {
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement)
    const data = {
      labels: ["Vestuário", "Acessórios", "Sapatos", "Outros"],
      datasets: [
        {
          data: [240, 50, 100, 27],
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
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: "Total de produtos em cada categoria",
        }
      },
    }

    setChartData(data)
    setChartOptions(options)
  }, [])

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-24rem"
      />
    </div>
  )
}
