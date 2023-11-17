import Upload from "@/components/import/upload";
import { useAccessibility } from "@/context/accessibility";
import { ProductsColumnsType, useImport } from "@/context/import";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

export default function ImportModal() {
  const { getDict } = useAccessibility();
  const { productsColumns, selectedModule, setSelectedModule, productsFile } =
    useImport();

  const dict = getDict();

  const [columns, setColumns] = useState<ProductsColumnsType>(productsColumns);

  useEffect(() => {
    console.log(productsFile);
  }, [productsFile]);

  return (
    <section className="flex flex-column gap-3">
      <div className="flex flex-row flex-wrap gap-2">
        {Object.keys(columns).map((column) => {
          return (
            <div className="flex flex-column gap-1" key={column}>
              <label htmlFor="username">{column}</label>
              <InputText
                id={column}
                value={columns[column as keyof ProductsColumnsType]}
                aria-describedby={column}
              />
            </div>
          );
        })}
      </div>

      <Upload />
    </section>
  );
}
