import { useState } from "react"
import dynamic from 'next/dynamic'

const Panel = dynamic(() => import('@/components/container/panel'), { ssr: false })
const BreadCrumbs = dynamic(() => import('@/components/navigation/breadcrumbs'), { ssr: false })
import ModuleHeader from '@/components/modules/header'
import Grid from '@/components/modules/products/grid'

export default function Home() {

	return (
		<section className="flex flex-column h-full w-full gap-2">
			<BreadCrumbs />
			<Panel>
				<ModuleHeader 
					module="products"
				/>
				<Grid />
			</Panel>
		</section>
	)
}