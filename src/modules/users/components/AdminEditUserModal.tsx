import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, RefreshCw } from "lucide-react";
import { RolesListResponse } from "@/interfaces/roles.lists.response";
import { StatusEmployeesListResponse } from "@/interfaces/status_employees.lists.response";
import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { User } from "../interfaces/user.response";
import { useUser } from '../hooks/useUser';
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { useOfficesList } from "@/seguros/hooks/useOfficesList";

interface AdminEditUserModalProps {
  id: number;
  roles: RolesListResponse;
  status_employees: StatusEmployeesListResponse;
  districts: DistrictsListResponse;
  onClose: () => void;
  onSave: (data: Partial<User>) => Promise<void> | void;
}

interface UserFormInputs {
  name: string;
  email: string;
  password: string;
  status: number;
  dpi: string;
  phone: string;
  district: number[];
  office: number[];
  observations: string;
  role_id: number;
}

type TabType =
  | "identidad"
  | "rol-permisos"
  | "asignacion-territorial"
  | "seguridad"
  | "observaciones";

export function AdminEditUserModal({
  id,
  roles,
  status_employees,
  districts,
  onClose,
  onSave,
}: AdminEditUserModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("identidad");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isLoading, isError, data: userData } = useUser(id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<UserFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      status: undefined,
      dpi: '',
      phone: '',
      district: [],
      office: [],
      observations: '',
      role_id: undefined,
    }
  });

  const user = userData?.data;
  console.log('User Edit Modal User: ', user);

  useEffect(() => {
    reset({
      name: user?.name,
      email: user?.email,
      dpi: user?.dpi,
      phone: user?.phone,
      observations: user?.observations ?? "",
      status: user?.status_id,
      role_id: user?.role_id,
      district: user?.districtIds ?? [],
      office: user?.officeIds ?? [],
      password: "",
    });
  }, [user, reset]);

  /** GENERAR PASSWORD */
  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";

    for (let i = 0; i < 12; i++) {
      pwd += charset[Math.floor(Math.random() * charset.length)];
    }

    setValue("password", pwd, { shouldValidate: true });
  };

  /** COPIAR PASSWORD */
  const copyPassword = async () => {
    const password = watch("password");
    if (!password) return;

    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /** Cerrar con ESC */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /** SUBMIT */
  const onSubmitForm = (data: any) => {
    if (!data.password) delete data.password;

    onSave({
      id: id,
      ...data,
    });
  };
  const [office, setOffice] = useState<any[]>([]);
  const selectedDistrict = watch("district");
  const selectedOffice = watch("office");
  console.log(`Selected Distritos: `, selectedDistrict[0])
  const { data: officesList, isLoading: loadingOffices } = useOfficesList({
    district_id: selectedDistrict[0],
    user_id: 0,
  });

  const offices = selectedDistrict[0] == undefined ? {
    error: false,
    code: 200,
    data: []
  } : officesList;

  /** TABS */
  const tabs = [
    { id: "identidad", label: "Identidad" },
    { id: "rol-permisos", label: "Rol y Permisos" },
    { id: "asignacion-territorial", label: "Asignación Territorial" },
    { id: "seguridad", label: "Seguridad" },
    { id: "observaciones", label: "Observaciones" },
  ];


  if (isError) {
    onClose();
  }

  if (isLoading) {
    return <CustomFullScreenLoading />
  }


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Editar Usuario</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* TABS */}
        <div className="px-6 border-b">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "py-3 px-1 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "text-[#cf2e2e] border-b-2 border-[#cf2e2e]"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex-1 overflow-y-auto p-6">

          {/* IDENTIDAD */}
          {activeTab === "identidad" && (
            <div className="space-y-4">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre Completo
                </label>
                <input
                  {...register("name", { required: true })}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg",
                    errors.name && "border-red-500"
                  )}
                />
              </div>

              {/* Email + DPI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    {...register("email", { required: true })}
                    className={cn(
                      "w-full px-4 py-2 border rounded-lg",
                      errors.email && "border-red-500"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    DPI
                  </label>
                  <input
                    {...register("dpi", { required: true })}
                    className={cn(
                      "w-full px-4 py-2 border rounded-lg",
                      errors.dpi && "border-red-500"
                    )}
                  />
                </div>
              </div>

              {/* Teléfono + Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    {...register("phone")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado
                  </label>
                  <select
                    {...register("status", { required: true })}
                    className={cn(
                      "w-full px-4 py-2 border rounded-lg",
                      errors.status && "border-red-500"
                    )}
                  >
                    <option value="">Seleccione</option>
                    {status_employees.data.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ROL */}
          {activeTab === "rol-permisos" && (
            <div>
              <label className="block text-sm font-medium mb-2">Rol</label>
              <select
                {...register("role_id", { required: true })}
                className={cn(
                  "w-full px-4 py-2 border rounded-lg",
                  errors.role_id && "border-red-500"
                )}
              >
                <option value="">Seleccione</option>
                {roles.data.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ASIGNACIÓN TERRITORIAL */}
          {activeTab === "asignacion-territorial" && (
            <div className="space-y-6">

              {/* DISTRITO */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Distrito
                </label>
                <select
                  onChange={(e) =>
                    setValue("district", [Number(e.target.value)], {
                      shouldValidate: true,
                    })
                  }
                  value={selectedDistrict[0] ?? ""}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Seleccione distrito</option>
                  {districts.data.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* OFICINA */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Oficina
                </label>
                <select
                  disabled={loadingOffices}
                  onChange={(e) =>
                    setValue("office", [Number(e.target.value)], {
                      shouldValidate: true,
                    })
                  }
                  value={selectedOffice[0] ?? ""}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Seleccione oficina</option>
                  {loadingOffices && <option>⏳ Cargando...</option>}

                  {offices?.data?.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.code}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* SEGURIDAD */}
          {activeTab === "seguridad" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Nueva contraseña (opcional)
              </label>

              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={generatePassword}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <RefreshCw size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={copyPassword}
                    className={cn(
                      "px-3 py-1 rounded text-sm",
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    )}
                  >
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OBSERVACIONES */}
          {activeTab === "observaciones" && (
            <div>
              <label className="block text-sm font-medium mb-2">Observaciones</label>
              <textarea
                {...register("observations")}
                rows={6}
                className="w-full px-4 py-2 border rounded-lg resize-none"
              />
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-6 flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-8 py-2 bg-red-600 text-white rounded-lg"
            >
              Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
