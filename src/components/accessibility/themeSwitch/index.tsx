"use client";

import { useAccessibility } from "@/context/accessibility";

import { ToggleButton } from "primereact/togglebutton";

export default function ThemeSwitch() {
  const { theme, setTheme } = useAccessibility();

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark-theme");
  };

  return (
    <ToggleButton
      aria-label="Toggle Dark Mode"
      checked={theme === "dark"}
      onIcon="pi pi-moon"
      offIcon="pi pi-sun"
      onLabel=""
      offLabel=""
      className="h-full w-3"
      onChange={handleToggleTheme}
    />
  );
}
