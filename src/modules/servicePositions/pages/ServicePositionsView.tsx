import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { Search, Plus, Pencil } from 'lucide-react';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { toast } from 'sonner';
import { useAuthStore } from '@/auth/store/auth.store';
import { useSearchParams } from 'react-router-dom';
import { useServicePosition } from '../hooks/useServicePosition';
import { ServicePosition } from '../interfaces/service-positions.interface';
import { ServicePositionModal } from '../components/ServicePositionModal';
import { useBusinessList } from '@/seguros/hooks/useBusinessList';

export function ServicePositionsView() {
  const { user } = useAuthStore();

  const { data, createServicePosition, updateServicePosition } = useServicePosition();
  const { data: businessList } = useBusinessList();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Activo' | 'Inactivo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPosition, setSelectedPosition] = useState<ServicePosition | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<ServicePosition | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const servicePositions = data?.data || [];
  const filteredServicePositions = servicePositions.filter(position => {
    const matchesSearch = position.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreate = () => {
    setModalMode('create');
    setSelectedPosition(null);
    setIsModalOpen(true);
  };

  const handleEdit = (incident: ServicePosition) => {
    setModalMode('edit');
    setSelectedPosition(incident);
    setIsModalOpen(true);
  };

  const handleDelete = (incident: ServicePosition) => {
    setPositionToDelete(incident);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    alert(`Eliminando novedad: ${positionToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setPositionToDelete(null);
  };

  const handleSubmit = async (positionLike: Partial<ServicePosition>) => {
    const processedData = {
      ...positionLike,
    };

    if (modalMode === 'create') {
      await createServicePosition(processedData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Puesto de servicio creado con éxito', {
            position: 'top-right',
          });
        },
        onError: () => {
          toast.error('No se pudo crear el puesto de servicio', {
            position: 'top-right',
          });
        }
      });
    } else {
      await updateServicePosition({ ...processedData, id: selectedPosition!.id }, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Puesto de servicio actualizado con éxito', {
            position: 'top-right',
          });
        },
        onError: () => {
          toast.error('No se pudo actualizar el puesto de servicio', {
            position: 'top-right',
          });
        }
      });
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchValue.trim()) {
        params.set("search", searchValue);
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      setSearchParams(params);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} user={user}>
            <main className="p-4 lg:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Gestión de Catalogo de Puestos de Servicio
                </h1>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                    <div className="relative flex-1 lg:max-w-md">
                      <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={handleCreate} className="flex items-center space-x-2 px-4 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
                      <Plus size={18} />
                      <span>Crear Puesto de Servicio</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">NOMBRE</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">LOCALIZACIÓN</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">CLIENTE</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">ÚLTIMA ACTUALIZACIÓN</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServicePositions.map((serviceposition, index) => <tr key={serviceposition.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-6">{serviceposition.name}</td>
                        <td className="py-4 px-6 text-gray-600">{serviceposition.location}</td>
                        <td className="py-4 px-6 text-gray-600">{serviceposition.business_name}</td>
                        <td className="py-4 px-6 text-center text-gray-600 text-sm">
                          {new Date(serviceposition.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => handleEdit(serviceposition)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                            {/* <button onClick={() => handleDelete(position)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                              <Trash2 size={18} />
                            </button> */}
                          </div>
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
                <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='novedades' />
              </div>
            </main>
          </PermissionGuard>
        </div>
      </div>
      <ServicePositionModal
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        isOpen={isModalOpen}
        servicePosition={selectedPosition}
        business={businessList?.data || []}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar puesto de servicio"
        message={`¿Estás seguro de que deseas eliminar el puesto de servicio "${positionToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText={'Eliminar'}
        type={'danger'}
      />
    </div>
  );
}
