"use client";
import { Dict } from "@/utils/types/accessibility";

export const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export function handleGetChartLabels(
  period: string,
  startDate: Date,
  endDate: Date,
  dict: Dict
) {
  switch (period) {
    case "month":
      const labels = [];
      for (let i = startDate.getMonth(); i <= endDate.getMonth(); i++) {
        labels.push(dict.monthDict[months[i] as keyof typeof dict.monthDict]);
      }

      return labels.filter((item) => item !== undefined) as string[];
    case "day":
      const dayLabels = [];
      for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
        dayLabels.push(i.toString());
      }

      return dayLabels.filter((item) => item !== undefined) as string[];
    case "year":
      const yearLabels = [];
      for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i++) {
        yearLabels.push(i.toString());
      }

      return yearLabels.filter((item) => item !== undefined) as string[];
  }
}

export function getCalendarView(period: string) {
  switch (period) {
    case "day":
      return "date";
    case "month":
      return "month";
    case "year":
      return "year";
    default:
      return "month";
  }
}

export function calculateTotalSold(salesData: any[]): number {
  return salesData.reduce((acc: number, el: any) => acc + el.quantity, 0);
}

export const handleGetPeriodChartData = (
  period: string,
  data: { month?: number; day?: number; year?: number; quantity: number }[],
  startDate: Date,
  endDate: Date
) => {
  const resData = [];

  switch (period) {
    case "month":
      for (let i = startDate.getMonth() + 1; i <= endDate.getMonth() + 1; i++) {
        /* const monthData = data.find((item) => item?.month === i);
        resData.push(monthData?.quantity ?? 0); */

        const value = data.reduce((acc: number, el: any) => {
          if (el.month === i) return acc + el.quantity;
          else return acc;
        }, 0);

        resData.push(value ?? 0);
      }
      break;
    case "day":
      for (let i = startDate.getDate(); i <= endDate?.getDate(); i++) {
        const dayData = data.find((item) => item?.day === i);
        resData.push(dayData?.quantity ?? 0);
      }
      break;
    case "year":
      for (let i = startDate.getFullYear(); i <= endDate.getFullYear(); i++) {
        const yearData = data.find((item) => item?.year === i);
        resData.push(yearData?.quantity ?? 0);
      }
      break;
  }

  return resData;
};
