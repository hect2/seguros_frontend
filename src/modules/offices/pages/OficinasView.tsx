import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Search, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { Office } from '../interfaces/office.interface';
import { OfficeModal } from '../components/OfficeModal';
import { ConfirmDialog } from '@/components/configuraciones/ConfirmDialog';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { toast } from 'sonner';
import { useOffices } from '../hooks/useOffices';
import { useAuthStore } from '@/auth/store/auth.store';
import { useDistrictsList } from '@/seguros/hooks/useDistrictsList';
import { getOfficeByIdAction } from '../actions/get-office-by-id.action';

export function OficinasView() {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('');

  const { data, createOffice, updateOffice, deleteOffice } = useOffices(filters);
  const { data: districts, isLoading: isLoadingDistricts } = useDistrictsList();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [officeToDelete, setOfficeToDelete] = useState<Office | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    setModalMode('create');
    setSelectedOffice(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (office: Office) => {
    try {
      const fullOffice = await getOfficeByIdAction(office.id);
      setModalMode('edit');
      setSelectedOffice(fullOffice);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Error al cargar los datos de la oficina.');
    }
  };

  const handleDelete = (office: Office) => {
    setOfficeToDelete(office);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!officeToDelete) return;
    try {
      await deleteOffice(officeToDelete.id);
      toast.success('Oficina eliminada con éxito');
      setIsDeleteDialogOpen(false);
      setOfficeToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar la oficina');
    }
  };

  const handleSubmit = async (officeData: Partial<Office>) => {
    try {
      if (modalMode === 'create') {
        await createOffice(officeData);
        toast.success('Oficina creada con éxito');
      } else {
        await updateOffice({ ...officeData, id: selectedOffice.id });
        toast.success('Oficina actualizada con éxito');
      }
      setIsModalOpen(false);
      setSelectedOffice(null);
    } catch (error) {
      toast.error(modalMode === 'create' ? 'Error al crear la oficina' : 'Error al actualizar la oficina');
    }
  };
  
  const handleViewDetails = (office: Office) => {
    navigate(`/configuraciones/asignacion-territorial/oficinas/${office.id}`);
  };

  const handleApplyFilters = () => {
    setFilters({
      search: searchTerm,
      status: statusFilter,
      district_id: districtFilter,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDistrictFilter('');
    setFilters({});
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} user={user}>
          <main className="p-4 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Oficinas</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent w-full lg:max-w-xs"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
                  >
                    <option value="">Todos los estados</option>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
                    disabled={isLoadingDistricts}
                  >
                    <option value="">{isLoadingDistricts ? "Cargando..." : "Todos los distritos"}</option>
                    {districts?.data?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <button onClick={handleApplyFilters} className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">Aplicar</button>
                  <button onClick={handleClearFilters} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">Limpiar</button>
                </div>
                <button onClick={handleCreate} className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium flex items-center space-x-2">
                  <Plus size={18} />
                  <span>Crear Oficina</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Nombre</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Código</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Distrito</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Estado</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((office) => (
                      <tr key={office.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-gray-600 font-semibold">{office.name}</td>
                        <td className="py-4 px-6 text-gray-600">{office.code}</td>
                        <td className="py-4 px-6 text-gray-600">{office.district?.name || 'N/A'}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${office.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {office.status === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                             <button onClick={() => handleViewDetails(office)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleEdit(office)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDelete(office)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module="offices" />
            </div>
          </main>
        </PermissionGuard>
      </div>

      <OfficeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        office={selectedOffice}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Oficina"
        message={`¿Estás seguro de que deseas eliminar la oficina "${officeToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}
