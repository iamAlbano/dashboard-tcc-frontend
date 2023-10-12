import { create } from 'zustand'

import { Module } from '@/utils/types/globals'

type ImportState = {
  openedModal: boolean
  selectedModule: Module | null
  openImportModal: (module: Module|undefined) => void
  closeImportModal: () => void
  setSelectedModule: (module: Module|null) => void
}

export const useImport = create<ImportState>((set) => ({
  openedModal: false,
  selectedModule: null,
  openImportModal: (module: Module|undefined) => handleOpenModal(module),
  closeImportModal: () => handleCloseModal(),
  setSelectedModule: (module: Module|null) => set({ selectedModule: module })
}))

function handleOpenModal (module: Module|undefined) {
  useImport.setState({ openedModal: true, selectedModule: module ?? null })
}

function handleCloseModal () {
  useImport.setState({ openedModal: false, selectedModule: null })
}