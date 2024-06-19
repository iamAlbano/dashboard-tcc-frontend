"use client";
import { useAccessibility } from "@/context/accessibility";
import { useImport } from "@/context/import";
import { useRef, useState } from "react";

import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from "primereact/fileupload";

import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function TemplateDemo() {
  const { getDict } = useAccessibility();
  const { selectedModule, setFile } = useImport();
  const dict = getDict();

  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);

  const onSelectFile = (e: FileUploadSelectEvent) => {
    if (!selectedModule) return;
    setFile(selectedModule, e.files[0]);
  };

  const onTemplateSelect = (e: FileUploadUploadEvent) => {
    let _totalSize = totalSize;
    let files = e.files;

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0;
    }

    setTotalSize(_totalSize);
    if (!selectedModule) return;

    setFile(selectedModule, e.files[0]);
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);

    if (!selectedModule) return;

    setFile(selectedModule, e.files[0]);
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size);
    callback();

    if (!selectedModule) return;

    setFile(selectedModule, null);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef?.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

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
        {/* {uploadButton} */}
        {/* {cancelButton} */}
        {/* <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue ?? "0 B"} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div> */}
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File;
    return (
      <div className="flex flex-column align-items-center justify-content-center flex-wrap">
        <p>
          Não foi possível ler o arquivo selecionado. Verifique o formato do
          arquivo e tente novamente. Arquivos suportados: .xlsx e .csv
        </p>
        <Button
          type="button"
          label="Remover arquivo"
          icon="pi pi-times"
          onClick={() => onTemplateRemove(file, props.onRemove)}
          className="p-button-outlined p-button-danger"
        />
      </div>
    );
  };

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
        <span className="my-3">
          <p className="text-center m-0">{dict.import.uploadPlaceholder}</p>

          <p className="text-sm">
            Para facilitar a importação, certifique-se que a planilha importada
            esteja bem formatada, sem espaços extras ou linhas em branco.
          </p>
        </span>
      </div>
    );
  };

  const chooseOptions = {
    label: "Upload",
    icon: "pi pi-fw pi-upload",
    className: "custom-choose-btn",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className: "custom-upload-btn p-button-success p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className: "custom-cancel-btn p-button-danger p-button-outlined",
  };

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
        accept="sheet/*"
        maxFileSize={10000000000}
        onSelect={onSelectFile}
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
  );
}
