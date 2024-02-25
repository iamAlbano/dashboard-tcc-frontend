import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import api from "@/server/api";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useEffect, useState } from "react";

type CategoriesFilterProps = {
  initialCategories?: string[];
  className?: string;
  onChange?: (categories: string[]) => void;
};

export default function CategoriesFilter({
  initialCategories,
  onChange,
  className,
}: CategoriesFilterProps) {
  const { categories, setCategories } = useProduct();
  const { selectedStore } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<string[] | null>(
    initialCategories ?? []
  );
  const [isLoading, setIsLoading] = useState(false);

  const options = categories;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedStore?.id) return;

      try {
        setIsLoading(true);
        const { data } = await api.getCategories(selectedStore?.id);
        const productCategories = data.categories
          .filter(Boolean)
          .map((c: string) => c.trim());

        setCategories(productCategories);
      } catch (error) {
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [selectedStore]);

  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        value={selectedCategories}
        onChange={(e: MultiSelectChangeEvent) => {
          setSelectedCategories(e.value);
          onChange?.(e.value);
        }}
        options={options}
        placeholder="Categoria"
        emptyMessage="Nenhuma categoria encontrada"
        emptyFilterMessage="Nenhuma categoria encontrada"
        className={className}
        disabled={isLoading}
        virtualScrollerOptions={{ itemSize: 50 }}
        filter
      />
    </div>
  );
}
