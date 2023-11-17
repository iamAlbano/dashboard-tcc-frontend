"use client";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

import { Period } from "@/utils/types/globals";
import { Nullable } from "primereact/ts-helpers";

import { useAccessibility } from "@/context/accessibility";

import DataAccordion from "@/components/modules/dataAccordion";
import PeriodSelect from "@/components/utils/time/periodSelect";
import TimeSelect from "@/components/utils/time/timeSelect";

const ProductsList = dynamic(() => import("./table"), { ssr: false });
const MostSoldProductsChart = dynamic(() => import("./chart"), { ssr: false });

import { InputText } from "primereact/inputtext";

export default function MostSoldProductsSection() {
  const { getDict, theme } = useAccessibility();
  const dict = getDict();

  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"),
    new Date("07/07/2023"),
  ]);

  function getCalendarView() {
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

  return (
    <DataAccordion
      title={dict.productsDict.soldProducts.title}
      icon="pi pi-shopping-cart"
    >
      <section className="flex flex-column gap-2">
        <span className="flex flex-row gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Pesquisar produtos"
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
          <PeriodSelect value={period} onChange={(e) => setPeriod(e.value)} />
          <TimeSelect
            value={dates}
            onChange={(e) => setDates(e.value)}
            dateFormat={period ?? "month"}
            view={getCalendarView()}
            showIcon
            key={period}
          />
        </span>

        <div className="flex flex-row w-full align-items-center">
          <span className="w-9">
            <MostSoldProductsChart
              key={debouncedSearch}
              search={debouncedSearch.length > 3 ? debouncedSearch : undefined}
            />
          </span>
          <span className="w-3">
            <ProductsList />
          </span>
        </div>
      </section>
    </DataAccordion>
  );
}
