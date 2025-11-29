import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { RolesListResponse } from '@/interfaces/roles.lists.response';
import { StatusEmployeesListResponse } from '@/interfaces/status_employees.lists.response';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';
import { User } from '../interfaces/user';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface AdminCreateUserModalProps {
  onClose: () => void;
  roles: RolesListResponse;
  status_employees: StatusEmployeesListResponse;
  districts: DistrictsListResponse;
  onSubmit: (data: Partial<User>) => Promise<void> | void;
}

interface UserFormInputs {
  name: string;
  email: string;
  password: string;
  status: number;
  dpi: string;
  phone: string;
  district: number[];
  observations: string;
  role_id: number;
}

type TabType = 'identidad' | 'rol-permisos' | 'asignacion-territorial' | 'seguridad' | 'observaciones';

export function AdminCreateUserModal({
  onClose,
  roles,
  status_employees,
  districts,
  onSubmit
}: AdminCreateUserModalProps) {

  const [activeTab, setActiveTab] = useState<TabType>('identidad');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      observations: '',
      role_id: undefined,
    }
  });

  const selectedDistritos = watch('district');

  // Toggle de distritos
  const handleDistritoToggle = (id: number) => {
    const newValue = selectedDistritos.includes(id)
      ? selectedDistritos.filter(d => d !== id)
      : [...selectedDistritos, id];

    setValue('district', newValue, { shouldValidate: true });
  };

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const length = 12;

    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setValue("password", pwd, { shouldValidate: true });
  };

  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const onSubmitForm = (data: UserFormInputs) => {
    console.log('Submitting User:', data);
    onSubmit(data);
  };

  const tabs = [
    { id: 'identidad', label: 'Identidad' },
    { id: 'rol-permisos', label: 'Rol y Permisos' },
    { id: 'asignacion-territorial', label: 'Asignación Territorial' },
    { id: 'seguridad', label: 'Seguridad' },
    { id: 'observaciones', label: 'Observaciones' }
  ] as const;

  const [copied, setCopied] = useState(false);
  const copyPassword = async () => {
    const password = watch("password");
    if (!password) return;

    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* TABS */}
        <div className="px-6 border-b">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
          {activeTab === 'identidad' && (
            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-600",
                    errors.name && "border-red-500"
                  )}
                />
              </div>

              {/* Email y DPI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    className={cn(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-600",
                      errors.email && "border-red-500"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    DPI <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("dpi", { required: true })}
                    maxLength={13}
                    className={cn(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-600",
                      errors.dpi && "border-red-500"
                    )}
                  />
                </div>
              </div>

              {/* Teléfono + Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono</label>
                  <input
                    {...register("phone")}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("status", { required: true })}
                    className={cn(
                      "w-full px-4 py-2.5 border rounded-lg focus:ring-2",
                      errors.status && "border-red-500"
                    )}
                  >
                    <option value="">Seleccione</option>
                    {status_employees?.data.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ROL Y PERMISOS */}
          {activeTab === 'rol-permisos' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Rol <span className="text-red-500">*</span>
              </label>

              <select
                {...register("role_id", { required: true })}
                className={cn(
                  "w-full px-4 py-2.5 border rounded-lg focus:ring-2",
                  errors.role_id && "border-red-500"
                )}
              >
                <option value="">Seleccionar rol</option>
                {roles?.data.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* DISTRITOS */}
          {activeTab === 'asignacion-territorial' && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Distrito <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {districts?.data.map(d => (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => handleDistritoToggle(d.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium",
                      selectedDistritos.includes(d.id)
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    )}
                  >
                    {d.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SEGURIDAD */}
          {activeTab === 'seguridad' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Contraseña <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-lg focus:ring-2",
                    errors.password && "border-red-500"
                  )}
                />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  {/* Show Password Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  {/* Generate Password Button */}
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                  >
                    <RefreshCw size={14} />
                    <span>Generar</span>
                  </button>

                  {/* Copy Password Button */}
                  <button
                    type="button"
                    onClick={copyPassword}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${copied ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {copied ? (
                      <>
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OBSERVACIONES */}
          {activeTab === 'observaciones' && (
            <div>
              <label className="block text-sm font-medium mb-2">Observaciones</label>
              <textarea
                {...register("observations")}
                rows={8}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 resize-none"
              />
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-6 flex justify-between border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Crear Usuario
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
