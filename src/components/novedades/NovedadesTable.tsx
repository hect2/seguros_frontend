import React from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
interface NovedadesTableProps {
  onViewDetail: (novedad: any) => void;
}
export function NovedadesTable({
  onViewDetail
}: NovedadesTableProps) {
  const novedades = [{
    id: 1,
    fecha: '20/10/2025 07:00',
    tipo: 'Novedades Negativas',
    descripcion: 'Incidente con cliente en sucursal norte.',
    oficina: 'DICE',
    usuario: 'Juan Pérez',
    criticidad: 'Alta',
    estado: 'En Seguimiento'
  }, {
    id: 2,
    fecha: '19/10/2025',
    tipo: 'Supervisiones',
    descripcion: 'Revisión de protocolos de seguridad en ofi...',
    oficina: 'DINOR',
    usuario: 'María García',
    criticidad: 'Media',
    estado: 'En Seguimiento'
  }, {
    id: 3,
    fecha: '18/10/2025',
    tipo: 'Permisos',
    descripcion: 'Solicitud de permiso por motivos personales',
    oficina: 'DISO',
    usuario: 'Ana Martínez',
    criticidad: 'Baja',
    estado: 'Resuelta'
  }, {
    id: 4,
    fecha: '17/10/2025',
    tipo: 'Negativas',
    descripcion: 'Incidente con cliente en sucursal norte',
    oficina: 'DINOC',
    usuario: 'Pedro Ramírez',
    criticidad: 'Alta',
    estado: 'En Seguimiento'
  }, {
    id: 5,
    fecha: '16/10/2025',
    tipo: 'Vacaciones',
    descripcion: 'Programación de vacaciones para equipo d...',
    oficina: 'DIOR',
    usuario: 'Carmen Torres',
    criticidad: 'Media',
    estado: 'Resuelta'
  }];
  const getCriticalityBadge = (criticidad: string) => {
    const styles = {
      Alta: 'bg-red-100 text-red-700 border border-red-300',
      Media: 'bg-orange-100 text-orange-700 border border-orange-300',
      Baja: 'bg-green-100 text-green-700 border border-green-300'
    };
    return styles[criticidad as keyof typeof styles] || '';
  };
  const getEstadoBadge = (estado: string) => {
    const styles = {
      'En Seguimiento': 'bg-blue-100 text-blue-700',
      Resuelta: 'bg-green-100 text-green-700',
      Pendiente: 'bg-gray-100 text-gray-700'
    };
    return styles[estado as keyof typeof styles] || '';
  };
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Oficina
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Criticidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {novedades.map(novedad => <tr key={novedad.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {novedad.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {novedad.tipo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {novedad.descripcion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {novedad.oficina}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {novedad.usuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCriticalityBadge(novedad.criticidad)}`}>
                    {novedad.criticidad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(novedad.estado)}`}>
                    {novedad.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => onViewDetail(novedad)} className="text-[#cf2e2e] hover:text-[#b52626] transition-colors">
                    <Eye size={20} />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-600">Mostrando 1 a 5 de 5 resultados</p>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#cf2e2e] text-white font-medium">
            1
          </button>
          <span className="text-gray-600">de 1</span>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>;
}