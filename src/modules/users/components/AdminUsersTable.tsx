import React, { useState } from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { UsersResponse, Data as User } from '../interfaces/users.response';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { getStatusUserColor } from '@/utils/get_status_users_color';
import { getRolesUserColor } from '@/utils/get_roles_users_color';

interface AdminUsersTableProps {
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  data: UsersResponse
}

export function AdminUsersTable({
  onViewUser,
  onEditUser,
  data,
}: AdminUsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const totalPages = 1;
  const getInitials = (nombre: string) => {
    const words = nombre.split(' ');
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(data?.data.map(u => u.dpi));
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
                <input type="checkbox" checked={selectedUsers.length === data?.data.length} onChange={handleSelectAll} className="w-4 h-4 text-[#cf2e2e] border-gray-300 rounded focus:ring-[#cf2e2e]" />
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
            {data?.data.map(user => <tr key={user.dpi} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedUsers.includes(user.dpi)} onChange={() => handleSelectUser(user.dpi)} className="w-4 h-4 text-[#cf2e2e] border-gray-300 rounded focus:ring-[#cf2e2e]" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.dpi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#cf2e2e] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Último acceso: {user.last_login}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRolesUserColor(user.role_name)}`}>
                    {user.role_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-blue-600">
                    {user.district?.length >= 1
                      ? user.district.join(', ')
                      : 'Sin distrito'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.office?.length >= 1
                      ? user.office.join(', ')
                      : 'Sin oficina'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusUserColor(user.status_slug)}`}>
                    {user.status_name}
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
      <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='users' />
    </div>;
}