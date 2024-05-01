"use client";
import { notify } from "@/components/utils/toast";
import { useCustomer } from "@/context/customer";
import { useStore } from "@/context/store";
import { useEffect, useState } from "react";

import StatesMap, {
  StateObject,
} from "@/components/modules/customers/mostPopularPlaces/statesMap";
import DataAccordion from "@/components/modules/dataAccordion";
import { ProgressSpinner } from "primereact/progressspinner";

export default function MostPopularPlaces() {
  const { selectedStore } = useStore();
  const { getCustomersStates } = useCustomer();

  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getStates() {
    if (!selectedStore?.id) return;

    setLoading(true);
    try {
      const res = await getCustomersStates(selectedStore?.id);
      if (!res?.states) return;

      const customerStates: StateObject[] = [];

      res.states.forEach((state: any) => {
        customerStates.push({
          name: state.state,
          value: state.total,
        });
      });

      setStates(customerStates);
    } catch (error) {
      notify("Erro ao buscar dados dos clientes", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  return (
    <DataAccordion title="Estados" icon="pi pi-map-marker">
      <>
        {loading && (
          <div className="flex justify-center items-center">
            <ProgressSpinner />
          </div>
        )}

        {!loading && states.length > 0 && (
          <section className="flex flex-row gap-4">
            <div className="w-8">
              <StatesMap states={states} />
            </div>
            <div className="w-9 max-h-30rem overflow-auto w-full">
              <table>
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Quantidade Total de Clientes</th>
                  </tr>
                </thead>
                <tbody>
                  {states
                    .sort((a, b) => b.value - a.value)
                    .map((state) => (
                      <tr key={state.name}>
                        <td>{state.name}:</td>
                        <td>{state.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {!loading && states.length === 0 && (
          <div className="flex justify-content-center w-full">
            <p>Não há dados para serem exibidos</p>
          </div>
        )}
      </>
    </DataAccordion>
  );
}
