'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useDebounce } from 'primereact/hooks'
import { useAccessibility } from '@/context/accessibility'

import { Nullable } from "primereact/ts-helpers"
import { Period } from "@/utils/types/globals"

import DataAccordion from '@/components/modules/dataAccordion'
import MostSoldCategories from './charts/mostSoldCategories'

const PeriodSelect = dynamic(() => import('@/components/utils/time/periodSelect'), { ssr: false })
const TimeSelect = dynamic(() => import('@/components/utils/time/timeSelect'), { ssr: false })
const SellingRate = dynamic(() => import('./charts/categoriesSellingRate'), { ssr: false })
const TotalCategories = dynamic(() => import('./charts/totalCategories'), { ssr: false })

import { InputText } from "primereact/inputtext"

export default function CategoriesSection() {

  const { getDict } = useAccessibility()
  const dict = getDict()

  const [search, debouncedSearch, setSearch] = useDebounce('', 1000)
  const [period, setPeriod] = useState<Period | null>('month')
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([new Date('01/01/2023'), new Date('07/07/2023')])

  function getCalendarView() {
    switch (period) {
      case 'day': return 'date'
      case 'month': return 'month'
      case 'year': return 'year'
      default: return 'month'
    }
  }

  return (
    <DataAccordion
      title={ dict.productsDict.categoriesSection.title }
      icon="pi pi-tag"
    >
      <section className="flex flex-column gap-2">

        <span className="flex flex-row gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText 
              placeholder="Pesquisar categorias" 
              onChange={(e) => setSearch(e.target.value) }
            />
          </span>
          <PeriodSelect 
            value={period} 
            onChange={(e) => setPeriod(e.value)}
          />
          <TimeSelect 
            value={dates} 
            onChange={(e) => setDates(e.value) } 
            dateFormat={period ?? 'month'} 
            view={ getCalendarView() }
            showIcon 
            key={period}
          />
        </span>

        <section className="flex flex-row">
          <section className="w-9">
            <MostSoldCategories />
          </section>
          <div className="flex flex-column w-3 gap-2">
            <SellingRate />
            <TotalCategories />
          </div>
        </section>

      </section>
    </DataAccordion>
  )
}
  