'use client'
import dynamic from 'next/dynamic'

import NoData from '@/components/modules/noData'

const Lines = dynamic(() => import('@/components/modules/products/charts/lines'), { ssr: false })
const Doughnut = dynamic(() => import('@/components/modules/products/charts/doughnut'), { ssr: false })
const Pie = dynamic(() => import('@/components/modules/products/charts/pie'), { ssr: false })


import InfoCards from '@/components/modules/products/infoCards'

const ProductsTable = dynamic(() => import('@/components/modules/products/table/dataTable'), { ssr: false })

import SoldProductsSection from '@/components/modules/products/sections/soldProducts'


export default function Grid() {
  return (
    <section className="grid nested-grid">

      <section className="w-full">
        <InfoCards />
      </section>

      <section className="col-12">
        <SoldProductsSection />
      </section>

      <section className="col-12">
        <ProductsTable />
      </section>

      <section className="col-12">
        <div className="grid">
          <span className="col-8">
            <Lines />
          </span>
          <span className="col-2">
            <Doughnut />
          </span>
          <span className="col-2">
            <Pie />
          </span>
        </div>
      </section>

    </section>
  )
} 