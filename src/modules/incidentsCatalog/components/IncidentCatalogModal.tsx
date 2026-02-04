import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IncidentCatalog } from "../interfaces/incidents.catalog.response";

interface IncidentCatalogModalProps {
  onClose: () => void;
  mode: "create" | "edit";
  isOpen: boolean;
  incidentCatalog: IncidentCatalog | null;
  onSubmit: (data: Partial<IncidentCatalog>) => Promise<void> | void;
}

interface IncidentCatalogFormInputs {
  id: number;
  name: string;
  description: string;
  status: number;
  mode: string;
}

export function IncidentCatalogModal({
  mode,
  isOpen,
  onClose,
  incidentCatalog,
  onSubmit,
}: IncidentCatalogModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IncidentCatalogFormInputs>({
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      status: 1,
      mode,
    },
  });

  useEffect(() => {
    if (incidentCatalog && mode === "edit") {
      reset({
        id: incidentCatalog.id,
        name: incidentCatalog.name,
      });
    } else {
      reset({
        id: 0,
        name: "",
        description: "",
        status: 1,
      });
    }
  }, [incidentCatalog, mode, isOpen, reset]);

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
            {mode === "create" ? "Crear Nueva Novedad" : "Editar Novedad"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Novedad *
            </label>
            <input
              {...register("name", { required: true })}
              className={cn(
                "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                {
                  'border-red-500': errors.name,
                }
              )}
              placeholder="Nombre de la Novedad"
            />
            {errors.name && <span className="text-red-500 text-sm">El nombre de la novedad es requerido</span>}
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
              {mode === "create" ? "Crear Novedad" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
