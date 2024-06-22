"use client";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import { formatToCurrency } from "@/utils/functions/helpers";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const Card = dynamic(() => import("@/components/modules/card/info"), {
  ssr: false,
});

import api from "@/server/api";

export default function InfoCards() {
  const { resume, setResume } = useProduct();
  const { selectedStore } = useStore();
  const { getDict } = useAccessibility();
  const dict = getDict();

  async function getProductsResume() {
    if (!selectedStore?.id) return;

    const { data } = await api.getCustomersResume(selectedStore?.id);

    const template = [...resumeTemplate];

    template[0].value = data?.stats?.total_customers ?? 0;
    template[1].value = data?.stats?.total_buyers_this_month ?? 0;
    template[2].value = data?.stats?.average_spent
      ? formatToCurrency(data?.stats?.average_spent)
      : "-";
    template[3].value = data?.stats?.average_age ?? "-";

    setResume(template);
  }

  useEffect(() => {
    getProductsResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  const resumeTemplate = [
    {
      title: "Clientes cadastrados",
      color: "rgba(15, 67,138,0.2)",
      icon: "pi pi-users",
      percentage: 0,
      value: 0,
    },
    {
      title: "Compradores este mês",
      color: "rgba(255,167,38,0.2)",
      icon: "pi pi-shopping-cart",
      percentage: 0,
      value: 0,
    },
    {
      title: "Gasto médio por cliente",
      color: "rgba(25,167,38,0.2)",
      icon: "pi pi-dollar",
      percentage: 0,
      value: "-",
    },
    {
      title: "Faixa etária média",
      color: "rgba(235,67,238,0.2)",
      icon: "pi pi-calendar",
      percentage: 0,
      value: 0,
    },
  ];

  return (
    <div className="flex flex-row justify-content-start flex-wrap py-3">
      {resume.map((info, index) => {
        return (
          <div className="w-3 pr-3" key={index}>
            <Card
              color={info.color}
              className="flex flex-row align-items-center justify-content-between p-3"
            >
              <div className="flex flex-column">
                <span className="text-3xl">{info.value}</span>
                <span className="text-sm">{info.title}</span>
              </div>
              <div className="flex flex-row gap-3 align-items-center">
                {info?.percentage > 0 ||
                  (info?.percentage < 0 && (
                    <span
                      className={`
                    desktop flex-row align-items-center justify-content-center 
                    p-2 border-round font-bold text-xl 
                    ${info.percentage > 0 ? "text-green-700" : "text-red-700"}
                  `}
                    >
                      {info.percentage > 0 ? "+" : ""}
                      {info.percentage}%
                    </span>
                  ))}

                <i className={`desktop ${info.icon} text-2xl`} />
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
