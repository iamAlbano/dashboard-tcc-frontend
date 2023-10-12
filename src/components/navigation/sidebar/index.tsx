'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { usePathname  } from 'next/navigation'
import dynamic from 'next/dynamic'
import style from './style.module.sass'

import {menuOption, getMenu } from './menu'
import { useAccessibility } from '@/context/accessibility'

const Option = dynamic(() => import('./Option'))
const LockSidebar = dynamic(() => import('@/components/accessibility/lockSidebar'))

export default function BasicDemo() {

	const menu = getMenu()
	const router = useRouter()
	const pathname = usePathname()
	const { theme, lockSidebar, openedSidebar, setOpenedSidebar } = useAccessibility()
  const [isHovered, setIsHovered] = useState<boolean|null>(null) // null is the initial state without animation
	const [opened, setOpened] = useState<string|null>(null)

	const handleSetOpenedSidebar = (opened: boolean) => {
		if (lockSidebar) return
		
		setIsHovered(opened)
		setOpenedSidebar(opened)
	}

	function handleClick (option: menuOption) {
		if (option?.route) 
			return router.push(option.route)
		
		if (option?.items?.length)
			setOpened(!option?.label || opened === option.label ? null : option.label)
	}

	function isSelected (option: menuOption): boolean {
		if (option?.route) 
			return option?.route !== '/dashboard'
				? pathname.includes(option.route)
				: pathname === option.route

		if (option?.items?.length)
			return opened === option.label

		return false
	}

  return (
    <nav
			onMouseEnter={() => handleSetOpenedSidebar(true)}
			onMouseLeave={() => handleSetOpenedSidebar(false)} 
			className={`
				${style.sidebar} 
				${(isHovered === true || lockSidebar ) && style.open}
				${(isHovered === false && !lockSidebar) && style.close}
				${theme === 'dark' ? 'dark-surface' : 'light-surface'}
			`}
    >
			<div className={`${style.title} desktop`}>
				<h2>
					Dashboard
				</h2>
				{
					!openedSidebar 
					? <i className={`pi pi-bars ${style.burgerMenu}`} />
					: <LockSidebar />
				}	
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
								onClick={() => handleClick(option)}
								text={ !isSelected(option)}
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
