import dynamic from 'next/dynamic'

const Panel = dynamic(() => import('@/components/container/panel'), { ssr: false })
const BreadCrumbs = dynamic(() => import('@/components/navigation/breadcrumbs'), { ssr: false })

export default function Home() {
	return (
		<section className="flex flex-column h-full w-full gap-2">
			<BreadCrumbs />
			<Panel>
				<h1>Dashboard</h1>
			</Panel>
		</section>
	)
}