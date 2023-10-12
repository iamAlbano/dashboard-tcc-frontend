'use client'
import { useState } from "react"
import { useAccessibility } from "@/context/accessibility"

import { Option, Period } from "@/utils/types/globals"

import { Dropdown, DropdownChangeEvent } from "primereact/dropdown"

type IProps = {
  value: Period | null
  onChange: (e: DropdownChangeEvent) => void
  className?: string
}

export default function PeriodSelect({ ...props }: IProps) {

  const { getDict } = useAccessibility()
  const dict = getDict()
 
  const times: Option[] = [
    { label: dict?.time?.day, value: "day" },
    { label: dict?.time?.week, value: "week" },
    { label: dict?.time?.month, value: "month" },
    { label: dict?.time?.year, value: "year" },
  ]

  return (
    <Dropdown
      value={props.value}
      onChange={(e: DropdownChangeEvent) => props.onChange(e)}
      options={times}
      optionLabel="label"
      style={{ backgroundColor: "transparent" }}
      className={props.className}
    />
  )
}
