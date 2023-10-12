'use client'
import style from './style.module.sass'
import { Module } from '@/utils/types/globals'

import { useAccessibility } from "@/context/accessibility"
import { useImport } from "@/context/import"

type IProps = {
  module: Module
}

export default function NoData( { ...props }: IProps ) {

  const { getDict } = useAccessibility()
  const { openImportModal } = useImport()

  const dict = getDict()

  return (
    <section className={ style.noData} onClick={() => openImportModal(props.module)}>
      { dict.modules[props.module].noData }
    </section>
  )
}