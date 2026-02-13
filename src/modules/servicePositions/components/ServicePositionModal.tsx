import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServicePosition } from "../interfaces/service-positions.interface";
import { useBusinessList } from "@/seguros/hooks/useBusinessList";
import { Business } from "@/interfaces/business.lists.response";
import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { useOfficesList } from "@/seguros/hooks/useOfficesList";

interface ServicePositionModalProps {
  onClose: () => void;
  mode: "create" | "edit";
  isOpen: boolean;
  servicePosition: ServicePosition | null;
  business: Business[];
  districts: DistrictsListResponse;
  onSubmit: (data: Partial<ServicePosition>) => Promise<void> | void;
}

interface ServicePositionFormInputs {
  id?: number;
  business_id: string;
  name: string;
  location: string;
  shift: string;
  service_type: string;
  active?: boolean;
  office_id: string,
  district_id: string,
}

export function ServicePositionModal({
  mode,
  isOpen,
  onClose,
  servicePosition,
  business,
  districts,
  onSubmit,
}: ServicePositionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServicePositionFormInputs>({
    defaultValues: {
      business_id: "", // 👈 fijo o dinámico
      name: "",
      location: "",
      shift: "",
      service_type: "",
      active: true,
      office_id: "",
      district_id: "",
    },
  });

  const selectedDistritos = watch('district_id');
  const selectedOffices = watch('office_id') || [];
  console.log(`Selected Distritos: `, selectedDistritos)
  const { data: officesList, isLoading: loadingOffices } = useOfficesList({
    district_id: Number(selectedDistritos),
    user_id: 0,
  });

  const offices = selectedDistritos == undefined ? {
    error: false,
    code: 200,
    data: []
  } : officesList;

  useEffect(() => {
    if (mode === "edit" && servicePosition) {
      reset({
        id: servicePosition.id,
        business_id: servicePosition.business_id,
        name: servicePosition.name,
        location: servicePosition.location,
        shift: servicePosition.shift,
        service_type: servicePosition.service_type,
        active: servicePosition.active,
        office_id: servicePosition.office_id,
        district_id: servicePosition.district_id,
      });
    } else {
      reset({
        business_id: "",
        name: "",
        location: "",
        shift: "",
        service_type: "",
        active: true,
        office_id: "",
        district_id: "",
      });
    }
  }, [mode, servicePosition, isOpen, reset]);

  if (!isOpen) return null;

  const submitHandler = async (data: ServicePositionFormInputs) => {
    if (mode === "create") {
      const payload = {
        business_id: data.business_id,
        name: data.name,
        location: data.location,
        shift: data.shift,
        service_type: data.service_type,
        office_id: data.office_id,
        district_id: data.district_id,
      };
      await onSubmit(payload);
    } else {
      const payload = {
        business_id: data.business_id,
        name: data.name,
        location: data.location,
        shift: data.shift,
        service_type: data.service_type,
        active: data.active,
        office_id: data.office_id,
        district_id: data.district_id
      };
      await onSubmit(payload);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create"
              ? "Crear Puesto de Servicio"
              : "Editar Puesto de Servicio"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="p-6 space-y-4"
        >
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente <span className="text-red-500">*</span></label>
            <select
              {...register("business_id", { required: true })}
              className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.business_id })}
            >
              <option value="">Seleccionar  un Cliente</option>
              {business?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.business_id && <span className="text-red-500 text-sm">El cliente es requerido</span>}
          </div>

          {/* SELECT DISTRITO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distrito <span className="text-red-500">*</span>
            </label>

            <select
              // onChange={(e) => {
              //   setValue("district_id", e.target.value, { shouldValidate: true });
              // }}
              {...register("district_id", { required: true })}
              className={cn(
                "w-full px-4 py-2 border rounded-lg",
                errors.district_id && "border-red-500"
              )}
            >
              <option value="">Seleccionar distrito</option>
              {districts.data.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code}
                </option>
              ))}
            </select>

            {errors.district_id && (
              <span className="text-red-500 text-sm">El distrito es requerido</span>
            )}
          </div>

          {/* SELECT OFFICE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Oficina <span className="text-red-500">*</span>
            </label>

            <select
              disabled={loadingOffices}
              // onChange={(e) => {
              //   setValue("office_id", e.target.value, { shouldValidate: true });
              // }}
              {...register("office_id", { required: true })}
              className={cn(
                "w-full px-4 py-2 border rounded-lg",
                errors.office_id && "border-red-500"
              )}
            >
              <option value="">Seleccionar oficina</option>
              {loadingOffices && <option>⏳ Cargando...</option>}

              {offices?.data?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.code}
                </option>
              ))}
            </select>

            {errors.office_id && (
              <span className="text-red-500 text-sm">La oficina es requerida</span>
            )}
          </div>


          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              {...register("name", { required: true })}
              className={cn(
                "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                errors.name ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Ej: Guardia de Seguridad"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                El nombre es obligatorio
              </span>
            )}
          </div>

          {/* UBICACIÓN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación *
            </label>
            <input
              {...register("location", { required: true })}
              className={cn(
                "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e]",
                errors.location ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Ciudad Capital"
            />
          </div>

          {/* TURNO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Turno *
            </label>
            <input
              {...register("shift", { required: true })}
              className={cn(
                "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e]",
                errors.shift ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Laboral / Nocturno"
            />
          </div>

          {/* TIPO DE SERVICIO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio *
            </label>
            <input
              {...register("service_type", { required: true })}
              className={cn(
                "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e]",
                errors.service_type ? "border-red-500" : "border-gray-300"
              )}
              placeholder="Seguridad / Administrativo"
            />
          </div>

          {/* ACTIVO (solo edit) */}
          {mode === "edit" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("active")}
                className="w-4 h-4 text-[#cf2e2e]"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition font-medium"
            >
              {mode === "create" ? "Crear Puesto" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
