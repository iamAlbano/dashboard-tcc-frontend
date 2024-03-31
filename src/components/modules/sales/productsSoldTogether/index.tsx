"use client";
import { useStore } from "@/context/store";
import api from "@/server/api";
import { useEffect, useState } from "react";

import DataAccordion from "@/components/modules/dataAccordion";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ProductsSoldTogether() {
  const { selectedStore } = useStore();

  const [loading, setLoading] = useState(false);
  const [productsSoldTogether, setProductsSoldTogether] = useState<
    {
      products: any[];
      count: number;
    }[]
  >([]);

  useEffect(() => {
    async function getProductsSoldTogether() {
      if (!selectedStore?.id) return;
      try {
        setLoading(true);
        const { data } = await api.getTopProductsSoldTogether(
          selectedStore?.id
        );

        setProductsSoldTogether(data.sales);
      } catch (err) {
        setProductsSoldTogether([]);
      } finally {
        setLoading(false);
      }
    }
    getProductsSoldTogether();
  }, [selectedStore?.id]);

  return (
    <DataAccordion title="Carrinhos de compras mais repetidas" icon="pi pi-box">
      <>
        {loading && (
          <div className="flex flex-row justify-center items-center">
            <ProgressSpinner />
          </div>
        )}
        {!loading && productsSoldTogether.length === 0 && (
          <div className="flex flex-row justify-center items-center">
            <p>Nenhum dado a ser exibido.</p>
          </div>
        )}
        {!loading && productsSoldTogether.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Produtos</th>
                <th>Quantidade de vendas</th>
              </tr>
            </thead>
            <tbody>
              {productsSoldTogether.map((sale, index) => (
                <tr key={index}>
                  <td>
                    {sale.products.map((product) => product.name).join(", ")}
                  </td>
                  <td>{sale.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    </DataAccordion>
  );
}
