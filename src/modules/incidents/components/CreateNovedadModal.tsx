import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { X, Upload } from 'lucide-react';
import { TypesListResponse } from '@/interfaces/types.lists.response';
import { cn } from '@/lib/utils';
import { Critical, CriticalsListResponse } from '@/interfaces/criticals.lists.response';
import { getCriticalityColor } from '@/utils/criticality';
import { Incident } from '@/modules/incidents/interfaces/incident';
import { useAuthStore } from '@/auth/store/auth.store';
import { FileUpload } from '@/modules/employees/components/FilesSection';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';

interface CreateNovedadModalProps {
  onClose: () => void;
  // onSubmit?: (data: any) => void;
  districts: DistrictsListResponse,
  types: TypesListResponse,
  criticals: CriticalsListResponse,
  onSubmit: (data: Partial<Incident>) => Promise<void> | void;
}

interface NovedadFormInputs {
  title: string;
  description: string;

  type_id: string;
  district_id: string;
  criticity_id: string;
  criticity_slug: string;

  user_reported: number;
  status: number;

  files: FileList;
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};


export function CreateNovedadModal({
  onClose,
  // onSubmit,
  districts,
  types,
  criticals,
  onSubmit,
}: CreateNovedadModalProps) {

  const { user } = useAuthStore();
  console.log('DistrictsList Create: ', districts)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NovedadFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      type_id: "",
      district_id: "",
      criticity_id: "",
      criticity_slug: "",
      user_reported: 0,
      status: 1,
      files: null,
    },
  });


  useEffect(() => {
    register("criticity_id", { required: true });
    register("criticity_slug", { required: true });
  }, [register]);

  const criticidadSeleccionada = watch("criticity_slug");

  const seleccionarCriticidad = (crit: Critical) => {
    setValue("criticity_id", crit.id.toString(), { shouldValidate: true });
    setValue("criticity_slug", crit.slug, { shouldValidate: true });
  };
  useEffect(() => {
    register("files");
  }, [register]);

  const files = watch("files") ? Array.from(watch("files")!) : [];

  const handleFormSubmit = async (data: NovedadFormInputs) => {
    const files = data.files ? Array.from(data.files) : [];

    const parsedFiles = await Promise.all(
      files.map(async (file) => {
        const base64 = await convertFileToBase64(file);

        return {
          name: file.name,
          file: base64, // viene así: data:image/png;base64,...
        };
      })
    );

    const incidentLike: Partial<Incident> = {
      ...data,
      files: parsedFiles,
      user_reported: user?.id ?? 0,
    };

    await onSubmit(incidentLike);
  };

  useEffect(() => {
    if (districts?.data.length === 1) {
      const onlyDistrict = districts.data[0];

      setValue("district_id", onlyDistrict.id.toString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [districts, setValue]);

  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Crear Nueva Novedad
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", { required: true })}
            placeholder="Ingrese el título de la novedad"
            className={cn(
              "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
              {
                'border-red-500': errors.title,
              }
            )}
          />
          {errors.title && <span className="text-red-500 text-sm">El título es requerido</span>}
        </div>
        {/* SELECTS: TYPE & OFFICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TYPE SELECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              {...register("type_id", { required: true })}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                {
                  'border-red-500': errors.type_id,
                }
              )}
            >
              <option value="">Seleccione un tipo</option>
              {types?.data.map(type =>
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              )}
            </select>
            {errors.type_id && <span className="text-red-500 text-sm">Requerido</span>}
          </div>
          {/* DISTRICT SELECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distrito <span className="text-red-500">*</span>
            </label>
            <select
              {...register("district_id", { required: true })}
              className={cn(
                "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent",
                {
                  'border-red-500': errors.district_id,
                }
              )}
            >
              <option value="">Seleccione una distrito</option>
              {districts?.data.map(district =>
                <option key={district.id} value={district.id}>
                  {district.code}
                </option>
              )}
            </select>
            {errors.district_id && <span className="text-red-500 text-sm">La distrito es requerida</span>}
          </div>
        </div>
        {/* CRITICALS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Criticidad <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-3">
            {criticals?.data.map(crit =>
              <button
                key={crit.slug}
                onClick={() => seleccionarCriticidad(crit)}
                type="button"
                className={cn(
                  `flex-1 py-2 rounded-lg border transition-all ${criticidadSeleccionada === crit.slug ? getCriticalityColor(crit.slug) : 'bg-gray-100 text-gray-600 border-gray-300'}`,
                  {
                    'border-red-500': errors.criticity_id,
                  }
                )}
              >
                {crit.name}
              </button>
            )}
          </div>
          {errors.criticity_id && <span className="text-red-500 text-sm">La criticidad es requerida</span>}
        </div>
        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", { required: true })}
            rows={4}
            placeholder="Describa la novedad en detalle"
            className={cn(
              "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent resize-none",
              {
                'border-red-500': errors.description,
              }
            )}
          />
          {errors.description && <span className="text-red-500 text-sm">La descripción es requerida</span>}
        </div>
        {/* FILES */}
        <FileUpload
          label="Adjuntar archivos"
          name="files"
          register={register}
          setValue={setValue}
          multiple={true}
          files={files}
          onRemove={(index) => {
            const current = Array.from(watch("files") || []);
            current.splice(index, 1);

            // recrear FileList manualmente
            const dt = new DataTransfer();
            current.forEach((f) => dt.items.add(f));

            setValue("files", dt.files, { shouldDirty: true });
          }}
          error={!!errors.files}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg font-medium hover:bg-[#b52626] transition-colors">
            Crear Novedad
          </button>
        </div>
      </form>
    </div>
  </div>;
}