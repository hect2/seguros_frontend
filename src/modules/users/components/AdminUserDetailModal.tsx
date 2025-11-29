import React, { useEffect } from 'react';
import { X, Shield, MapPin, Clock, Key, FileText } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { getStatusUserColor } from '@/utils/get_status_users_color';
import { getRolesUserColor } from '@/utils/get_roles_users_color';
import { User } from '../interfaces/user.response';

interface AdminUserDetailModalProps {
  id: Number;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export function AdminUserDetailModal({
  id,
  onClose,
  onEdit
}: AdminUserDetailModalProps) {
  console.log('User Detail Modal Props: ', id);
  const getInitials = (nombre: string) => {
    const words = nombre.split(' ');
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
  };
  // const getEstadoBadge = (estado: string) => {
  //   const badges = {
  //     Activo: 'bg-green-100 text-green-700',
  //     'En revisión': 'bg-yellow-100 text-yellow-700',
  //     Pendiente: 'bg-orange-100 text-orange-700',
  //     Inactivo: 'bg-gray-100 text-gray-700'
  //   };
  //   return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  // };
  // const getRolBadge = (rol: string) => {
  //   const badges = {
  //     'Super Admin': 'bg-purple-100 text-purple-700',
  //     Admin: 'bg-blue-100 text-blue-700',
  //     Supervisor: 'bg-green-100 text-green-700',
  //     Operador: 'bg-gray-100 text-gray-700'
  //   };
  //   return badges[rol as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  // };
  // const getRolPermissions = (rol: string) => {
  //   const permissions = {
  //     'Super Admin': 'Acceso completo al sistema. Puede crear, editar y eliminar usuarios, configurar distritos y oficinas, y acceder a todos los reportes.',
  //     Admin: 'Puede gestionar usuarios (excepto Super Admins), configurar asignaciones territoriales y acceder a reportes.',
  //     Supervisor: 'Puede ver y editar información de usuarios de su distrito, acceder a reportes limitados.',
  //     Operador: 'Acceso de solo lectura a la información de su distrito.'
  //   };
  //   return permissions[rol as keyof typeof permissions] || 'Permisos no especificados';
  // };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const { isLoading, isError, data } = useUser(id);
  
  if (isError) {
    onClose();
  }

  if (isLoading) {
    return <CustomFullScreenLoading />
  }

  const user = data?.data;
  console.log('User Detail Modal User: ', user);

  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#cf2e2e] flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {getInitials(user?.name || '')}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-600">
              Código: {user?.dpi} | {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusUserColor(user?.status_slug || '')}`}>
            {user?.status_name}
          </span>
          <button onClick={() => onEdit(user)} className="px-4 py-2 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors text-sm font-medium">
            Editar
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de Identidad */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>👤</span>
                <span>Información de Identidad</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Nombre Completo
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número DPI</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.dpi}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.phone}
                  </p>
                </div>
              </div>
            </div>
            {/* Asignación Territorial */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <MapPin size={20} />
                <span>Asignación Territorial</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Distrito</p>
                    {user?.district.length >= 1
                      ? user?.district.map(d => (<span className="px-3 py-1.5 mr-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"> {d}</span>)) 
                      : 'Sin distrito'}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Oficina</p>
                    {user?.office.length >= 1
                      ? user?.district.map(o => (<p className="text-sm font-semibold text-gray-900"> {o}</p>)) 
                      : 'Sin distrito'}
                </div>
              </div>
            </div>
            {/* Historial de Actividad */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock size={20} />
                <span>Historial de Actividad</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Último acceso al sistema
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.last_login ? new Date(user.last_login).toLocaleString() : 'Nunca'}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Reciente
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Cuenta creada
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.created_at ? new Date(user.created_at).toLocaleString() : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Última modificación
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.updated_at ? new Date(user.updated_at).toLocaleString() : 'Nunca'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Rol y Permisos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield size={20} />
                <span>Rol y Permisos</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Rol Asignado</p>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getRolesUserColor(user?.role_name)}`}>
                    {user?.role_name}
                  </span>
                </div>
                {/* <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Permisos
                  </p>
                  <p className="text-sm text-gray-600">
                    {getRolPermissions(user.role_name)}
                  </p>
                </div> */}
              </div>
            </div>
            {/* Seguridad */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Key size={20} />
                <span>Seguridad</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p className="text-sm font-medium text-green-900">
                      Contraseña configurada
                    </p>
                  </div>
                  <p className="text-xs text-green-700 ml-4">
                    Última actualización: {user?.last_changed_password ? new Date(user.last_changed_password).toLocaleString() : ''}
                  </p>
                </div>
                {/* <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <p className="text-sm font-medium text-blue-900">
                      Autenticación de dos factores
                    </p>
                  </div>
                  <p className="text-xs text-blue-700 ml-4">Desactivada</p>
                </div> */}
              </div>
            </div>
            {/* Observaciones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText size={20} />
                <span>Observaciones</span>
              </h3>
              <p className="text-sm text-gray-600">
                {user?.observations || 'Sin observaciones adicionales.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}