import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Business } from "@/modules/business/interfaces/business.interface";

interface BusinessModalProps {
  onClose: () => void;
  mode: "create" | "edit";
  isOpen: boolean;
  business: Business | null;
  onSubmit: (data: Partial<Business>) => Promise<void> | void;
}

interface BusinessFormInputs {
  id: number;
  name: string;
  direction: string;
  phone: string;
  status: Number; // "Activo" | "Inactivo"
  mode: string;
}

export function BusinessModal({
  mode,
  isOpen,
  onClose,
  business,
  onSubmit,
}: BusinessModalProps) {
  console.log("BusinessModal: ", business)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormInputs>({
    defaultValues: {
      id: 0,
      name: "",
      direction: "",
      phone: "",
      status: 1,
      mode,
    },
  });

  // cargar datos si es edición
  useEffect(() => {
    if (business && mode === "edit") {
      reset({
        id: business.id,
        name: business.name,
        direction: business.direction || "",
        phone: business.phone || "",
        status: business.status,
      });
    } else {
      reset({
        id: 0,
        name: "",
        direction: "",
        phone: "",
        status: 1,
      });
    }
  }, [business, mode, isOpen, reset]);

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
            {mode === "create" ? "Crear Nueva Empresa" : "Editar Empresa"}
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
              Nombre de la Empresa *
            </label>
            <input
              {...register("name", { required: true })}
              className={cn(
                "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                {
                  'border-red-500': errors.name,
                }
              )}
              placeholder="Nombre de la Empresa"
            />
            {errors.name && <span className="text-red-500 text-sm">El nombre de la empresa es requerido</span>}
          </div>

          {/* DIRECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              {...register("direction")}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
              placeholder="Dirección de la empresa..."
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              {...register("phone")}
              className={cn(
                "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
              )}
              placeholder="Ej: 1234-5678"
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
              {mode === "create" ? "Crear Empresa" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
