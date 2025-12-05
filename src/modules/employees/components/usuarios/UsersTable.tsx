import React, { useState } from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { getStatusUserColor } from '@/utils/get_status_users_color';
import { EmployeesResponse } from '../../interfaces/employees.response';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { PermissionGuard } from '@/components/PermissionGuard';

interface UsersTableProps {
  onViewUser: (user_id: number) => void;
  onViewEditUser: (user_id: number) => void;
  data: EmployeesResponse
}

export function UsersTable({
  onViewUser,
  onViewEditUser,
  data,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

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
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Número DPI
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Distrito
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Oficina
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cargo Administrativo
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
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#cf2e2e] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {getInitials(user.full_name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.full_name}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user.dpi}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-medium text-blue-600">
                {user.data?.district_code ?? ''}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user.data?.office_code ?? ''}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm font-semibold text-gray-900">
                {user.data?.admin_position ?? ''}
                {/* {user.data.admin_position ? ' - ' : ''} {user.data.admin_position} */}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusUserColor(user.status_slug)}`}>
                {user.status_name}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-2">
                  <button onClick={() => onViewUser(user.id)} className="p-2 text-gray-600 hover:text-[#cf2e2e] hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalle">
                    <Eye size={18} />
                  </button>
                {/* <PermissionGuard allowedPermissions={['employees_edit']} user={user} show_dialog={false}> */}
                  <button onClick={() => onViewEditUser(user.id)} className="p-2 text-gray-600 hover:text-[#cf2e2e] hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                    <Edit size={18} />
                  </button>
                {/* </PermissionGuard> */}
              </div>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
    {/* Pagination */}
    <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='usuarios' />
  </div>;
}