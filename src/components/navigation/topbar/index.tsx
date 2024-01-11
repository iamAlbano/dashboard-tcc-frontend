"use client";
import dynamic from "next/dynamic";
import styles from "./style.module.sass";

import { useAccessibility } from "@/context/accessibility";
import { useImport } from "@/context/import";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";

import { Button } from "primereact/button";

const Search = dynamic(() => import("@/components/utils/search"), {
  ssr: false,
});
const Avatar = dynamic(() => import("@/components/user/info"), { ssr: false });
const ThemeSwitch = dynamic(
  () => import("@/components/accessibility/themeSwitch"),
  { ssr: false }
);
const LanguageSelect = dynamic(
  () => import("@/components/accessibility/languageSelect"),
  { ssr: false }
);
const SelectStore = dynamic(
  () => import("@/components/utils/store/select/select-store"),
  {
    ssr: false,
  }
);

export default function Topbar() {
  const router = useRouter();
  const { logout } = useUser();
  const { theme, openedSidebar } = useAccessibility();
  const { isUploading } = useImport();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav
      className={`
      ${styles.nav}
      ${theme === "dark" ? "dark-surface" : "light-surface"}
    `}
    >
      <span
        className={`
        ${openedSidebar ? styles.margin200 : styles.margin70}
      `}
      >
        {/* <Search /> */}
      </span>
      <span
        className={`
        ${styles.dataContainer}
      `}
      >
        {isUploading && (
          <>
            Uploading...
            <i className="pi pi-cloud-upload fadein animation-duration-1000 animation-iteration-infinite mr-4 text-xl text-blue-500" />
          </>
        )}
        <Avatar />
        <SelectStore />
        {/* <LanguageSelect />
        <ThemeSwitch /> */}
        <Button icon="pi pi-sign-out" onClick={handleLogout} text rounded />
      </span>
    </nav>
  );
}
