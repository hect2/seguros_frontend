import React, { useEffect, useState } from 'react';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import { ApprovalTracker } from './ApprovalTracker';
import { useEmployee } from '../../hooks/useEmployee';
import { downloadFile } from '@/utils/downloadFile';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { getStatusUserColor } from '@/utils/get_status_users_color';
import { useFindStatusEmployee } from '@/utils/useFindStatusEmployee';
import { cn } from '@/lib/utils';

interface UserDetailModalProps {
  user_id: number;
  onClose: () => void;
}

type TabType =
  | 'datos-personales'
  | 'organizacion'
  | 'documentos'
  | 'compensacion'
  | 'tracking';

export function UserDetailModal({ user_id, onClose }: UserDetailModalProps) {
  const { data, isLoading } = useEmployee(user_id);
  const { findstatus } = useFindStatusEmployee();
  const user = data?.data;

  const [activeTab, setActiveTab] = useState<TabType>('datos-personales');

  const getInitials = (nombre: string = '') => {
    const words = nombre.split(' ').filter(Boolean);
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  // safe access helpers
  const position0 = user?.positions?.[0] ?? null;
  const filesList = Array.isArray(user?.files?.files) ? user!.files.files : [];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#cf2e2e] flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitials(user?.full_name ?? '')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
              <p className="text-sm text-gray-600">
                Código: {user?.dpi} | DPI: {user?.dpi}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusUserColor(
                String(user?.status?.slug ?? '')
              )}`}
            >
              {findstatus(Number(user?.status_id))?.name}
            </span>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs (igual estilo CreateUserModal) */}
        <div className="px-6 pt-4 bg-white border-b border-gray-100">
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {(
              [
                { id: 'datos-personales', label: 'Datos Personales' },
                { id: 'organizacion', label: 'Organización' },
                { id: 'documentos', label: 'Documentos' },
                { id: 'compensacion', label: 'Compensación' },
                { id: 'tracking', label: 'Tracking' },
              ] as { id: TabType; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'py-3 px-1 font-medium text-sm whitespace-nowrap',
                  activeTab === t.id
                    ? 'text-[#cf2e2e] border-b-2 border-[#cf2e2e]'
                    : 'text-gray-600 hover:text-gray-800'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - main content spans 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* DATOS PERSONALES TAB */}
              <div className={activeTab === 'datos-personales' ? 'block' : 'hidden'}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Información Personal</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.full_name ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Número DPI</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.dpi ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.email ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.phone ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha de nacimiento</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.birth_date
                          ? new Date(user.birth_date).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ORGANIZACIÓN TAB */}
              <div className={activeTab === 'organizacion' ? 'block' : 'hidden'}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span>🏢</span>
                    <span>Información Organizacional</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Distrito</p>
                      <p className="text-sm font-semibold text-blue-600">{position0?.district?.code ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Oficina</p>
                      <p className="text-sm font-semibold text-gray-900">{position0?.office?.code ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cargo Administrativo</p>
                      <p className="text-sm font-semibold text-gray-900">{position0?.admin_position_type?.name ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cargo Operativo</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {position0?.operative_position_type?.name ?? 'Sin asignar'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.status?.name ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Usuario Responsable</p>
                      <p className="text-sm font-semibold text-gray-900">{user?.responsible?.name ?? '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOCUMENTOS TAB */}
              <div className={activeTab === 'documentos' ? 'block' : 'hidden'}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span>📄</span>
                    <span>Documentos</span>
                  </h3>

                  <div className="space-y-3">
                    {filesList.length > 0 ? (
                      filesList.map((file: any, index: number) => (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" key={index}>
                          <button
                            onClick={() => downloadFile('employees', user?.id, file.filename)}
                            className="flex items-center space-x-3 text-left"
                          >
                            <div>
                              {file.status === 1 && (
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <span className="text-green-600 text-xl">✓</span>
                                </div>
                              )}
                              {file.status === 2 && (
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                  <span className="text-red-600 text-xl">x</span>
                                </div>
                              )}
                              {file.status === 0 && (
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                  <span className="text-yellow-600 text-xl">…</span>
                                </div>
                              )}
                            </div>

                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                              <p className="text-xs text-gray-500">
                                Emisión:{' '}
                                {file?.date_emission
                                  ? new Date(file.date_emission).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })
                                  : 'Sin fecha'}
                              </p>
                            </div>
                          </button>

                          <div className="ml-4">
                            {file.status === 1 && (
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                Aprobado
                              </span>
                            )}
                            {file.status === 2 && (
                              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                Rechazado
                              </span>
                            )}
                            {file.status === 0 && (
                              <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                Pendiente
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No hay archivos disponibles.</p>
                    )}
                  </div>

                  {/* Observaciones si existen */}
                  {user?.files?.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-1">Observaciones</p>
                      <p className="text-sm text-gray-800">{user.files.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Compensation & Tracking (siempre visible en su columna) */}
            <div className="space-y-6">
              {/* COMPENSACIÓN TAB (también accesible desde tabs pero la mostramos aquí cuando esté activa) */}
              <div className={activeTab === 'compensacion' ? 'block' : 'hidden'}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Compensación</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign size={16} className="text-blue-600" />
                        <p className="text-xs text-blue-600 font-medium">Sueldo Base</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        Q {(Number(position0?.initial_salary) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp size={16} className="text-green-600" />
                        <p className="text-xs text-green-600 font-medium">Bonificaciones</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        Q {(Number(position0?.bonuses) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Total Mensual</p>
                      <p className="text-3xl font-bold text-[#cf2e2e]">
                        Q {((Number(position0?.initial_salary) || 0) + (Number(position0?.bonuses) || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TRACKING TAB */}
              <div className={activeTab === 'tracking' ? 'block' : 'hidden'}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Seguimiento de Aprobación</h3>
                  <ApprovalTracker steps={user?.trackings || []} />
                </div>
              </div>

              {/* Opcional: mostrar compensación y tracking también en caso de que el usuario navegue a otras tabs
                  (si prefieres mantenerlos siempre visibles, remueve las condiciones y muéstralos siempre) */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-end bg-white rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
