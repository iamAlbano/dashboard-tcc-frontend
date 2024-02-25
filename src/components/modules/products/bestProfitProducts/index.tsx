"use client";

import { useStore } from "@/context/store";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";

import { Period } from "@/utils/types/globals";
import { Nullable } from "primereact/ts-helpers";

import PeriodSelect from "@/components/utils/time/periodSelect";
import TimeSelect from "@/components/utils/time/timeSelect";
import { InputText } from "primereact/inputtext";

import DataAccordion from "@/components/modules/dataAccordion";
import ProfitProductsChart from "./chart";

import { getCalendarView } from "@/components/utils/chartFunctions";
import api from "@/server/api";
import { ProgressSpinner } from "primereact/progressspinner";

export default function BestProfitProducts() {
  const { selectedStore } = useStore();
  const [loading, setLoading] = useState(false);

  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [period, setPeriod] = useState<Period | null>("month");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date("01/01/2023"), // format: mm/dd/yyyy
    new Date("12/31/2023"),
  ]);

  async function getMostProfitableProducts() {
    const { data } = await api.getMostProfitableProducts();
  }

  useEffect(() => {
    getMostProfitableProducts();
  }, [selectedStore]);

  return (
    <DataAccordion title="Produtos com maior lucro" icon="pi pi-shopping-cart">
      <section className="flex flex-column gap-2">
        <div className="flex flex-row gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              placeholder="Pesquisar produtos"
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
          <PeriodSelect
            value={period}
            onChange={(e) => setPeriod(e.value)}
            disabled={loading}
          />
          <TimeSelect
            value={dates}
            onChange={(e) => setDates(e.value)}
            dateFormat={period ?? "month"}
            view={getCalendarView(period ?? "month")}
            disabled={loading}
            showIcon
            key={period}
          />
        </div>
        {loading && (
          <div className="flex flex-row align-items-center w-full p-4">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          </div>
        )}
        {!loading && <ProfitProductsChart />}
      </section>
    </DataAccordion>
  );
}
