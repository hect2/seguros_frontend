import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { Search, Plus, Pencil, ArrowLeft } from 'lucide-react';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { toast } from 'sonner';
import { useAuthStore } from '@/auth/store/auth.store';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNoveltyTypesCatalog } from '../hooks/useNoveltyTypesCatalog';
import { NoveltyTypesCatalogModal } from '../components/NoveltyTypesCatalogModal';
import { NoveltyTypesCatalog } from '../interfaces/novelty.types.catalog.interface';

export function NoveltyTypesCatalogView() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, createNoveltyTypesCatalog, updateNoveltyTypesCatalog } = useNoveltyTypesCatalog();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<NoveltyTypesCatalog | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<NoveltyTypesCatalog | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const catalogList = data?.data || [];
  const filteredList = catalogList.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: NoveltyTypesCatalog) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: NoveltyTypesCatalog) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    alert(`Eliminando tipo: ${itemToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleSubmit = async (itemLike: Partial<NoveltyTypesCatalog>) => {
    const processedData = {
      ...itemLike,
    };

    if (modalMode === 'create') {
      await createNoveltyTypesCatalog(processedData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Tipo creado con éxito', {
            position: 'top-right',
          });
        },
        onError: () => {
          toast.error('No se pudo crear el tipo', {
            position: 'top-right',
          });
        }
      });
    } else {
      await updateNoveltyTypesCatalog({ ...processedData, id: selectedItem!.id }, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Tipo actualizado con éxito', {
            position: 'top-right',
          });
        },
        onError: () => {
          toast.error('No se pudo actualizar el tipo', {
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
        setSearchTerm(searchValue);
      } else {
        params.delete("search");
        setSearchTerm('');
      }

      setSearchParams(params);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, setSearchParams]);

  return (
    <div>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} user={user}>
            <main className="p-4 lg:p-8">
              
              <div className="mb-6 flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/configuraciones/catalogos/novedades')}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Volver a Novedades"
                >
                  <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">
                  Tipos de Novedades
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
                      <span>Crear Tipo</span>
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
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">ÚLTIMA ACTUALIZACIÓN</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredList.map((item, index) => <tr key={item.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-6">{item.name}</td>
                        <td className="py-4 px-6 text-center text-gray-600 text-sm">
                          {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
                <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='tipos de novedades' />
              </div>
            </main>
          </PermissionGuard>
        </div>
      </div>
      <NoveltyTypesCatalogModal
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        isOpen={isModalOpen}
        noveltyTypesCatalog={selectedItem}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar tipo"
        message={`¿Estás seguro de que deseas eliminar el tipo "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText={'Eliminar'}
        type={'danger'}
      />
    </div>
  );
}
