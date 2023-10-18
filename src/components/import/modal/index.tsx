'use client'
import { useState } from "react"

import { useImport } from '@/context/import'
import { useAccessibility } from '@/context/accessibility'

import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"

import Form from '@/components/import/form'

export default function ImportModal() {

  const { theme, getDict } = useAccessibility()
  const { openedModal, closeImportModal } = useImport()

  const dict = getDict()

  const footerContent = (
    <div>
      <Button
        label={ dict?.cancel}
        icon="pi pi-times"
        onClick={() => closeImportModal()}
        severity="danger"
        text
      />
      <Button
        label={ dict?.import?.buttonLabel }
        icon="pi pi-upload"
        onClick={() => closeImportModal()}
        autoFocus
      />
    </div>
  )

  return (
    <Dialog
      header={dict?.import?.description}
      visible={openedModal}
      style={{ width: "50vw" }}
      onHide={() => closeImportModal()}
      footer={footerContent}
    >
      <Form />
    </Dialog>
  )
}
