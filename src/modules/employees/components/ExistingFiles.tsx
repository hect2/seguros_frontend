import React from "react";
import { Download, Paperclip, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  backend: true;
}

interface ExistingFilesProps {
  label: string;
  files: BackendFile[];
  status: number,
  onStatusChange: (index: number, newStatus: number) => void;
  onReUpload: (index: number, newFile: File) => void;
  onDownload: (file: BackendFile) => void;
  onRemove: (index: number) => void;
}

export function ExistingFiles({
  label,
  files,
  status,
  onStatusChange,
  onReUpload,
  onDownload,
  onRemove,
}: ExistingFilesProps) {
  const reUploadInputRef = React.useRef<HTMLInputElement | null>(null);
  const reUploadIndexRef = React.useRef<number | null>(null);

  const handleReUploadClick = (index: number) => {
    reUploadIndexRef.current = index;
    reUploadInputRef.current?.click();
  };

  const handleReUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && reUploadIndexRef.current !== null) {
      onReUpload(reUploadIndexRef.current, file);
    }
    if (reUploadInputRef.current) {
      reUploadInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-md font-semibold text-gray-800">{label}</h3>
      {files?.length > 0 ? (
        <div className="mt-3 space-y-3">
          {files.map((file, i) => (
            <div
              key={file.uuid}
              className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3 mb-2 md:mb-0">
                <Paperclip className="text-gray-500" size={18} />
                <p className="text-sm font-medium text-gray-800 break-all">{file.name}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <select
                  value={file.status}
                  onChange={(e) => onStatusChange(i, parseInt(e.target.value, 10))}
                  className={cn(
                    "text-xs font-semibold py-1 pl-2 pr-7 border-none rounded",
                    statusColors[file.status]
                  )}
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => onDownload(file)}
                  className="p-1.5 text-gray-500 hover:text-blue-600"
                  title="Descargar"
                >
                  <Download size={18} />
                </button>

                {file.status === APPROVAL_STATUS.REJECTED && (
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
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay archivos existentes.</p>
      )}
       <input
          type="file"
          ref={reUploadInputRef}
          className="hidden"
          onChange={handleReUploadFileChange}
        />
    </div>
  );
}
