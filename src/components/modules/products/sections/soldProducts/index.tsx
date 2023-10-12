'use client'
import { useState } from 'react'
import { useDebounce } from 'primereact/hooks'
import dynamic from "next/dynamic"

import { Nullable } from "primereact/ts-helpers"

import { useAccessibility } from '@/context/accessibility'

import { Period } from "@/utils/types/globals"

import DataView from '@/components/modules/products/table/dataView'
import DataContainer from '@/components/modules/products/dataAccordion'
import PeriodSelect from '@/components/utils/periodSelect'
const SoldProductsChart = dynamic(() => import('@/components/modules/products/charts/soldProducts'), { ssr: false })

import { Calendar } from 'primereact/calendar'
import { InputText } from "primereact/inputtext"

export default function SoldProductsSection() {
  
  const { getDict, theme } = useAccessibility()
  const dict = getDict()
  
  const [search, debouncedSearch, setSearch] = useDebounce('', 1000)
  const [period, setPeriod] = useState<Period | null>('day')
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([new Date(), new Date()])

  return (
    <DataContainer
      title={ dict.productsDict.soldProducts.title }
      icon="pi pi-shopping-cart"
    >
      <section className="grid">
        <span className="flex flex-row flex-wrap gap-2 col-12">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText 
              placeholder="Pesquisar produtos" 
              onChange={(e) => setSearch(e.target.value) }
            />
          </span>
          <PeriodSelect 
            value={period} 
            onChange={(e) => setPeriod(e.value)}
          />
          <Calendar value={dates} onChange={(e) => setDates(e.value) } selectionMode="range" showIcon />
        </span>

        <div className="flex flex-row">
          <span className="col-8">
            <SoldProductsChart 
              key={debouncedSearch} 
              search={debouncedSearch.length > 3 ? debouncedSearch : undefined}
            />
          </span>
          <span className="col-4">
            <DataView />
          </span>
        </div>

      </section>
    </DataContainer>
  )
}
