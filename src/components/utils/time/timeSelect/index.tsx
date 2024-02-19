"use client";

import { useAccessibility } from "@/context/accessibility";

import { Period } from "@/utils/types/globals";
import { endOfMonth, startOfMonth } from "date-fns";
import { addLocale } from "primereact/api";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { useState } from "react";

const getFormat = {
  day: "dd",
  week: "DD",
  month: "MM",
  year: "yy",
};

type TimeSelectProps = {
  value: Nullable<(Date | null)[]> | null;
  onChange: (e: any) => void;
  selectionMode?: "single" | "range";
  view?: "month" | "year" | "date" | undefined;
  dateFormat?: Period;
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
};

export default function TimeSelect({ ...props }: TimeSelectProps) {
  const { language } = useAccessibility();

  const [dates, setDates] = useState<Nullable<(Date | null)[]>>(
    props?.value ?? null
  );

  addLocale("pt", {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ],
    dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
    monthNames: [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ],
    monthNamesShort: [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "sep",
      "out",
      "nov",
      "dez",
    ],
    today: "Hoje",
    clear: "Limpar",
  });

  const handleChange = (e: any) => {
    setDates(e.value);

    if (!e.value[1]) return;

    let startDate = e.value[0];
    let endDate = e.value[1];
    if (props.view === "month") {
      startDate = startOfMonth(e.value[0]);
      startDate.setHours(0, 0, 0, 0);
      endDate = endOfMonth(e.value[1]);
    } else if (props.view === "year" && e.value[1]) {
      endDate = new Date(e.value[1].getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    e.value[0] = startDate;
    e.value[1] = endDate;
    props.onChange(e);
  };

  return (
    <Calendar
      value={dates}
      onChange={(e: any) => handleChange(e)}
      selectionMode="range"
      className={`bg-white ${props.className}`}
      view={props.view ?? undefined}
      dateFormat={getFormat[props.dateFormat ?? "month"]}
      showIcon={props.showIcon ?? false}
      locale={language}
      disabled={props.disabled ?? false}
    />
  );
}
