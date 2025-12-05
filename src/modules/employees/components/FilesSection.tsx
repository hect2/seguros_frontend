import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Paperclip, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Tipos para el estado de aprobación
const APPROVAL_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

const statusLabels: { [key: number]: string } = {
  [APPROVAL_STATUS.PENDING]: "Pendiente",
  [APPROVAL_STATUS.APPROVED]: "Aprobado",
  [APPROVAL_STATUS.REJECTED]: "Rechazado",
};

const statusColors: { [key: number]: string } = {
  [APPROVAL_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
  [APPROVAL_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [APPROVAL_STATUS.REJECTED]: "bg-red-100 text-red-800",
};

interface BackendFile {
  name: string;
  url: string;
  uuid: string;
  status: number;
  // ... otros campos del backend
  backend: true;
}

type FileOrBackendFile = File | BackendFile;

interface FileUploadProps {
  label: string;
  name: string;
  register: any;
  setValue: any;
  errors: any;
  error?: boolean;
  multiple?: boolean;
  files?: FileOrBackendFile[];
  onRemove: (index: number) => void;
  enableDate?: boolean;
  dateName?: string;
  dateError?: boolean;
  fileRequired?: boolean;
  dateRequired?: boolean;
  title_error?: string;
  onDownload?: (file: BackendFile) => void;
  onStatusChange?: (index: number, newStatus: number) => void;
  onReUpload?: (index: number, newFile: File) => void; // Para reemplazar un archivo existente
}

export function FileUpload({
  label,
  name,
  register,
  setValue,
  errors,
  error,
  multiple = false,
  files = [],
  onRemove,
  enableDate = false,
  dateName = "",
  dateError,
  fileRequired,
  dateRequired = false,
  title_error = '',
  onDownload,
  onStatusChange,
  onReUpload,
}: FileUploadProps) {
  const reUploadInputRef = useRef<HTMLInputElement | null>(null);
  const reUploadIndexRef = useRef<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentFiles = files || [];
      const updatedFiles = multiple ? [...currentFiles, ...acceptedFiles] : acceptedFiles;
      setValue(name, updatedFiles, { shouldValidate: true, shouldDirty: true });
    },
    [name, setValue, multiple, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
  });

  const handleReUploadClick = (index: number) => {
    reUploadIndexRef.current = index;
    reUploadInputRef.current?.click();
  };

  const handleReUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && reUploadIndexRef.current !== null && onReUpload) {
      onReUpload(reUploadIndexRef.current, file);
    }
    // Limpiar el input para permitir la subida del mismo archivo otra vez
    if (reUploadInputRef.current) {
      reUploadInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-[#ae2d2d] bg-red-50" : "border-gray-300 hover:border-[#ae2d2d]",
          fileRequired && errors[name] && "border-red-500",
        )}
      >
        <Upload className="mx-auto text-gray-400 mb-2" size={28} />
        <p className="text-gray-600 text-sm">Arrastra archivos o haz clic para seleccionar</p>
        <input {...register(name, { required: fileRequired })} {...getInputProps()} className="hidden" />
        <input
          type="file"
          ref={reUploadInputRef}
          className="hidden"
          onChange={handleReUploadFileChange}
        />
      </div>

      {fileRequired && errors[name] && (
        <span className="text-red-500 text-sm">{title_error}</span>
      )}


      {/* LISTA DE ARCHIVOS */}
      {files?.length > 0 && (
        <div className="mt-3 space-y-3">
          {files.map((file, i) => {
            const isBackend = "backend" in file && file.backend;
            const status = isBackend ? file.status : APPROVAL_STATUS.PENDING;

            return (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <Paperclip className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 break-all">{file.name}</p>
                    {"size" in file && (
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {isBackend && onStatusChange && (
                    <select
                      value={status}
                      onChange={(e) => onStatusChange(i, parseInt(e.target.value, 10))}
                      className={cn(
                        "text-xs font-semibold py-1 pl-2 pr-7 border-none rounded",
                        statusColors[status]
                      )}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}

                  {isBackend && onDownload && (
                    <button
                      type="button"
                      onClick={() => onDownload(file as BackendFile)}
                      className="p-1.5 text-gray-500 hover:text-blue-600"
                      title="Descargar"
                    >
                      <Download size={18} />
                    </button>
                  )}

                  {isBackend && status === APPROVAL_STATUS.REJECTED && onReUpload && (
                    <button
                      type="button"
                      onClick={() => handleReUploadClick(i)}
                      className="p-1.5 text-gray-500 hover:text-green-600"
                      title="Re-subir"
                    >
                      <Upload size={18} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="p-1.5 text-gray-500 hover:text-red-600"
                    title="Eliminar"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NUEVO: CAMPO DE FECHA */}
      {enableDate && (
        <div className="pt-3">
          <label className="text-sm font-medium text-gray-700">
            Fecha del documento  {dateRequired && (<span className="text-red-500">*</span>)}
          </label>

          <input
            type="date"
            {...register(dateName, { required: dateRequired })}
            className={cn(
              "mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
              { "border-red-500": dateError }
            )}
          />

          {dateError && (
            <span className="text-red-500 text-sm">
              La fecha es requerida
            </span>
          )}
        </div>
      )}
    </div>
  );
}
