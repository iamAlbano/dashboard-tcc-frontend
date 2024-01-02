"use client";
import LoginForm from "@/components/auth/login/form";
import { useAccessibility } from "@/context/accessibility";
import dynamic from "next/dynamic";

import Link from "next/link";

const ThemeSwitch = dynamic(
  () => import("@/components/accessibility/themeSwitch"),
  { ssr: false }
);
const LanguageSelect = dynamic(
  () => import("@/components/accessibility/languageSelect"),
  { ssr: false }
);

export default function Login() {
  const { theme, getDict } = useAccessibility();
  const dict = getDict();

  return (
    <section
      className={`flex flex-column justify-content-center align-items-center h-screen w-full 
      ${theme === "dark" ? "bg-gray-900" : "bg-primary"}
      `}
    >
      <div
        className={`w-10 lg:w-6 p-3 rounded-lg shadow-lg border-none shadow-5 border-round ${
          theme === "dark" ? "dark-surface" : "bg-white"
        } `}
      >
        <span className="flex flex-row w-full justify-content-between align-items-center">
          <h1 className="text-center text-primary">Login</h1>
          {/* <div className="flex flex-row justify-content-end align-items-center">
            <ThemeSwitch />
            <LanguageSelect />
          </div> */}
        </span>
        <LoginForm className="gap-2" />
        <span className="flex flex-row align-items-center justify-content-center py-3">
          <p className="text-gray-700 mr-2">{dict.auth.dontHaveAccount}</p>
          <Link href="/signup">{dict.auth.signup}</Link>
        </span>
      </div>
    </section>
  );
}
