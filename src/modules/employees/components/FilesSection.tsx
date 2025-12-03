import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  name: string;
  register: any;
  setValue: any;
  error?: boolean;
  multiple?: boolean;
  files?: File[];
  onRemove?: (index: number) => void;

  // NUEVO
  enableDate?: boolean;
  dateName?: string;
  dateError?: boolean;
}

export function FileUpload({
  label,
  name,
  register,
  setValue,
  error,
  multiple = false,
  files = [],
  onRemove,

  enableDate = false,
  dateName = "",
  dateError,
}: FileUploadProps) {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const updated = [...files, ...acceptedFiles];
        setValue(name, updated, { shouldValidate: true });
      } else {
        setValue(name, acceptedFiles[0], { shouldValidate: true });
      }
    },
    [name, setValue, multiple, files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple
  });

  return (
    <div className="space-y-2">
      {/* LABEL */}
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* DROPZONE */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-[#cf2e2e] bg-red-50"
            : "border-gray-300 hover:border-[#cf2e2e]",
          { "border-red-500": error }
        )}
      >
        <Upload className="mx-auto text-gray-400 mb-2" size={28} />

        <p className="text-gray-600">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>

        <input
          {...register(name)}
          {...getInputProps()}
          type="file"
          className="hidden"
        />
      </div>

      {/* LISTA DE ARCHIVOS */}
      {multiple && files?.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f: File, i: number) => (
            <div
              key={`${f.name}-${i}`}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
            >
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {f.name}
                </div>
                <div className="text-xs text-gray-500">
                  {(f.size / 1024).toFixed(1)} KB
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemove && onRemove(i)}
                className="text-sm text-red-500"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <span className="text-red-500 text-sm">
          Archivo requerido
        </span>
      )}

      {/* NUEVO: CAMPO DE FECHA */}
      {enableDate && (
        <div className="pt-3">
          <label className="text-sm font-medium text-gray-700">
            Fecha del documento <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            {...register(dateName, { required: true })}
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
