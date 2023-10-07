'use client'
import { useState } from "react"
import dynamic from 'next/dynamic'
import style from './style.module.sass'

import { useAccessibility } from '@/context/accessibility'
import getMenu from './menu'

const Option = dynamic(() => import('./Option'))
const LockSidebar = dynamic(() => import('@/components/accessibility/lockSidebar'))

export default function BasicDemo() {
	const { theme, lockSidebar } = useAccessibility()
	const menu = getMenu()
  const [isHovered, setIsHovered] = useState<boolean|null>(null) // null is the initial state without animation
	const [opened, setOpened] = useState<string|null>(null)

  return (
    <nav
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)} 
			className={`
				${style.sidebar} 
				${(isHovered === true || lockSidebar ) && style.open}
				${(isHovered === false && !lockSidebar) && style.close}
				${theme === 'dark' ? 'dark-surface' : 'light-surface'}
			`}
    >
			<div className={style.title}>
				<h2>
					Dashboard
				</h2>
				<LockSidebar />
			</div>
      <ul>
				{
					menu.map((option, index) => (
						<li key={index}>
							<Option 
								label={option.label}
								icon={option.icon}
								className={style.option}
								iconPos="right"
								onClick={() => setOpened(!option?.label || opened === option.label ? null : option.label)}
								text={opened !== option.label}
								size={ !isHovered && !lockSidebar ? 'large' : undefined}
							>
								<ul 
									className={style.submenu}>
									{
										(opened === option.label && option.items) && option.items.map((item, index) => (
											<li key={index}>
												<Option 
													label={item.label}
													icon={item.icon}
													className={style.option}
													iconPos="right"
													size={ !isHovered && !lockSidebar ? 'large' : undefined}
													text
												/>
											</li>
										))
									}
								</ul>
							</Option>
						</li>
					))
				}
      </ul>
    </nav>
  )
}
