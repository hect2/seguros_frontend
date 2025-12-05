import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload } from "../FilesSection";
import { useStatusEmployeesList } from "@/seguros/hooks/useStatusEmployeesList";
import { convertFileToBase64 } from "@/utils/convertFileToBase64";
import { useAuthStore } from "@/auth/store/auth.store";
import { downloadFile } from "@/utils/downloadFile";
import { useEmployee } from "../../hooks/useEmployee";
import { ApprovalTracker } from "./ApprovalTracker";
import { ExistingFiles } from "../ExistingFiles";
import { OfficesListResponse } from "@/interfaces/offices.lists.response";
import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { PositionTypesListResponse } from "@/interfaces/position-types.lists.response";
import { StatusEmployeesListResponse } from "@/interfaces/status_employees.lists.response";
import { useUsersList } from "@/seguros/hooks/useUsersList";

export interface UserFormInputs {
  full_name: string;
  dpi: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  office_id?: string;
  district_id?: string;
  admin_position_id?: string;
  operative_position_id?: string;
  salary?: string;
  bonus?: string;
  user_id: number;
  dpi_photo?: (File | BackendFile)[];
  antecedentes_penales?: (File | BackendFile)[];
  antecedentes_policia?: (File | BackendFile)[];
  other_documents?: (File | BackendFile)[];
  description_files?: string;
  digessp_fecha_vencimiento?: string;
  status_id?: string;

  user_responsible_id: string;

  antecedentes_penales_file_date: string | null;
  antecedentes_policia_file_date: string | null;
}

export interface BackendFile {
  name: string;
  url: string;
  uuid: string;
  status: number;
  backend: true;
  type: string;
  date_emission: Date,
}

interface EditUserModalProps {
  user_id: number | null;
  onClose: () => void;
  onSubmit: (employeeId: number, payload: any) => Promise<void> | void;
  offices: OfficesListResponse;
  districts: DistrictsListResponse;
  positionTypes: PositionTypesListResponse;
}

type TabType = "datos-personales" | "organizacion" | "documentos" | "compensacion" | "tracking";

export function EditUserModal({
  user_id,
  onClose,
  onSubmit,
  offices,
  districts,
  positionTypes,
}: EditUserModalProps) {
  const { user } = useAuthStore();
  const { data: UserList } = useUsersList();
  const [activeTab, setActiveTab] = useState<TabType>("datos-personales");
  const { data: employeeRes, isLoading } = useEmployee(user_id ?? 0);
  const { data: statusList } = useStatusEmployeesList() as { data: StatusEmployeesListResponse | undefined };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
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
      user_id: user?.id ?? 0,
      dpi_photo: [],
      antecedentes_penales: [],
      antecedentes_policia: [],
      other_documents: [],
      description_files: "",
      digessp_fecha_vencimiento: "",
      status_id: "",
      user_responsible_id: "",
    },
  });

  const allDpiPhotos = watch("dpi_photo") || [];
  const allAntecedentesPenales = watch("antecedentes_penales") || [];
  const allAntecedentesPolicia = watch("antecedentes_policia") || [];
  const allOtherDocuments = watch("other_documents") || [];

  const existingDpiPhotos = allDpiPhotos.filter((f) => f.backend) as BackendFile[];
  const newDpiPhotos = allDpiPhotos.filter((f) => !f.backend) as File[];

  const existingAntecedentesPenales = allAntecedentesPenales.filter((f) => f.backend) as BackendFile[];
  const newAntecedentesPenales = allAntecedentesPenales.filter((f) => !f.backend) as File[];

  const existingAntecedentesPolicia = allAntecedentesPolicia.filter((f) => f.backend) as BackendFile[];
  const newAntecedentesPolicia = allAntecedentesPolicia.filter((f) => !f.backend) as File[];

  const existingOtherDocuments = allOtherDocuments.filter((f) => f.backend) as BackendFile[];
  const newOtherDocuments = allOtherDocuments.filter((f) => !f.backend) as File[];

  useEffect(() => {
    const emp = employeeRes?.data;
    if (!emp) return;

    reset({
      full_name: emp.full_name ?? "",
      dpi: emp.dpi ?? "",
      birth_date: emp.birth_date ? emp.birth_date.split("T")[0] : "",
      phone: emp.phone ?? "",
      email: emp.email ?? "",
      office_id: emp.positions?.[0]?.office_id?.toString() ?? "",
      district_id: emp.positions?.[0]?.district_id?.toString() ?? "",
      admin_position_id: emp.positions?.[0]?.admin_position_type_id?.toString() ?? "",
      operative_position_id: emp.positions?.[0]?.operative_position_type_id?.toString() ?? "",
      salary: emp.positions?.[0]?.initial_salary ?? "",
      bonus: emp.positions?.[0]?.bonuses ?? "",
      user_id: emp.id,
      description_files: emp.files?.description_files ?? "",
      digessp_fecha_vencimiento: emp.digessp_fecha_vencimiento
        ? emp.digessp_fecha_vencimiento.split("T")[0]
        : "",
      status_id: emp.status_id,
    });
    const backendFiles = emp.files?.files ?? [];
    const mapToBackendFile = (f: any): BackendFile => ({
      name: f.filename,
      url: f.url,
      uuid: f.uuid,
      status: f.status,
      backend: true,
      type: f.type,
      date_emission: f.date_emission,
    });

    setValue("dpi_photo", backendFiles.filter(f => f.type === "dpi_photo").map(mapToBackendFile));
    setValue("antecedentes_penales", backendFiles.filter(f => f.type === "antecedentes_penales").map(mapToBackendFile));
    setValue("antecedentes_policia", backendFiles.filter(f => f.type === "antecedentes_policia").map(mapToBackendFile));
    setValue("other_documents", backendFiles.filter(f => !["dpi_photo", "antecedentes_penales", "antecedentes_policia"].includes(f.type)).map(mapToBackendFile));

    // setValue("antecedentes_penales_file_date", backendFiles.filter(f => f.type === "antecedentes_policia").map(f => f.date_emission));
    // setValue("antecedentes_policia_file_date", backendFiles.filter(f => f.type === "antecedentes_policia").map(f => f.date_emission));

  }, [employeeRes, reset, setValue]);



  const removeFile = (field: keyof UserFormInputs, index: number, isBackend: boolean) => {
    const currentFiles = watch(field) || [];
    const filesToRemove = isBackend
      ? currentFiles.filter(f => f.backend)
      : currentFiles.filter(f => !f.backend);

    const fileToRemove = filesToRemove[index];
    const updatedFiles = currentFiles.filter(f => f !== fileToRemove);

    setValue(field, updatedFiles, { shouldDirty: true });
  };

  const handleStatusChange = (field: keyof UserFormInputs, index: number, newStatus: number) => {
    const current = watch(field) as (File | BackendFile)[];
    const backendFiles = current.filter(f => f.backend) as BackendFile[];
    if (backendFiles[index]) {
      const fileToUpdate = backendFiles[index];
      const updatedFile = { ...fileToUpdate, status: newStatus };
      const updatedFiles = current.map(f => (f as BackendFile).uuid === fileToUpdate.uuid ? updatedFile : f);
      setValue(field, updatedFiles, { shouldDirty: true });
    }
  };

  const handleReUpload = (field: keyof UserFormInputs, index: number, newFile: File) => {
    const current = watch(field) as (File | BackendFile)[];
    const backendFiles = current.filter(f => f.backend) as BackendFile[];

    if (backendFiles[index]) {
      const fileToUpdate = backendFiles[index];
      const otherFiles = current.filter(f => (f as BackendFile).uuid !== fileToUpdate.uuid);
      setValue(field, [...otherFiles, newFile], { shouldDirty: true });
    }
  };

  const submit = async (data: UserFormInputs) => {
    if (!user_id) return;
    try {
      const payload: any = {
        full_name: data.full_name,
        dpi: data.dpi,
        birth_date: data.birth_date,
        phone: data.phone,
        email: data.email,
        status_id: data.status_id,
        office_id: data.office_id ? Number(data.office_id) : null,
        district_id: data.district_id ? Number(data.district_id) : null,
        admin_position_id: data.admin_position_id ? Number(data.admin_position_id) : null,
        operative_position_id: data.operative_position_id ? Number(data.operative_position_id) : null,
        salary: data.salary ? Number(data.salary) : null,
        bonus: data.bonus ? Number(data.bonus) : null,
        user_id: data.user_id,
        description_files: data.description_files ?? "",
        digessp_fecha_vencimiento: data.digessp_fecha_vencimiento ?? null,
        files: [],
        new_files: [],
        user_responsible_id: data.user_responsible_id
      };

      const processField = async (filesArr: (File | BackendFile)[], typeName: string) => {
        for (const f of filesArr) {
          if ('backend' in f && f.backend) {
            payload.files.push({ uuid: f.uuid, status: f.status });
          } else {
            const base64 = await convertFileToBase64(f as File);
            let date_emission: string | null = null
            if (typeName == 'antecedentes_policia') {
              date_emission = data.antecedentes_policia_file_date;
            } else if (typeName == 'antecedentes_penales') {
              date_emission = data.antecedentes_penales_file_date;
            }
            payload.new_files.push({ name: (f as File).name, file: base64, type: typeName, status: 1, date_emission: date_emission });
          }
        }
      };

      await processField(allDpiPhotos, "dpi_photo");
      await processField(allAntecedentesPenales, "antecedentes_penales");
      await processField(allAntecedentesPolicia, "antecedentes_policia");
      await processField(allOtherDocuments, "other_documents");

      await onSubmit(user_id, payload);
      onClose();
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  const handleDownload = (file: BackendFile) => {
    if (!user_id) return;
    downloadFile("employees", user_id, file.name);
  };

  if (!user_id || isLoading) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit(submit)} className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {(
              [
                { id: "datos-personales", label: "Datos Personales" },
                { id: "organizacion", label: "Organización" },
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

        <div className="p-6 space-y-6">
          {activeTab === "datos-personales" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                <input {...register("full_name", { required: true })} className="w-full px-4 py-2 border rounded-lg" />
                {errors.full_name && <span className="text-red-500 text-sm">Requerido</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DPI</label>
                  <input {...register("dpi", { required: true })} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha nacimiento</label>
                  <input type="date" {...register("birth_date")} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input {...register("phone")} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input {...register("email")} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select {...register("status_id")} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Seleccionar estado</option>
                    {statusList?.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          {activeTab === "organizacion" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Oficina</label>
                <select {...register("office_id")} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Seleccionar oficina</option>
                  {offices?.data?.map((o) => <option key={o.id} value={o.id}>{o.code}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distrito</label>
                <select {...register("district_id")} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Seleccionar distrito</option>
                  {districts?.data?.map((d) => <option key={d.id} value={d.id}>{d.code}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Administrativo</label>
                <select {...register("admin_position_id")} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Seleccionar cargo</option>
                  {positionTypes?.data?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Operativo</label>
                <select {...register("operative_position_id")} className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Seleccionar cargo</option>
                  {positionTypes?.data?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          )}
          {activeTab === "documentos" && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Documentos Existentes</h3>
                <ExistingFiles
                  label="Foto DPI"
                  files={existingDpiPhotos}
                  onStatusChange={(i, s) => handleStatusChange("dpi_photo", i, s)}
                  onReUpload={(i, f) => handleReUpload("dpi_photo", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("dpi_photo", i, true)}
                />
                <ExistingFiles label="Antecedentes Penales" files={existingAntecedentesPenales} onStatusChange={(i, s) => handleStatusChange("antecedentes_penales", i, s)} onReUpload={(i, f) => handleReUpload("antecedentes_penales", i, f)} onDownload={handleDownload} onRemove={(i) => removeFile("antecedentes_penales", i, true)} />
                <ExistingFiles label="Antecedentes Policiacos" files={existingAntecedentesPolicia} onStatusChange={(i, s) => handleStatusChange("antecedentes_policia", i, s)} onReUpload={(i, f) => handleReUpload("antecedentes_policia", i, f)} onDownload={handleDownload} onRemove={(i) => removeFile("antecedentes_policia", i, true)} />
                <ExistingFiles label="Otros Documentos" files={existingOtherDocuments} onStatusChange={(i, s) => handleStatusChange("other_documents", i, s)} onReUpload={(i, f) => handleReUpload("other_documents", i, f)} onDownload={handleDownload} onRemove={(i) => removeFile("other_documents", i, true)} />
              </div>

              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Subir Nuevos Documentos</h3>
                <FileUpload
                  label="Foto DPI"
                  name="dpi_photo"
                  files={newDpiPhotos}
                  onRemove={i => removeFile("dpi_photo", i, false)}
                  register={register}
                  setValue={setValue}
                  multiple
                />
                <FileUpload
                  label="Antecedentes Penales"
                  name="antecedentes_penales"
                  files={newAntecedentesPenales}
                  onRemove={i => removeFile("antecedentes_penales", i, false)}
                  register={register}
                  setValue={setValue}
                  multiple
                  enableDate
                  dateName="antecedentes_penales_file_date"
                  dateError={!!errors.antecedentes_penales_file_date}
                  dateRequired={false}
                />
                <FileUpload
                  label="Antecedentes Policiacos"
                  name="antecedentes_policia"
                  files={newAntecedentesPolicia}
                  onRemove={i => removeFile("antecedentes_policia", i, false)}
                  register={register}
                  setValue={setValue}
                  multiple
                  enableDate
                  dateName="antecedentes_policia_file_date"
                  dateError={!!errors.antecedentes_policia_file_date}
                  dateRequired={false}
                />
                <FileUpload
                  label="Otros Documentos"
                  name="other_documents"
                  files={newOtherDocuments}
                  onRemove={i => removeFile("other_documents", i, false)}
                  register={register}
                  setValue={setValue}
                  multiple
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea {...register("description_files")} rows={3} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          )}
          {activeTab === "compensacion" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sueldo inicial (GTQ)</label>
                <input {...register("salary")} type="number" step="0.01" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bonificaciones (GTQ)</label>
                <input {...register("bonus")} type="number" step="0.01" className="w-full px-4 py-2 border rounded-lg" />
              </div>
              {(watch("salary") || watch("bonus")) && (
                <div className="md:col-span-2 mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Mensual</p>
                  <p className="text-2xl font-bold text-[#cf2e2e]">
                    Q {(parseFloat(watch("salary") || "0") + parseFloat(watch("bonus") || "0")).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
          {activeTab === "tracking" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seguimiento de Aprobación</h3>
              <ApprovalTracker steps={employeeRes?.data?.trackings || []} />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asignar responsable siguiente fase</label>
                  <select {...register("user_responsible_id")} className="w-full px-4 py-2 border rounded-lg">
                    <option value="">Seleccionar Usuario Responsable</option>
                    {UserList?.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">{isDirty ? "Cambios sin guardar" : "Sin cambios"}</div>
          <div className="flex items-center space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting || !isDirty} className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] disabled:bg-gray-400">
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
