"use client";
import Image from "next/image";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import style from "./style.module.sass";

import { useAccessibility } from "@/context/accessibility";

import { Option } from "@/utils/types/globals";

export default function LanguageSelect() {
  const { language, languages, setLanguage } = useAccessibility();

  const handleSetLanguage = (language: any) => {
    setLanguage(language);
  };

  const selectedLanguageTemplate = (option: any) => {
    if (option) {
      return (
        <span className="overflow-visible">
          {option.value === "pt" ? (
            <Image
              src="/icons/brazil.png"
              width="43"
              height="43"
              alt="Português"
            />
          ) : (
            <Image src="/icons/uk.png" width="43" height="43" alt="English" />
          )}
        </span>
      );
    }
  };

  const languageTemplate = (option: Option) => {
    return <div>{option.label}</div>;
  };

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={language}
        onChange={(e: DropdownChangeEvent) => handleSetLanguage(e.value)}
        options={languages}
        valueTemplate={selectedLanguageTemplate}
        itemTemplate={languageTemplate}
        className={`border-none ${style.dropdown}`}
      />
    </div>
  );
}
