'use client'

import { useAccessibility } from '@/context/accessibility'

import DataAccordion from '@/components/modules/dataAccordion'
import Table from './table'

export default function ProductsTableSection() {

  const { getDict } = useAccessibility()
  const dict = getDict()

  return (
    <DataAccordion
      title={ dict.productsDict.productsTable.title }
      icon="pi pi-box"
    >
      <Table />
    </DataAccordion>
  )
}
  