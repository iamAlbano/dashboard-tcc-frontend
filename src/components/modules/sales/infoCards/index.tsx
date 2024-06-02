"use client";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
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

    const { data } = await api.getSalesResume(selectedStore?.id);

    const template = [...resumeTemplate];

    template[0].value = data?.resume?.total_quantity ?? 0;
    template[1].value = data?.resume?.total_price
      ? `R$ ${data?.resume?.total_price?.toFixed(2) ?? 0}`
      : 0;
    template[2].value = data?.resume?.month_average
      ? `R$ ${data?.resume?.month_average?.toFixed(2) ?? 0}`
      : 0;
    template[3].value = data?.resume?.sold_this_month ?? 0;

    setResume(template);
  }

  useEffect(() => {
    getProductsResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  type ResumeTemplate = {
    title: string;
    color: string;
    icon: string;
    percentage: number;
    value: number | string;
  }[];

  const resumeTemplate: ResumeTemplate = [
    {
      title: "Total de vendas",
      color: "rgba(15, 67,138,0.2)",
      icon: "pi pi-shopping-cart",
      percentage: 0,
      value: 0,
    },
    {
      title: "Valor total de vendas",
      color: "rgba(255,167,38,0.2)",
      icon: "pi pi-dollar",
      percentage: 0,
      value: 0,
    },
    {
      title: "Média de venda por mês",
      color: "rgba(25,167,38,0.2)",
      icon: "pi pi-calendar",
      percentage: 0,
      value: 0,
    },
    {
      title: dict?.productsDict?.cards?.sold,
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
                <span className="text-3xl whitespace-nowrap">{info.value}</span>
                <span className="text-sm">{info.title}</span>
              </div>
              <div className="flex flex-row gap-3 align-items-center">
                {info.percentage !== 0 && (
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
                )}

                <i className={`desktop ${info.icon} text-2xl`} />
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
