import React, { useState } from 'react';
import { Eye, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
interface UsersTableProps {
  onViewUser: (user: any) => void;
}
const mockUsers = [{
  codigo: '97326',
  nombre: 'Alangumer Gonzalo Eduardo Ángel López',
  dpi: '1641754491214',
  distrito: 'DICE',
  oficina: 'AREA NORTE',
  cargoAdministrativo: 'DIRECTOR DISTRITO',
  cargoOperativo: 'DIRECTOR DISTRITO',
  estado: 'En revisión',
  sueldo: 4500,
  bonificaciones: 500,
  email: 'alangumer.lopez@sigsesa.com',
  telefono: '+502 5555-1234'
}, {
  codigo: '85432',
  nombre: 'María Fernanda García Rodríguez',
  dpi: '2343678901234',
  distrito: 'DINOR',
  oficina: 'AREA SUR',
  cargoAdministrativo: 'JEFE DE ÁREA',
  cargoOperativo: 'JEFE DE ÁREA',
  estado: 'Activo',
  sueldo: 3800,
  bonificaciones: 400,
  email: 'maria.garcia@sigsesa.com',
  telefono: '+502 5555-5678'
}, {
  codigo: '76543',
  nombre: 'Carlos Alberto Méndez Torres',
  dpi: '3456789012345',
  distrito: 'DISO',
  oficina: 'OTR SALAMÁ',
  cargoAdministrativo: 'SUPERVISOR',
  cargoOperativo: 'SUPERVISOR',
  estado: 'Activo',
  sueldo: 3200,
  bonificaciones: 300,
  email: 'carlos.mendez@sigsesa.com',
  telefono: '+502 5555-9012'
}, {
  codigo: '92145',
  nombre: 'Ana Lucía Morales Vásquez',
  dpi: '4567890123456',
  distrito: 'DINOC',
  oficina: 'AREA NORTE',
  cargoAdministrativo: 'COORDINADOR',
  cargoOperativo: 'COORDINADOR',
  estado: 'Pendiente',
  sueldo: 3500,
  bonificaciones: 350,
  email: 'ana.morales@sigsesa.com',
  telefono: '+502 5555-3456'
}, {
  codigo: '68234',
  nombre: 'Roberto José Castillo Hernández',
  dpi: '5678901234567',
  distrito: 'DICE',
  oficina: 'OTR SACATEPÉQUEZ',
  cargoAdministrativo: 'JEFE DE ÁREA',
  cargoOperativo: 'JEFE DE ÁREA',
  estado: 'Activo',
  sueldo: 3900,
  bonificaciones: 450,
  email: 'roberto.castillo@sigsesa.com',
  telefono: '+502 5555-7890'
}];
export function UsersTable({
  onViewUser
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
                Código
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
            {mockUsers.map(user => <tr key={user.codigo} className="hover:bg-gray-50 transition-colors">
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {user.dpi}
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
                  <span className="text-sm font-semibold text-gray-900">
                    {user.cargoAdministrativo}
                  </span>
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
                    <button className="p-2 text-gray-600 hover:text-[#cf2e2e] hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
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
        <p className="text-sm text-gray-600">Mostrando 1 a 5 de 5 usuarios</p>
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