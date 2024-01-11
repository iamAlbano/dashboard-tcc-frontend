import dynamic from "next/dynamic";

import ModuleHeader from "@/components/modules/header";
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
    <section className="flex flex-column h-full w-full gap-2">
      <BreadCrumbs />
      <Panel>
        <ModuleHeader module="sales" />
        <section className="flex flex-column">
          <InfoCards />
          <SalesTableSection />
          <SalesByPeriodSection />
          <ProductsSoldTogether />
        </section>
      </Panel>
    </section>
  );
}
