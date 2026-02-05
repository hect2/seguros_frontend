import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // tu helper cn (classnames)
import { useAuthStore } from "@/auth/store/auth.store";
import { FileUpload } from "../FilesSection";
import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { OfficesListResponse } from "@/interfaces/offices.lists.response";
import { convertFileToBase64 } from "@/utils/convertFileToBase64";
import { PositionTypesListResponse } from "@/interfaces/position-types.lists.response";
import { useUsersList } from "@/seguros/hooks/useUsersList";
import { useBusinessList } from "@/seguros/hooks/useBusinessList";
import { useOfficesList } from "@/seguros/hooks/useOfficesList";
import { PermissionGuard } from "@/components/PermissionGuard";

interface CreateUserModalProps {
  onClose: () => void;
  onSubmit?: (data: UserFormInputs) => Promise<void> | void;
  // opcional: puedes recibir listas (oficinas/distritos/roles) para los selects
  // offices: OfficesListResponse;
  districts: DistrictsListResponse;
  positionTypes: PositionTypesListResponse;
}

type TabType =
  | "datos-personales"
  | "datos-laborales"
  | "organizacion"
  | "documentos"
  | "compensacion"
  | "tracking";

export interface UserFormInputs {
  // datos personales
  full_name: string;
  dpi: string;
  birth_date?: string;
  phone?: string;
  email?: string;

  // organizacion
  office_id?: string;
  district_id?: string;
  admin_position_id?: string;
  operative_position_id?: string;

  // compensacion
  salary?: string;
  bonus?: string;

  user_id: number;

  // documentos
  files: FileList;
  dpi_photo?: File[]; // foto DPI (single)
  antecedentes_penales?: File[];
  antecedentes_policia?: File[];
  cuenta_bancaria?: File[];
  certificado_nacimiento?: File[];
  diploma_estudios?: File[];
  certificado_capacitacion?: File[];
  poligrafia?: File[];
  fotografia?: File[];
  boleta_deposito?: File[];
  contrato?: File[];
  seguro_vida?: File[];
  other_documents?: File[]; // area drag & drop (multiple)

  // tracking / extras
  description_files?: string;
  digessp_fecha_vencimiento?: string;

  status_id?: string;

  user_responsible_id: string;

  antecedentes_penales_file_date: string;
  antecedentes_policia_file_date: string;




  employee_code: string;
  admission_date: string;
  departure_date?: string;

  client_id: string;
  position_id: string;
  employee_status_id: string;

  turn?: string;
  reason_for_leaving?: string;
  suspension_date?: string;

  life_insurance_code?: string;
  digessp_code?: string;
  digessp_code_expiration_date?: string;
}


export function CreateUserModal({
  onClose,
  onSubmit,
  // offices,
  districts,
  positionTypes,
}: CreateUserModalProps) {
  const { user } = useAuthStore();
  const { data: UserList } = useUsersList();
  const { data: BusinessList } = useBusinessList();

  const [activeTab, setActiveTab] = useState<TabType>("datos-personales");

  const [dragActive, setDragActive] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<UserFormInputs | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UserFormInputs>({
    defaultValues: {
      full_name: "",
      dpi: "",
      birth_date: "",
      phone: "",
      email: "",

      office_id: "",
      district_id: "",
      admin_position_id: "",
      operative_position_id: "",

      salary: "",
      bonus: "",

      user_id: user?.id,

      files: null,
      dpi_photo: [],
      antecedentes_penales: [],
      antecedentes_policia: [],
      cuenta_bancaria: [],
      certificado_nacimiento: [],
      diploma_estudios: [],
      certificado_capacitacion: [],
      poligrafia: [],
      fotografia: [],
      boleta_deposito: [],
      contrato: [],
      seguro_vida: [],
      other_documents: [],
      description_files: "",
      user_responsible_id: "",





      employee_code: "",
      admission_date: "",
      departure_date: "",

      client_id: "",
      position_id: "",
      employee_status_id: "",

      turn: "",
      reason_for_leaving: "",
      suspension_date: "",

      life_insurance_code: "",
      digessp_code: "",
      digessp_code_expiration_date: "",
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

  // register manual fields for files if needed (no es obligatorio)
  useEffect(() => {
    register("dpi_photo");
    register("antecedentes_penales");
    register("antecedentes_policia");
    register("cuenta_bancaria");
    register("certificado_nacimiento");
    register("diploma_estudios");
    register("certificado_capacitacion");
    register("poligrafia");
    register("fotografia");
    register("boleta_deposito");
    register("contrato");
    register("seguro_vida");
    register("other_documents");
  }, [register]);

  // Observa archivos para renderizar previews
  const dpiPhotoDocuments = watch("dpi_photo") ? Array.from(watch("dpi_photo")!) : [];
  const antecedentesPenalesDocuments = watch("antecedentes_penales") ? Array.from(watch("antecedentes_penales")!) : [];
  const antecedentesPoliciaDocuments = watch("antecedentes_policia") ? Array.from(watch("antecedentes_policia")!) : [];
  const cuentaBancariaDocuments = watch("cuenta_bancaria") ? Array.from(watch("cuenta_bancaria")!) : [];
  const certificadoNacimientoDocuments = watch("certificado_nacimiento") ? Array.from(watch("certificado_nacimiento")!) : [];
  const diplomaEstudiosDocuments = watch("diploma_estudios") ? Array.from(watch("diploma_estudios")!) : [];
  const certificadoCapacitacionDocuments = watch("certificado_capacitacion") ? Array.from(watch("certificado_capacitacion")!) : [];
  const poligrafiaDocuments = watch("poligrafia") ? Array.from(watch("poligrafia")!) : [];
  const fotografiaDocuments = watch("fotografia") ? Array.from(watch("fotografia")!) : [];
  const boletaDepositoDocuments = watch("boleta_deposito") ? Array.from(watch("boleta_deposito")!) : [];
  const contratoDocuments = watch("contrato") ? Array.from(watch("contrato")!) : [];
  const seguroVidaDocuments = watch("seguro_vida") ? Array.from(watch("seguro_vida")!) : [];
  const otherDocuments = watch("other_documents") ? Array.from(watch("other_documents")!) : [];

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files ?? []);
    if (!files.length) return;
    const current: File[] = watch("other_documents") ?? [];
    setValue("other_documents", [...current, ...files], { shouldDirty: true });
  };

  // Input change handlers for single file fields
  const handleSingleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "dpi_photo" | "antecedentes_penales" | "antecedentes_policia"
  ) => {
    const f = e.target.files?.[0] ?? null;
    setValue(field, f, { shouldDirty: true, shouldValidate: true });
  };

  // Input change for multiple file input (alternative to dragdrop)
  const handleMultipleFilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const current: File[] = watch("other_documents") ?? [];
    setValue("other_documents", [...current, ...files], { shouldDirty: true });
  };

  // Remove file helpers
  const removeFile = (field: keyof UserFormInputs, index: number) => {
    const current = Array.from(watch(field) ?? []);
    current.splice(index, 1);
    setValue(field, current as any, { shouldDirty: true });
  };


  const removeSingleFile = (field: "dpi_photo" | "antecedentes_penales" | "antecedentes_policia") => {
    setValue(field, null, { shouldDirty: true });
  };

  // On submit
  const submit = async (data: UserFormInputs) => {
    if (data.user_responsible_id) {
      setPendingSubmitData(data);
      setShowConfirmModal(true);
      return;
    }

    await processSubmit(data);
  };

  const processSubmit = async (data: UserFormInputs) => {
    try {
      const documentos: any[] = [];

      // antecedentes_penales
      if (antecedentesPenalesDocuments.length > 0) {
        const converted = await Promise.all(
          antecedentesPenalesDocuments.map(async (file) => ({
            name: file.name,
            file: await convertFileToBase64(file),   // base64
            date_emission: data.antecedentes_penales_file_date ?? null,
            type: "antecedentes_penales",
          }))
        );

        documentos.push(...converted);
      }

      // antecedentes_policia
      if (antecedentesPoliciaDocuments.length > 0) {
        const converted = await Promise.all(
          antecedentesPoliciaDocuments.map(async (file) => ({
            name: file.name,
            file: await convertFileToBase64(file),
            date_emission: data.antecedentes_policia_file_date ?? null,
            type: "antecedentes_policia",
          }))
        );

        documentos.push(...converted);
      }

      // DPI photo (single)
      if (dpiPhotoDocuments.length > 0) {
        const converted = await Promise.all(
          dpiPhotoDocuments.map(async (file) => ({
            name: file.name,
            file: await convertFileToBase64(file),
            date_emission: null,
            type: "dpi_photo",
          }))
        );

        documentos.push(...converted);
      }

      // otros documentos (drag & drop)
      if (otherDocuments.length > 0) {
        const converted = await Promise.all(
          otherDocuments.map(async (file) => ({
            name: file.name,
            file: await convertFileToBase64(file),
            type: "other_documents",
            date_emission: null,
          }))
        );

        documentos.push(...converted);
      }

      // TODO: agregar los demas campos para el drag & drop si es necesario

      data.files = documentos

      await onSubmit?.({
        ...data// ← añadimos todos los documentos transformados
      });
      // opcional: reset del form y cerrar
      reset();
      onClose();
    } catch (err) {
      // maneja errores si tu onSubmit lanza
      console.error("Error submitting user:", err);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={handleSubmit(submit)}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Usuario</h2>
          {Object.keys(errors).length > 0 && (
            <div className="text-red-600 text-sm mb-4">
              ⚠️ Faltan campos por completar en otras secciones.
            </div>
          )}
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {(
              [
                { id: "datos-personales", label: "Datos Personales" },
                { id: "organizacion", label: "Organización" },
                { id: "datos-laborales", label: "Datos Laborales" },
                { id: "documentos", label: "Documentos" },
                { id: "compensacion", label: "Compensación" },
                { id: "tracking", label: "Tracking" },
              ] as { id: TabType; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "py-3 px-1 font-medium text-sm whitespace-nowrap",
                  activeTab === t.id
                    ? "text-[#cf2e2e] border-b-2 border-[#cf2e2e]"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* DATOS PERSONALES */}
          <div className={activeTab === "datos-personales" ? "block" : "hidden"}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("full_name", { required: true, maxLength: 255 })}
                  className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.full_name })}
                  placeholder="Nombre completo"
                />
                {errors.full_name && <span className="text-red-500 text-sm">El nombre es requerido</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DPI <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("dpi", { required: true, maxLength: 13 })}
                    className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.dpi })}
                    maxLength={13}
                    placeholder="##########"
                  />
                  {errors.dpi && <span className="text-red-500 text-sm">El DPI es requerido</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de nacimiento</label>
                  <input
                    {...register("birth_date")}
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input {...register("phone")} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    {...register("email", { pattern: /\S+@\S+\.\S+/ })}
                    type="email"
                    className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.email })}
                    placeholder="email@dominio.com"
                  />
                  {errors.email && <span className="text-red-500 text-sm">Email inválido</span>}
                </div>
              </div>

              {/* Foto DPI (single) */}
              <FileUpload
                label={
                  <span>
                    Foto de DPI <span className="text-red-500">*</span>
                  </span>
                }
                name="dpi_photo"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={dpiPhotoDocuments}
                onRemove={(index) => removeFile("dpi_photo", index)}
                error={!!errors.dpi_photo}
                dateRequired={true}
                fileRequired={true}
                title_error={'La Foto DPI es requerido'}
              />
            </div>
          </div>

          {/* ORGANIZACIÓN */}
          <div className={activeTab === "organizacion" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SELECT DISTRITO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distrito <span className="text-red-500">*</span>
                </label>

                <select
                  onChange={(e) => {
                    setValue("district_id", e.target.value, { shouldValidate: true });
                  }}
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
                  onChange={(e) => {
                    setValue("office_id", e.target.value, { shouldValidate: true });
                  }}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Administrativo <span className="text-red-500">*</span></label>
                <select {...register("admin_position_id", { required: true })} className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.admin_position_id })}>
                  <option value="">Seleccionar cargo</option>
                  {positionTypes.data.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.admin_position_id && <span className="text-red-500 text-sm">El Cargo administrativo es requerido</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Operativo</label>
                <select {...register("operative_position_id")} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Seleccionar cargo</option>
                  {positionTypes.data.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* DATOS LABORALES */}
          <div className={activeTab === "datos-laborales" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Código de empleado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Empleado <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("employee_code", { required: true })}
                  className={cn("w-full px-4 py-2 border rounded-lg", {
                    "border-red-500": errors.employee_code,
                  })}
                />
                {errors.employee_code && (
                  <span className="text-red-500 text-sm">Campo requerido</span>
                )}
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente <span className="text-red-500">*</span></label>
                <select
                  {...register("client_id", { required: true })}
                  className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.office_id })}
                >
                  <option value="">Seleccionar  un Cliente</option>
                  {BusinessList?.data?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {errors.client_id && <span className="text-red-500 text-sm">El cliente es requerido</span>}
              </div>

              {/* Fecha ingreso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Ingreso <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("admission_date", { required: true })}
                  className={cn("w-full px-4 py-2 border rounded-lg", {
                    "border-red-500": errors.admission_date,
                  })}
                />
              </div>

              {/* Fecha salida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Salida
                </label>
                <input
                  type="date"
                  {...register("departure_date")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Turno */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turno
                </label>
                <input
                  {...register("turn")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Motivo de salida */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de salida
                </label>
                <textarea
                  {...register("reason_for_leaving")}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Fecha suspensión */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Suspensión
                </label>
                <input
                  type="date"
                  {...register("suspension_date")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Seguro de vida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Seguro de Vida
                </label>
                <input
                  {...register("life_insurance_code")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* DIGESSP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código DIGESSP
                </label>
                <input
                  {...register("digessp_code")}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Fecha Vencimiento DIGESSP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Vencimiento DIGESSP</label>
                <input
                  {...register("digessp_fecha_vencimiento")}
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

            </div>
          </div>


          {/* DOCUMENTOS */}
          <div className={activeTab === "documentos" ? "block" : "hidden"}>
            <div className="space-y-4">
              {/* Cuenta bancaria */}
              <FileUpload
                label={
                  <span>
                    Cuenta bancaria <span className="text-red-500">*</span>
                  </span>
                }
                name="cuenta_bancaria"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={cuentaBancariaDocuments}
                onRemove={(index) => removeFile("cuenta_bancaria", index)}
                error={!!errors.cuenta_bancaria}
                fileRequired={true}
                title_error={'La Cuenta bancaria es requerido'}
              />

              {/* Certificado de nacimiento */}
              <FileUpload
                label={
                  <span>
                    Certificado de nacimiento <span className="text-red-500">*</span>
                  </span>
                }
                name="certificado_nacimiento"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={certificadoNacimientoDocuments}
                onRemove={(index) => removeFile("certificado_nacimiento", index)}
                error={!!errors.certificado_nacimiento}
                fileRequired={true}
                title_error={'El Certificado de nacimiento es requerido'}
              />

              {/* Diploma de estudios */}
              <FileUpload
                label={
                  <span>
                    Diploma de estudios <span className="text-red-500">*</span>
                  </span>
                }
                name="diploma_estudios"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={diplomaEstudiosDocuments}
                onRemove={(index) => removeFile("diploma_estudios", index)}
                error={!!errors.diploma_estudios}
                fileRequired={true}
                title_error={'El Diploma de estudios es requerido'}
              />

              {/* Certificado de capacitación */}
              <FileUpload
                label={
                  <span>
                    Certificado de capacitación <span className="text-red-500">*</span>
                  </span>
                }
                name="certificado_capacitacion"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={certificadoCapacitacionDocuments}
                onRemove={(index) => removeFile("certificado_capacitacion", index)}
                error={!!errors.certificado_capacitacion}
                fileRequired={true}
                title_error={'El Certificado de capacitación es requerido'}
              />

              {/* Poligrafía */}
              <FileUpload
                label={
                  <span>
                    Poligrafía <span className="text-red-500">*</span>
                  </span>
                }
                name="poligrafia"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={poligrafiaDocuments}
                onRemove={(index) => removeFile("poligrafia", index)}
                error={!!errors.poligrafia}
                fileRequired={true}
                title_error={'La Poligrafía es requerida'}
              />

              {/* Antecedentes Penales */}
              <FileUpload
                label={
                  <span>
                    Antecedentes penales <span className="text-red-500">*</span>
                  </span>
                }
                name="antecedentes_penales"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={antecedentesPenalesDocuments}
                onRemove={(index) => removeFile("antecedentes_penales", index)}
                error={!!errors.antecedentes_penales}
                enableDate
                dateRequired={false}
                dateName="antecedentes_penales_file_date"
                dateError={!!errors.antecedentes_penales_file_date}
                fileRequired={true}
                title_error={'Los Antecedentes Penales es requerido'}
              />

              {/* Antecedentes Policia */}
              <FileUpload
                label={
                  <span>
                    Antecedentes policiacos <span className="text-red-500">*</span>
                  </span>
                }
                name="antecedentes_policia"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={antecedentesPoliciaDocuments}
                onRemove={(index) => removeFile("antecedentes_policia", index)}
                error={!!errors.antecedentes_policia}
                enableDate
                dateName="antecedentes_policia_file_date"
                dateRequired={false}
                dateError={!!errors.antecedentes_policia_file_date}
                fileRequired={true}
                title_error={'Los Antecedentes Policia es requerido'}
              />

              {/* Fotografía */}
              <FileUpload
                label={
                  <span>
                    Fotografía <span className="text-red-500">*</span>
                  </span>
                }
                name="fotografia"
                register={register}
                setValue={setValue}
                errors={errors}
                multiple={true}
                files={fotografiaDocuments}
                onRemove={(index) => removeFile("fotografia", index)}
                error={!!errors.fotografia}
                fileRequired={true}
                title_error={'La Fotografía es requerida'}
              />

              {/* Boleta de depósito */}
              <FileUpload
                label="Boleta de depósito"
                name="boleta_deposito"
                register={register}
                setValue={setValue}
                multiple={true}
                files={boletaDepositoDocuments}
                onRemove={(index) => removeFile("boleta_deposito", index)}
                error={!!errors.boleta_deposito}
              />

              {/* Contrato */}
              <FileUpload
                label="Contrato"
                name="contrato"
                register={register}
                setValue={setValue}
                multiple={true}
                files={contratoDocuments}
                onRemove={(index) => removeFile("contrato", index)}
                error={!!errors.contrato}
              />

              {/* Seguro de vida */}
              <FileUpload
                label="Seguro de vida"
                name="seguro_vida"
                register={register}
                setValue={setValue}
                multiple={true}
                files={seguroVidaDocuments}
                onRemove={(index) => removeFile("seguro_vida", index)}
                error={!!errors.seguro_vida}
              />

              {/* Other documents - drag & drop multiple */}
              <FileUpload
                label="Adjuntos (otros documentos)"
                name="other_documents"
                register={register}
                setValue={setValue}
                multiple={true}
                files={otherDocuments}
                onRemove={(index) => removeFile("other_documents", index)}
                error={!!errors.other_documents}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones de documentos</label>
                <textarea {...register("description_files")} rows={4} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* COMPENSACION */}
          <div className={activeTab === "compensacion" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sueldo inicial (GTQ) <span className="text-red-500">*</span></label>
                <input {...register("salary", { required: true })} type="number" step="0.01" className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.full_name })} />
                {errors.salary && <span className="text-red-500 text-sm">El salario es requerido</span>}
              </div>

              <PermissionGuard allowedPermissions={['employees_bonus']} user={user} show_dialog={false}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bonificaciones (GTQ)</label>
                  <input {...register("bonus")} type="number" step="0.01" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </PermissionGuard>

              {(watch("salary") || watch("bonus")) && (
                <div className="md:col-span-2 mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Mensual</p>
                  <p className="text-2xl font-bold text-[#cf2e2e]">
                    Q {" "}
                    {(
                      (parseFloat(watch("salary") || "0") || 0) +
                      (parseFloat(watch("bonus") || "0") || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* TRACKING */}
          <div className={activeTab === "tracking" ? "block" : "hidden"}>
            <div className="px-6 py-4 border-t">
              <div className="mt-4 grid grid-cols-1 gap-4">
                <span>
                  El tracking de aprobación se activará después de crear el usuario
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar responsable siguiente fase
                  </label>
                  <select
                    {...register("user_responsible_id")}
                    className={cn("w-full px-4 py-2 border rounded-lg")}
                  >
                    <option value="">Seleccionar Usuario Responsable</option>
                    {UserList?.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">{isDirty ? "Cambios sin guardar" : "Sin cambios"}</div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626]">
              {isSubmitting ? "Guardando..." : "Guardar Usuario"}
            </button>
          </div>
        </div>
      </form>
      {showConfirmModal && pendingSubmitData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirmar asignación
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Estás a punto de asignar un responsable para la siguiente fase del
              proceso de ingreso del colaborador.
            </p>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Responsable asignado:</span>{" "}
                {
                  UserList?.data?.find(
                    (u) => String(u.id) === String(pendingSubmitData.user_responsible_id)
                  )?.name
                }
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Esta acción permitirá continuar el flujo del proceso y quedará registrada
              como aprobación.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingSubmitData(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={async () => {
                  setShowConfirmModal(false);
                  await processSubmit(pendingSubmitData);
                  setPendingSubmitData(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#cf2e2e] text-white hover:bg-[#b52626]"
              >
                Confirmar y continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
