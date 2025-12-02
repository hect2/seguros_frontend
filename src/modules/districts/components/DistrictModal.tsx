import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { District } from "@/modules/districts/interfaces/district.interface";

interface DistrictModalProps {
  onClose: () => void;
  mode: "create" | "edit";
  isOpen: boolean;
  distrito: District | null;
  onSubmit: (data: Partial<District>) => Promise<void> | void;
}

interface DistrictFormInputs {
  id:   Number;
  code: string;
  name: string;
  description: string;
  status: Number; // "Activo" | "Inactivo"
  mode: string;
}

export function DistrictModal({
  mode,
  isOpen,
  onClose,
  distrito,
  onSubmit,
}: DistrictModalProps) {
  console.log("DistrictModal: ", distrito)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormInputs>({
    defaultValues: {
      id: 0,
      code: "",
      name: "",
      description: "",
      status: "Activo",
      mode,
    },
  });

  // cargar datos si es edición
  useEffect(() => {
    if (distrito && mode === "edit") {
      reset({
        id: distrito.id,
        code: distrito.code,
        name: distrito.name,
        description: distrito.description || "",
        status: distrito.status,
      });
    } else {
      reset({
        id: 0,
        code: "",
        name: "",
        description: "",
        status: "1",
      });
    }
  }, [distrito, mode, isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Crear Nuevo Distrito" : "Editar Distrito"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* CODE + NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CODE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Distrito *
              </label>
              <input
                {...register("code", { required: true })}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                  {
                    'border-red-500': errors.code,
                  }
                )}
                placeholder="Ej: D052"
              />
              {errors.code && <span className="text-red-500 text-sm">El código de distrito es requerido</span>}
            </div>

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Distrito *
              </label>
              <input
                {...register("name", { required: true })}
                className={cn(
                  "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                  {
                    'border-red-500': errors.name,
                  }
                )}
                placeholder="Ej: Distrito Norte Central"
              />
              {errors.name && <span className="text-red-500 text-sm">El nombre de distrito es requerido</span>}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
              placeholder="Descripción del distrito..."
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium"
            >
              {mode === "create" ? "Crear Distrito" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
