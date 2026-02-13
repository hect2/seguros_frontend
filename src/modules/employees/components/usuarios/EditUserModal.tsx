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
import { useFindStatusEmployeeSlugById } from "@/utils/useFindStatusEmployee";
import { useBusinessList } from "@/seguros/hooks/useBusinessList";
import { PermissionGuard } from "@/components/PermissionGuard";
import { useServicePositionsList } from "@/seguros/hooks/useServicePositionsList";
import axios from "axios";
import { toast } from "sonner";
import { api } from "@/api/api";
import { useDeactivateEmployee } from "../../hooks/useDeactivateEmployee";

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
  cuenta_bancaria?: (File | BackendFile)[];
  certificado_nacimiento?: (File | BackendFile)[];
  diploma_estudios?: (File | BackendFile)[];
  certificado_capacitacion?: (File | BackendFile)[];
  poligrafia?: (File | BackendFile)[];
  fotografia?: (File | BackendFile)[];
  boleta_deposito?: (File | BackendFile)[];
  contrato?: (File | BackendFile)[];
  seguro_vida?: (File | BackendFile)[];
  other_documents?: (File | BackendFile)[];
  description_files?: string;
  digessp_fecha_vencimiento?: string;
  status_id?: string;

  user_responsible_id: string;

  antecedentes_penales_file_date: string | null;
  antecedentes_policia_file_date: string | null;

  employee_code: string;
  admission_date: string;
  departure_date?: string;

  client_id: string;
  service_position_id: string;
  position_id: string;
  employee_status_id: string;

  turn?: string;
  reason_for_leaving?: string;
  suspension_date?: string;

  life_insurance_code?: string;
  digessp_code?: string;
  digessp_code_expiration_date?: string;
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

type TabType = "datos-personales" | "datos-laborales" | "organizacion" | "documentos" | "compensacion" | "tracking";

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
  const { data: BusinessList } = useBusinessList();
  const { findStatusEmployeeSlugByName } = useFindStatusEmployeeSlugById();
  const [isStatusSelectChanged, setIsStatusSelectChanged] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<UserFormInputs | null>(null);
  const { deactivate, isLoading: isLoadingDeactivate } = useDeactivateEmployee(user_id ?? 0);

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
      digessp_fecha_vencimiento: "",
      status_id: "",
      user_responsible_id: "",

      employee_code: "",
      admission_date: "",
      departure_date: "",

      client_id: "",
      service_position_id: "",
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

  const allDpiPhotos = watch("dpi_photo") || [];
  const allAntecedentesPenales = watch("antecedentes_penales") || [];
  const allAntecedentesPolicia = watch("antecedentes_policia") || [];
  const allOtherDocuments = watch("other_documents") || [];
  const allCuentaBancaria = watch("cuenta_bancaria") || [];
  const allCertificadoNacimiento = watch("certificado_nacimiento") || [];
  const allDiplomaEstudios = watch("diploma_estudios") || [];
  const allCertificadoCapacitacion = watch("certificado_capacitacion") || [];
  const allPoligrafia = watch("poligrafia") || [];
  const allFotografia = watch("fotografia") || [];
  const allBoletaDeposito = watch("boleta_deposito") || [];
  const allContrato = watch("contrato") || [];
  const allSeguroVida = watch("seguro_vida") || [];

  const existingDpiPhotos = allDpiPhotos.filter((f) => f.backend) as BackendFile[];
  const newDpiPhotos = allDpiPhotos.filter((f) => !f.backend) as File[];

  const existingAntecedentesPenales = allAntecedentesPenales.filter((f) => f.backend) as BackendFile[];
  const newAntecedentesPenales = allAntecedentesPenales.filter((f) => !f.backend) as File[];

  const existingAntecedentesPolicia = allAntecedentesPolicia.filter((f) => f.backend) as BackendFile[];
  const newAntecedentesPolicia = allAntecedentesPolicia.filter((f) => !f.backend) as File[];

  const existingOtherDocuments = allOtherDocuments.filter((f) => f.backend) as BackendFile[];
  const newOtherDocuments = allOtherDocuments.filter((f) => !f.backend) as File[];
  /* ===================== */
  /* Cuenta Bancaria */
  const existingCuentaBancariaDocuments = allCuentaBancaria.filter((f) => f.backend) as BackendFile[];
  const newCuentaBancariaDocuments = allCuentaBancaria.filter((f) => !f.backend) as File[];

  /* Certificado Nacimiento */
  const existingCertificadoNacimientoDocuments = allCertificadoNacimiento.filter((f) => f.backend) as BackendFile[];
  const newCertificadoNacimientoDocuments = allCertificadoNacimiento.filter((f) => !f.backend) as File[];

  /* Diploma Estudios */
  const existingDiplomaEstudiosDocuments = allDiplomaEstudios.filter((f) => f.backend) as BackendFile[];
  const newDiplomaEstudiosDocuments = allDiplomaEstudios.filter((f) => !f.backend) as File[];

  /* Certificado Capacitación */
  const existingCertificadoCapacitacionDocuments = allCertificadoCapacitacion.filter((f) => f.backend) as BackendFile[];
  const newCertificadoCapacitacionDocuments = allCertificadoCapacitacion.filter((f) => !f.backend) as File[];

  /* Poligrafía */
  const existingPoligrafiaDocuments = allPoligrafia.filter((f) => f.backend) as BackendFile[];
  const newPoligrafiaDocuments = allPoligrafia.filter((f) => !f.backend) as File[];

  /* Fotografía */
  const existingFotografiaDocuments = allFotografia.filter((f) => f.backend) as BackendFile[];
  const newFotografiaDocuments = allFotografia.filter((f) => !f.backend) as File[];

  /* Boleta Depósito */
  const existingBoletaDepositoDocuments = allBoletaDeposito.filter((f) => f.backend) as BackendFile[];
  const newBoletaDepositoDocuments = allBoletaDeposito.filter((f) => !f.backend) as File[];

  /* Contrato */
  const existingContratoDocuments = allContrato.filter((f) => f.backend) as BackendFile[];
  const newContratoDocuments = allContrato.filter((f) => !f.backend) as File[];

  /* Seguro Vida */
  const existingSeguroVidaDocuments = allSeguroVida.filter((f) => f.backend) as BackendFile[];
  const newSeguroVidaDocuments = allSeguroVida.filter((f) => !f.backend) as File[];

  const selectedClientId = watch("client_id");

  const {
    data: servicePositions,
    isLoading: loadingServicePositions,
  } = useServicePositionsList(selectedClientId, watch('office_id'));
  // useEffect(() => {
  //   setValue("service_position_id", "");
  // }, [selectedClientId, setValue]);


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

      employee_code: emp.positions[0].employee_code ?? "",
      admission_date: emp.positions[0].admission_date ?? "",
      departure_date: emp.positions[0].departure_date ?? "",

      client_id: emp.positions[0].client_id ?? "",
      service_position_id: emp.positions?.[0]?.service_position_id ?? "",

      turn: emp.positions[0].turn ?? "",
      reason_for_leaving: emp.positions[0].reason_for_leaving ?? "",
      suspension_date: emp.positions[0].suspension_date ?? "",

      life_insurance_code: emp.positions[0].life_insurance_code ?? "",
      digessp_code: emp.digessp_code ?? "",
      digessp_code_expiration_date: emp.digessp_fecha_vencimiento ?? "",
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
    setValue("cuenta_bancaria", backendFiles.filter(f => f.type === "cuenta_bancaria").map(mapToBackendFile));
    setValue("certificado_nacimiento", backendFiles.filter(f => f.type === "certificado_nacimiento").map(mapToBackendFile));
    setValue("diploma_estudios", backendFiles.filter(f => f.type === "diploma_estudios").map(mapToBackendFile));
    setValue("certificado_capacitacion", backendFiles.filter(f => f.type === "certificado_capacitacion").map(mapToBackendFile));
    setValue("poligrafia", backendFiles.filter(f => f.type === "poligrafia").map(mapToBackendFile));
    setValue("fotografia", backendFiles.filter(f => f.type === "fotografia").map(mapToBackendFile));
    setValue("boleta_deposito", backendFiles.filter(f => f.type === "boleta_deposito").map(mapToBackendFile));
    setValue("contrato", backendFiles.filter(f => f.type === "contrato").map(mapToBackendFile));
    setValue("seguro_vida", backendFiles.filter(f => f.type === "seguro_vida").map(mapToBackendFile));
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

    if (data.user_responsible_id) {
      setPendingSubmitData(data);
      setShowConfirmModal(true);
      return;
    }
    await processSubmit(data);
    // try {
    //   const payload: any = {
    //     full_name: data.full_name,
    //     dpi: data.dpi,
    //     birth_date: data.birth_date,
    //     phone: data.phone,
    //     email: data.email,
    //     status_id: data.status_id,
    //     office_id: data.office_id ? Number(data.office_id) : null,
    //     district_id: data.district_id ? Number(data.district_id) : null,
    //     admin_position_id: data.admin_position_id ? Number(data.admin_position_id) : null,
    //     operative_position_id: data.operative_position_id ? Number(data.operative_position_id) : null,
    //     salary: data.salary ? Number(data.salary) : null,
    //     bonus: data.bonus ? Number(data.bonus) : null,
    //     user_id: data.user_id,
    //     description_files: data.description_files ?? "",
    //     digessp_fecha_vencimiento: data.digessp_fecha_vencimiento ?? null,
    //     files: [],
    //     new_files: [],
    //     user_responsible_id: data.user_responsible_id
    //   };

    //   const processField = async (filesArr: (File | BackendFile)[], typeName: string) => {
    //     for (const f of filesArr) {
    //       if ('backend' in f && f.backend) {
    //         payload.files.push({ uuid: f.uuid, status: f.status });
    //       } else {
    //         const base64 = await convertFileToBase64(f as File);
    //         let date_emission: string | null = null
    //         if (typeName == 'antecedentes_policia') {
    //           date_emission = data.antecedentes_policia_file_date;
    //         } else if (typeName == 'antecedentes_penales') {
    //           date_emission = data.antecedentes_penales_file_date;
    //         }
    //         payload.new_files.push({ name: (f as File).name, file: base64, type: typeName, status: 1, date_emission: date_emission });
    //       }
    //     }
    //   };

    //   await processField(allDpiPhotos, "dpi_photo");
    //   await processField(allAntecedentesPenales, "antecedentes_penales");
    //   await processField(allAntecedentesPolicia, "antecedentes_policia");
    //   await processField(allOtherDocuments, "other_documents");

    //   await onSubmit(user_id, payload);
    //   onClose();
    // } catch (err) {
    //   console.error("Error updating employee:", err);
    // }
  };

  const processSubmit = async (data: UserFormInputs) => {
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
        user_responsible_id: data.user_responsible_id,
        description_files: data.description_files ?? "",
        digessp_fecha_vencimiento: data.digessp_fecha_vencimiento ?? null,
        files: [],
        new_files: [],
        employee_code: data.employee_code ?? "",
        admission_date: data.admission_date ?? "",
        departure_date: data.departure_date ?? "",

        client_id: data.client_id ?? "",
        service_position_id: data.service_position_id ?? "",
        turn: data.turn ?? "",
        reason_for_leaving: data.reason_for_leaving ?? "",
        suspension_date: data.suspension_date ?? "",

        life_insurance_code: data.life_insurance_code ?? "",
        digessp_code: data.digessp_code ?? "",
      };

      const processField = async (filesArr: (File | BackendFile)[], typeName: string) => {
        for (const f of filesArr) {
          if ("backend" in f && f.backend) {
            payload.files.push({ uuid: f.uuid, status: f.status });
          } else {
            const base64 = await convertFileToBase64(f as File);
            let date_emission: string | null = null;

            if (typeName === "antecedentes_policia") {
              date_emission = data.antecedentes_policia_file_date;
            } else if (typeName === "antecedentes_penales") {
              date_emission = data.antecedentes_penales_file_date;
            }

            payload.new_files.push({
              name: (f as File).name,
              file: base64,
              type: typeName,
              status: 1,
              date_emission,
            });
          }
        }
      };

      await processField(allDpiPhotos, "dpi_photo");
      await processField(allCuentaBancaria, "cuenta_bancaria");
      await processField(allCertificadoNacimiento, "certificado_nacimiento");
      await processField(allDiplomaEstudios, "diploma_estudios");
      await processField(allCertificadoCapacitacion, "certificado_capacitacion");
      await processField(allPoligrafia, "poligrafia");
      await processField(allFotografia, "fotografia");
      await processField(allBoletaDeposito, "boleta_deposito");
      await processField(allContrato, "contrato");
      await processField(allSeguroVida, "seguro_vida");
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

  const selectedStatusId = watch("status_id");
  const needsResponsible = ["under_review", "account_validation", "approval"];

  // const handleDeactivate = async () => {
  //   try {
  //     const { data } = await api<any>({
  //       url: `/employees/deactivate/${user_id}`,
  //       method: 'POST',
  //       data: {
  //         inactive_user: true,
  //       },
  //     });

  //     toast.success("Usuario dado de baja correctamente");
  //     setShowConfirmModal(false);
  //     onClose();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error al dar de baja");
  //   }
  // };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={handleSubmit(submit)} className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>
          {Object.keys(errors).length > 0 && (
            <div className="text-red-600 text-sm mb-4">
              ⚠️ Faltan campos por completar en otras secciones.
            </div>
          )}
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {(
              [
                { id: "datos-personales", label: "Datos Personales" },
                { id: "datos-laborales", label: "Datos Laborales" },
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

          {/* DATOS PERSONALES */}
          <div className={activeTab === "datos-personales" ? "block" : "hidden"}>
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
          </div>

          {/* ORGANIZACIÓN */}
          <div className={activeTab === "organizacion" ? "block" : "hidden"}>
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

              {/* Puesto de Servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puesto de Servicio <span className="text-red-500">*</span>
                </label>

                <select
                  disabled={!selectedClientId || loadingServicePositions}
                  value={watch("service_position_id")}
                  // onChange={(e) =>
                  //   setValue("service_position_id", e.target.value, { shouldValidate: true })
                  // }
                  {...register("service_position_id", { required: true })}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg",
                    errors.service_position_id && "border-red-500"
                  )}
                >
                  <option value="">
                    {!selectedClientId
                      ? "Seleccione primero un cliente"
                      : loadingServicePositions
                        ? "Cargando puestos..."
                        : "Seleccionar puesto de servicio"}
                  </option>

                  {servicePositions?.data?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {errors.service_position_id && (
                  <span className="text-red-500 text-sm">
                    El puesto de servicio es requerido
                  </span>
                )}
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
                <ExistingFiles
                  label="Cuenta bancaria"
                  files={existingCuentaBancariaDocuments}
                  onStatusChange={(i, s) => handleStatusChange("cuenta_bancaria", i, s)}
                  onReUpload={(i, f) => handleReUpload("cuenta_bancaria", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("cuenta_bancaria", i, true)}
                />

                <ExistingFiles
                  label="Certificado de nacimiento"
                  files={existingCertificadoNacimientoDocuments}
                  onStatusChange={(i, s) => handleStatusChange("certificado_nacimiento", i, s)}
                  onReUpload={(i, f) => handleReUpload("certificado_nacimiento", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("certificado_nacimiento", i, true)}
                />

                <ExistingFiles
                  label="Diploma de estudios"
                  files={existingDiplomaEstudiosDocuments}
                  onStatusChange={(i, s) => handleStatusChange("diploma_estudios", i, s)}
                  onReUpload={(i, f) => handleReUpload("diploma_estudios", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("diploma_estudios", i, true)}
                />

                <ExistingFiles
                  label="Certificado de capacitación"
                  files={existingCertificadoCapacitacionDocuments}
                  onStatusChange={(i, s) => handleStatusChange("certificado_capacitacion", i, s)}
                  onReUpload={(i, f) => handleReUpload("certificado_capacitacion", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("certificado_capacitacion", i, true)}
                />

                <ExistingFiles
                  label="Poligrafía"
                  files={existingPoligrafiaDocuments}
                  onStatusChange={(i, s) => handleStatusChange("poligrafia", i, s)}
                  onReUpload={(i, f) => handleReUpload("poligrafia", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("poligrafia", i, true)}
                />

                <ExistingFiles
                  label="Fotografía"
                  files={existingFotografiaDocuments}
                  onStatusChange={(i, s) => handleStatusChange("fotografia", i, s)}
                  onReUpload={(i, f) => handleReUpload("fotografia", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("fotografia", i, true)}
                />

                <ExistingFiles
                  label="Boleta de depósito"
                  files={existingBoletaDepositoDocuments}
                  onStatusChange={(i, s) => handleStatusChange("boleta_deposito", i, s)}
                  onReUpload={(i, f) => handleReUpload("boleta_deposito", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("boleta_deposito", i, true)}
                />

                <ExistingFiles
                  label="Contrato"
                  files={existingContratoDocuments}
                  onStatusChange={(i, s) => handleStatusChange("contrato", i, s)}
                  onReUpload={(i, f) => handleReUpload("contrato", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("contrato", i, true)}
                />

                <ExistingFiles
                  label="Seguro de vida"
                  files={existingSeguroVidaDocuments}
                  onStatusChange={(i, s) => handleStatusChange("seguro_vida", i, s)}
                  onReUpload={(i, f) => handleReUpload("seguro_vida", i, f)}
                  onDownload={handleDownload}
                  onRemove={(i) => removeFile("seguro_vida", i, true)}
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
                {/* Cuenta bancaria */}
                <FileUpload
                  label="Cuenta bancaria"
                  name="cuenta_bancaria"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  multiple={true}
                  files={newCuentaBancariaDocuments}
                  onRemove={(index) => removeFile("cuenta_bancaria", index, false)}
                  error={!!errors.cuenta_bancaria}
                  fileRequired={true}
                  title_error={'La Cuenta bancaria es requerido'}
                />

                {/* Certificado de nacimiento */}
                <FileUpload
                  label="Certificado de nacimiento"
                  name="certificado_nacimiento"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  multiple={true}
                  files={newCertificadoNacimientoDocuments}
                  onRemove={(index) => removeFile("certificado_nacimiento", index, false)}
                  error={!!errors.certificado_nacimiento}
                  fileRequired={true}
                  title_error={'El Certificado de nacimiento es requerido'}
                />

                {/* Diploma de estudios */}
                <FileUpload
                  label="Diploma de estudios"
                  name="diploma_estudios"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  multiple={true}
                  files={newDiplomaEstudiosDocuments}
                  onRemove={(index) => removeFile("diploma_estudios", index, false)}
                  error={!!errors.diploma_estudios}
                  fileRequired={true}
                  title_error={'El Diploma de estudios es requerido'}
                />

                {/* Certificado de capacitación */}
                <FileUpload
                  label="Certificado de capacitación"
                  name="certificado_capacitacion"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  multiple={true}
                  files={newCertificadoCapacitacionDocuments}
                  onRemove={(index) => removeFile("certificado_capacitacion", index, false)}
                  error={!!errors.certificado_capacitacion}
                  fileRequired={true}
                  title_error={'El Certificado de capacitación es requerido'}
                />

                {/* Poligrafía */}
                <FileUpload
                  label="Poligrafía"
                  name="poligrafia"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  multiple={true}
                  files={newPoligrafiaDocuments}
                  onRemove={(index) => removeFile("poligrafia", index, false)}
                  error={!!errors.poligrafia}
                  fileRequired={true}
                  title_error={'La Poligrafía es requerida'}
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
                {/* Fotografía */}
                <FileUpload
                  label="Fotografía"
                  name="fotografia"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  multiple={true}
                  files={newFotografiaDocuments}
                  onRemove={(index) => removeFile("fotografia", index, false)}
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
                  files={newBoletaDepositoDocuments}
                  onRemove={(index) => removeFile("boleta_deposito", index, false)}
                  error={!!errors.boleta_deposito}
                />

                {/* Contrato */}
                <FileUpload
                  label="Contrato"
                  name="contrato"
                  register={register}
                  setValue={setValue}
                  multiple={true}
                  files={newContratoDocuments}
                  onRemove={(index) => removeFile("contrato", index, false)}
                  error={!!errors.contrato}
                />

                {/* Seguro de vida */}
                <FileUpload
                  label="Seguro de vida"
                  name="seguro_vida"
                  register={register}
                  setValue={setValue}
                  multiple={true}
                  files={newSeguroVidaDocuments}
                  onRemove={(index) => removeFile("seguro_vida", index, false)}
                  error={!!errors.seguro_vida}
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
          </div>

          {/* COMPENSACION */}
          <div className={activeTab === "compensacion" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sueldo inicial (GTQ)</label>
                <input {...register("salary")} type="number" step="0.01" className="w-full px-4 py-2 border rounded-lg" />
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
                    Q {(parseFloat(watch("salary") || "0") + parseFloat(watch("bonus") || "0")).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* TRACKING */}
          <div className={activeTab === "tracking" ? "block" : "hidden"}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seguimiento de Aprobación</h3>
              <ApprovalTracker steps={employeeRes?.data?.trackings || []} />
              {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asignar responsable siguiente fase</label>
                  <select {...register("user_responsible_id")}
                    className={cn("w-full px-4 py-2 border rounded-lg", { "border-red-500": errors.user_responsible_id })}
                  >
                    <option value="">Seleccionar Usuario Responsable</option>
                    {UserList?.data?.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.user_responsible_id && (
                    <span className="text-red-500 text-sm">Usuario Responsable es Requerido</span>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">{isDirty ? "Cambios sin guardar" : "Sin cambios"}</div>
          <div className="flex items-center space-x-3">
            <div>
              {/* <button
                type="button"
                className="px-3 py-2 rounded-lg bg-red-600 text-white"
                onClick={() => setShowConfirmModal(true)}
              >
                Dar de baja
              </button> */}
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-red-600 text-white"
                onClick={() => setShowConfirmModal(true)}
                disabled={isLoadingDeactivate}
              >
                {isLoadingDeactivate ? "Procesando..." : "Dar de baja"}
              </button>

            </div>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={isSubmitting || !isDirty} className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] disabled:bg-gray-400">
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>

          </div>
        </div>
      </form>
      {/* {showConfirmModal && pendingSubmitData && (
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
      )} */}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Confirmar baja
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro que deseas dar de baja a este empleado?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={() => deactivate()}
              >
                Sí, dar de baja
              </button>
            </div>
          </div>
        </div>
      )}




    </div>
  );
}
