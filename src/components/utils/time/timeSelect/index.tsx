"use client";

import { useAccessibility } from "@/context/accessibility";

import { Period } from "@/utils/types/globals";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

import { addLocale } from "primereact/api";

const getFormat = {
  day: "dd",
  week: "DD",
  month: "MM",
  year: "yy",
};

type IProps = {
  value: Nullable<(Date | null)[]> | null;
  onChange: (e: any) => void;
  selectionMode?: "single" | "range";
  view?: "month" | "year" | "date" | undefined;
  dateFormat?: Period;
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
};

export default function TimeSelect({ ...props }: IProps) {
  const { language } = useAccessibility();

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

  return (
    <Calendar
      value={props.value}
      onChange={(e: any) => props.onChange(e)}
      selectionMode="range"
      className={props.className}
      view={props.view ?? undefined}
      dateFormat={getFormat[props.dateFormat ?? "month"]}
      showIcon={props.showIcon ?? false}
      locale={language}
      disabled={props.disabled ?? false}
    />
  );
}
