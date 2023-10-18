'use client'
import dynamic from 'next/dynamic'
import { useAccessibility } from '@/context/accessibility'

const Card = dynamic(() => import('@/components/modules/card/info'), { ssr: false })

export default function InfoCards() {

  const { getDict } = useAccessibility()
  const dict = getDict()

  const infos = [
    {
      title: dict?.productsDict?.cards?.products,
      color: 'rgba(15, 67,138,0.2)',
      icon: 'pi pi-box',
      percentage: 45,
      value: 30
    },
    {
      title: dict?.productsDict?.cards?.categories,
      color: 'rgba(255,167,38,0.2)',
      icon: 'pi pi-tags',
      percentage: -22,
      value: 10
    },
    {
      title: dict?.productsDict?.cards?.sold,
      color: 'rgba(25,167,38,0.2)',
      icon: 'pi pi-shopping-cart',
      percentage: 36,
      value: 20
    },
    {
      title: dict?.productsDict?.cards?.review,
      color: 'rgba(235,67,238,0.2)',
      icon: 'pi pi-star',
      percentage: 12,
      value: 4.6
    },
  ]

  return (
    <div className="flex flex-row justify-content-start flex-wrap py-3">
      {
        infos.map((info, index) => {
          return (
            <div className="w-3 pr-3" key={index}>
              <Card color={info.color} className="flex flex-row align-items-center justify-content-between p-3">
                <div className="flex flex-column">
                  <span className="text-3xl">{info.value}</span>
                  <span className="text-sm">{info.title}</span>
                </div>
                <div className="flex flex-row gap-3 align-items-center">

                  <span className={`
                    desktop flex-row align-items-center justify-content-center 
                    p-2 border-round font-bold text-xl 
                    ${info.percentage > 0 ? 'text-green-700' : 'text-red-700'}
                  `}>
                    {info.percentage > 0 ? '+' : ''}
                    {info.percentage}%
                  </span>

                  <i className={`desktop ${info.icon} text-4xl`} />
                </div>
              </Card>
            </div>
          )
        })
      }
    </div>
  )
}