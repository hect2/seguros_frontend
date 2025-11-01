import React, { useEffect } from 'react';
import { X, DollarSign, TrendingUp } from 'lucide-react';
import { ApprovalTracker } from './ApprovalTracker';
interface UserDetailModalProps {
  user: any;
  onClose: () => void;
}
export function UserDetailModal({
  user,
  onClose
}: UserDetailModalProps) {
  const getInitials = (nombre: string) => {
    const words = nombre.split(' ');
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
  };
  const getEstadoBadge = (estado: string) => {
    const badges = {
      Activo: 'bg-green-100 text-green-700',
      'En revisión': 'bg-yellow-100 text-yellow-700',
      Pendiente: 'bg-orange-100 text-orange-700',
      Inactivo: 'bg-gray-100 text-gray-700'
    };
    return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  const mockSteps = [{
    id: 1,
    label: 'Carga de nuevo cliente',
    status: 'Completo',
    responsable: 'RRHH',
    fecha: '20/10/2025 09:10'
  }, {
    id: 2,
    label: 'Revisión de documentos',
    status: 'En proceso',
    responsable: 'Compliance',
    fecha: '20/10/2025 10:05'
  }, {
    id: 3,
    label: 'Validación de cuenta',
    status: 'Pendiente',
    responsable: null,
    fecha: null
  }, {
    id: 4,
    label: 'Aprobación',
    status: 'Pendiente',
    responsable: null,
    fecha: null
  }];
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#cf2e2e] flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitials(user.nombre)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.nombre}</h2>
              <p className="text-sm text-gray-600">
                Código: {user.codigo} | DPI: {user.dpi}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getEstadoBadge(user.estado)}`}>
              {user.estado}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>👤</span>
                  <span>Información Personal</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Nombre Completo
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.nombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Número DPI</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.dpi}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.telefono}
                    </p>
                  </div>
                </div>
              </div>
              {/* Organizational Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>🏢</span>
                  <span>Información Organizacional</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Distrito</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {user.distrito}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Oficina</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.oficina}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Cargo Administrativo
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.cargoAdministrativo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Cargo Operativo
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.cargoOperativo}
                    </p>
                  </div>
                </div>
              </div>
              {/* Documents */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>📄</span>
                  <span>Documentos</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-xl">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Antecedentes Penales
                        </p>
                        <p className="text-xs text-gray-500">
                          Emisión: 15/09/2025
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Aprobado
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-xl">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Antecedentes Policiacos
                        </p>
                        <p className="text-xs text-gray-500">
                          Emisión: 16/09/2025
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      Aprobado
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column - Compensation & Tracking */}
            <div className="space-y-6">
              {/* Compensation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Compensación
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign size={16} className="text-blue-600" />
                      <p className="text-xs text-blue-600 font-medium">
                        Sueldo Base
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      Q {user.sueldo.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp size={16} className="text-green-600" />
                      <p className="text-xs text-green-600 font-medium">
                        Bonificaciones
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      Q {user.bonificaciones.toFixed(2)}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total Mensual</p>
                    <p className="text-3xl font-bold text-[#cf2e2e]">
                      Q {(user.sueldo + user.bonificaciones).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Approval Tracking */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Seguimiento de Aprobación
                </h3>
                <ApprovalTracker steps={mockSteps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}