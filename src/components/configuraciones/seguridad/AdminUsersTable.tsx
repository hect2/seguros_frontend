import React, { useState } from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
interface AdminUsersTableProps {
  onViewUser: (user: any) => void;
  onEditUser: (user: any) => void;
  filters: any;
}
const mockUsers = [{
  codigo: '97326',
  nombre: 'Alangumer Gonzalo Eduardo Ángel López',
  dpi: '1641754491214',
  email: 'agalvarez@sigsesa.gt',
  rol: 'Supervisor',
  distrito: 'DICE',
  oficina: 'AREA NORTE',
  cargoAdministrativo: 'DIRECTOR DISTRITO',
  cargoOperativo: 'DIRECTOR DISTRITO',
  estado: 'Activo',
  sueldo: 4500,
  bonificaciones: 500,
  telefono: '+502 5555-1234',
  ultimoAcceso: '20/10/2025 09:15'
}, {
  codigo: '85432',
  nombre: 'María Fernanda García Rodríguez',
  dpi: '2343678901234',
  email: 'mgarcia@sigsesa.gt',
  rol: 'Admin',
  distrito: 'DINOR',
  oficina: 'OTR PETÉN',
  cargoAdministrativo: 'JEFE DE ÁREA',
  cargoOperativo: 'JEFE DE ÁREA',
  estado: 'Activo',
  sueldo: 3800,
  bonificaciones: 400,
  telefono: '+502 5555-5678',
  ultimoAcceso: '20/10/2025 08:30'
}, {
  codigo: '76543',
  nombre: 'Carlos Alberto Méndez Torres',
  dpi: '3456789012345',
  email: 'cmendez@sigsesa.gt',
  rol: 'Operador',
  distrito: 'DISO',
  oficina: 'OTR QUETZALTENANGO',
  cargoAdministrativo: 'SUPERVISOR',
  cargoOperativo: 'SUPERVISOR',
  estado: 'Activo',
  sueldo: 3200,
  bonificaciones: 300,
  telefono: '+502 5555-9012',
  ultimoAcceso: '19/10/2025 16:43'
}];
export function AdminUsersTable({
  onViewUser,
  onEditUser,
  filters
}: AdminUsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const totalPages = 1;
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
  const getRolBadge = (rol: string) => {
    const badges = {
      'Super Admin': 'bg-purple-100 text-purple-700',
      Admin: 'bg-blue-100 text-blue-700',
      Supervisor: 'bg-green-100 text-green-700',
      Operador: 'bg-gray-100 text-gray-700'
    };
    return badges[rol as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(mockUsers.map(u => u.codigo));
    } else {
      setSelectedUsers([]);
    }
  };
  const handleSelectUser = (codigo: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(codigo)) {
        return prev.filter(c => c !== codigo);
      }
      return [...prev, codigo];
    });
  };
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Bulk Actions */}
      {selectedUsers.length > 0 && <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedUsers.length} usuario(s) seleccionado(s)
          </span>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Activar
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Desactivar
            </button>
          </div>
        </div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input type="checkbox" checked={selectedUsers.length === mockUsers.length} onChange={handleSelectAll} className="w-4 h-4 text-[#cf2e2e] border-gray-300 rounded focus:ring-[#cf2e2e]" />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Distrito
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Oficina
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockUsers.map(user => <tr key={user.codigo} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedUsers.includes(user.codigo)} onChange={() => handleSelectUser(user.codigo)} className="w-4 h-4 text-[#cf2e2e] border-gray-300 rounded focus:ring-[#cf2e2e]" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#cf2e2e] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(user.nombre)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        Último acceso: {user.ultimoAcceso}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRolBadge(user.rol)}`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600">
                    {user.distrito}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.oficina}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(user.estado)}`}>
                    {user.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onViewUser(user)} className="p-2 text-gray-600 hover:text-[#cf2e2e] hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalle">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => onEditUser(user)} className="p-2 text-gray-600 hover:text-[#cf2e2e] hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando 1 a {mockUsers.length} de {mockUsers.length} usuarios
        </p>
        <div className="flex items-center space-x-2">
          <button disabled={currentPage === 1} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-700">Página 1 de 1</span>
          <button disabled={currentPage === totalPages} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>;
}