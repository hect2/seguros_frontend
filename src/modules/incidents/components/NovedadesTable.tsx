import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIncidents } from '@/seguros/hooks/useIncidents';
import { getCriticalityColor } from '@/utils/criticality';
import { getStatusColor } from '@/utils/incident_status';
import { CustomPagination } from '../../../components/custom/CustomPagination';
import { IncidentResponse } from '@/modules/incidents/interfaces/incidents.response';
import { useAuthStore } from '@/auth/store/auth.store';
import { PermissionGuard } from '@/components/PermissionGuard';

interface NovedadesTableProps {
  onViewDetail: (id: number) => void;
  data: IncidentResponse,
}

export function NovedadesTable({
  data,
  onViewDetail,
}: NovedadesTableProps) {
  const {user} = useAuthStore();
  const novedades = data?.data.map((item) => ({
    id: item.id,
    fecha: item.date,
    tipo: item.type,
    descripcion: item.description,
    distrito: item.district,
    usuario: item.user_reported,
    criticidad: item.criticity,
    criticidad_slug: item.criticity_slug,
    estado: item.status,
    estado_slug: item.status_slug,
  }));

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
              Distrito
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
          {novedades?.map(novedad => <tr key={novedad.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {new Date(novedad.fecha).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {novedad.tipo}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {novedad.descripcion}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {novedad.distrito}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {novedad.usuario}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCriticalityColor(novedad.criticidad_slug)}`}>
                {novedad.criticidad}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(novedad.estado_slug)}`}>
                {novedad.estado}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {/* <PermissionGuard allowedPermissions={['incidents_edit']} user={user} show_dialog={false}> */}
              <button onClick={() => onViewDetail(novedad.id)} className="text-[#cf2e2e] hover:text-[#b52626] transition-colors">
                <Eye size={20} />
              </button>
              {/* </PermissionGuard> */}
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
    {/* Pagination */}
    <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='novedades' />
  </div>;
}