import { useImport } from '@/context/import'
import { useAccessibility } from '@/context/accessibility'

import { Option, Module } from '@/utils/types/globals'

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'

import Upload from '@/components/import/upload'

export default function ImportModal() {

  const { getDict } = useAccessibility()
  const { selectedModule, setSelectedModule } = useImport()

  const dict = getDict()

  const getModulesOptions = (): Option[] => {
    const options: Option[] = []
    const modules = dict.modules

    Object.keys((modules)).map((key: string) => {
      options.push({
        label: modules[key].title,
        value: key
      })
    })

    return options
  }

  const modules = getModulesOptions()

  return (
    <section className="flex flex-column gap-3">
      <span className="p-float-label">
        <Dropdown 
          id="module-select"
          value={selectedModule} 
          onChange={(e: DropdownChangeEvent) => setSelectedModule(e.value)} 
          options={modules} 
          optionLabel="label"
          optionValue="value"
          className="w-6" 
        />
        <label htmlFor="module-select">
          { dict?.import?.selectModulePlaceholder }
        </label>
      </span>
      <Upload />
    </section>
  )
}