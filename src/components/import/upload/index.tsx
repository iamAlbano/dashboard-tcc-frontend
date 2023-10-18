'use client'
import { useRef, useState } from "react"

import { useAccessibility } from "@/context/accessibility"

import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from "primereact/fileupload"

import { ProgressBar } from "primereact/progressbar"
import { Button } from "primereact/button"
import { Tooltip } from "primereact/tooltip"
import { Tag } from "primereact/tag"

export default function TemplateDemo() {

  const { getDict } = useAccessibility()
  const dict = getDict()
  
  const [totalSize, setTotalSize] = useState(0)
  const fileUploadRef = useRef<FileUpload>(null)

  const onTemplateSelect = (e: FileUploadUploadEvent) => {
    let _totalSize = totalSize
    let files = e.files

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0
    }

    setTotalSize(_totalSize)
  }

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0

    e.files.forEach((file) => {
      _totalSize += file.size || 0
    })

    setTotalSize(_totalSize)
  }

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size)
    callback()
  }

  const onTemplateClear = () => {
    setTotalSize(0)
  }

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options
    const value = totalSize / 10000
    const formatedValue =
      fileUploadRef && fileUploadRef?.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B"

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue ?? '0 B'} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    )
  }

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    )
  }

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-file-excel mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          { dict.import.uploadPlaceholder }
        </span>
      </div>
    )
  }

  const chooseOptions = {
    label: "Upload",
    icon: "pi pi-fw pi-upload",
    className: "custom-choose-btn",
  }
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-outlined",
  }
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-outlined",
  }

  return (
    <div>
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        url="/api/upload"
        multiple
        accept="image/*"
        maxFileSize={1000000}
        onUpload={onTemplateUpload}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </div>
  )
}
