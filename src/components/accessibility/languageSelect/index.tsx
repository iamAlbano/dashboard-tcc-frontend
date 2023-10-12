import React, { useState } from "react"
import style from "./style.module.sass"
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"

import { useAccessibility } from "@/context/accessibility"

import { Option } from '@/utils/types/globals'

export default function LanguageSelect() {
  
  const { language, languages, setLanguage } = useAccessibility()

  const handleSetLanguage = (language: any) => {
    setLanguage(language)
  }

  const selectedLanguageTemplate = (option: any) => {
    if (option) {
      return (
        <span className="overflow-visible">
          {
            option.value === 'pt'
            ? <img src="https://cdn-icons-png.flaticon.com/512/197/197386.png" width="43" height="43" alt="Português" />
            : <img src="https://cdn-icons-png.flaticon.com/512/8363/8363075.png" width="43" height="43" alt="English" />
          }
        </span>
      )
    }
  }

  const languageTemplate = (option: Option) => {
    return (
      <div>{option.label}</div>
    )
  }

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
  )
}
