"use client";
import { useUser } from "@/context/user";
import { useEffect } from "react";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/navigation/sidebar"), {
  ssr: false,
});
const Topbar = dynamic(() => import("@/components/navigation/topbar"), {
  ssr: false,
});
const ImportModal = dynamic(() => import("@/components/import/modal"), {
  ssr: false,
});
const ContentContainer = dynamic(
  () => import("@/components/container/content"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useUser();

  useEffect(() => {
    if (!isAuth()) {
      window.location.href = "/login";
    }
  }, [isAuth]);

  return (
    <section>
      <Topbar />
      <Sidebar />
      <ContentContainer>{children}</ContentContainer>
      <ImportModal />
    </section>
  );
}
