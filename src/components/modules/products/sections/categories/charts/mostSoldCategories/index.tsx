import { useState, useEffect } from "react"
import { Chart } from "primereact/chart"

type IProps = {
  search?: string
  dates?: (Date | null)[]
}

export default function MostSoldProductsChart({ ...props }: IProps){
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})

  const auxData =  [
    {
      type: "line",
      label: "Sapatos",
      borderColor: 'rgba(235, 19, 32, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      data: [50, 25, 12, 48, 56, 76, 42],
    },
    {
      type: "line",
      label: "Acessórios",
      borderColor: 'rgba(54, 162, 35, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      data: [30, 15, 17, 48, 16, 46, 62],
    },
    {
      type: "line",
      label: "Vestuário",
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      data: [10, 25, 7, 8, 36, 26, 22],
    }
  ]

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue("--text-color")
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    )
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border")

    const data = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
      datasets: [
        ...auxData.filter((lineData) => lineData.label.toLowerCase().includes(props.search?.toLowerCase() ?? '')),
        {
          type: "bar",
          label: "Total de produtos vendidos",
          backgroundColor: documentStyle.getPropertyValue("--blue-300"),
          data: [61, 84, 84, 75, 97, 95, 84],
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    }

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      responsive: true,
      plugins: {
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'legend-container',
        },
        legend: {
          position: "top",
          font: {
            size: 18,
          },
          labels: {
            color: textColor,
          },
        }
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
    }

    setChartData(data)
    setChartOptions(options)
  }, [])

  return (
    <Chart 
      type="line" 
      aria-label="most sold products by period"
      data={chartData} 
      options={chartOptions} 
      className="w-full h-full"
    />
  )
}
