"use client";
import dynamic from "next/dynamic";

import InfoCards from "@/components/modules/products/infoCards";

const ProductsTable = dynamic(
  () => import("@/components/modules/products/sections/ProductsTable"),
  { ssr: false }
);
const SoldProductsSection = dynamic(
  () => import("@/components/modules/products/sections/mostSoldProducts"),
  { ssr: false }
);
const CategoriesSection = dynamic(
  () => import("@/components/modules/products/sections/categories"),
  { ssr: false }
);

export default function Grid() {
  return (
    <section className="flex flex-column">
      <InfoCards />

      <SoldProductsSection />

      <ProductsTable />

      <CategoriesSection />
    </section>
  );
}
