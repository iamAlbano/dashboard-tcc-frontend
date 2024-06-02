import dynamic from "next/dynamic";

import ModuleHeader from "@/components/modules/header";
import BestProfitProducts from "@/components/modules/products/bestProfitProducts";
import InfoCards from "@/components/modules/sales/infoCards";
import ProductsSoldTogether from "@/components/modules/sales/productsSoldTogether";
import SalesByPeriodSection from "@/components/modules/sales/salesByPeriod";
const Panel = dynamic(() => import("@/components/container/panel"), {
  ssr: false,
});
const BreadCrumbs = dynamic(
  () => import("@/components/navigation/breadcrumbs"),
  { ssr: false }
);

import SalesTableSection from "@/components/modules/sales/salesTable";

export default function Home() {
  return (
    <section className="flex flex-column h-full w-full gap-2 lg:p-2 xl:p-4">
      <BreadCrumbs />
      <Panel>
        <section className="flex flex-column lg:px-4 xl:px-6">
          <ModuleHeader module="sales" />

          <InfoCards />

          <SalesTableSection />

          <BestProfitProducts />

          <SalesByPeriodSection />

          <ProductsSoldTogether />
        </section>
      </Panel>
    </section>
  );
}
