import Layout from '@/app/layout'

import dynamic from 'next/dynamic'
const Sidebar = dynamic(() =>import('@/components/navigation/sidebar'), { ssr: false })
const Topbar = dynamic(() => import('@/components/navigation/topbar'), { ssr: false })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Topbar />
      <Sidebar />
      { children }
    </section>
  )
}