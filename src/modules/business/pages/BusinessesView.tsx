import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { Search, Plus, Eye, Pencil, Trash2, Upload, FileDown, FileSpreadsheet } from 'lucide-react';
import { Business } from '@/modules/business/interfaces/business.interface';
import { BusinessModal } from '../components/BusinessModal';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { toast } from 'sonner';
import { useBusinesses } from '@/modules/business/hooks/useBusinesses';
import { useAuthStore } from '@/auth/store/auth.store';

export function BusinessesView() {
  const { user } = useAuthStore();

  const { data, createBusiness, updateBusiness } = useBusinesses();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'all' | 'Activo' | 'Inactivo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);
  const navigate = useNavigate();
  const businesses = data?.data || [];
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusText = business.status === 1 ? 'Activo' : 'Inactivo';
    const matchesEstado = estadoFilter === 'all' || statusText === estadoFilter;
    return matchesSearch && matchesEstado;
  });
  const handleCreate = () => {
    setModalMode('create');
    setSelectedBusiness(null);
    setIsModalOpen(true);
  };
  const handleEdit = (business: Business) => {
    setModalMode('edit');
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };
  const handleDelete = (business: Business) => {
    setBusinessToDelete(business);
    setIsDeleteDialogOpen(true);
  };
  const handleViewBusiness = (business: Business) => {
    navigate(`/configuraciones/asignacion-territorial/empresas/${business.id}`);
  };
  const confirmDelete = () => {
    alert(`Eliminando empresa: ${businessToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setBusinessToDelete(null);
  };

  const handleSubmit = async (businessLike: Partial<Business>) => {
    if (businessLike.mode == 'create') {
      await createBusiness(businessLike, {
        onSuccess: (data) => {
          console.log('Business created:', data);
          setIsModalOpen(false);
          toast.success('Empresa creada con éxito', {
            position: 'top-right',
          });
        }
      });
    } else {
      await updateBusiness(businessLike, {
        onSuccess: (data) => {
          console.log('Business updated:', data);
          setIsModalOpen(false);
          toast.success('Empresa actualizada con éxito', {
            position: 'top-right',
          });
        }
      });
    }

  }

  return (
    <div>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} allowedPermissions={['business_view']} user={user}>
            <main className="p-4 lg:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Gestión de Empresas
                </h1>
              </div>
              {/* Filters and Actions Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                    <div className="relative flex-1 lg:max-w-md">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                    </div>
                    <select value={estadoFilter} onChange={e => setEstadoFilter(e.target.value as any)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                      <option value="all">Todos los estados</option>
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload size={18} />
                      <span>Importar</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileDown size={18} />
                      <span>CSV</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileSpreadsheet size={18} />
                      <span>XLSX</span>
                    </button> */}
                    <button onClick={handleCreate} className="flex items-center space-x-2 px-4 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
                      <Plus size={18} />
                      <span>Crear Empresa</span>
                    </button>
                  </div>
                </div>
              </div>


              {/* Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                          NOMBRE DE EMPRESA
                        </th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                          DIRECCIÓN
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                          TELÉFONO
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                          ESTADO
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                          ÚLTIMA ACTUALIZACIÓN
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                          ACCIONES
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBusinesses.map((business, index) => <tr key={business.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} onClick={() => handleViewBusiness(business)}>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-gray-800">
                              {business.name}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {business.direction}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600">
                          {business.phone}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${business.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {business.status === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600 text-sm">
                          {new Date(business.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={e => {
                              e.stopPropagation();
                              handleViewBusiness(business);
                            }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                              <Eye size={18} />
                            </button>
                            <button onClick={e => {
                              e.stopPropagation();
                              handleEdit(business);
                            }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                            {/* <button onClick={e => {
                              e.stopPropagation();
                              handleDelete(business);
                            }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                              <Trash2 size={18} />
                            </button> */}
                          </div>
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='empresas' />
              </div>


            </main>
          </PermissionGuard>
        </div>
      </div>
      <BusinessModal
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        isOpen={isModalOpen}
        business={selectedBusiness}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Empresa"
        message={`¿Estás seguro de que deseas eliminar la empresa "${businessToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText={'Eliminar'}
        type={'danger'}
      />
    </div>
  );
}
