import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { ArrowLeft, Building, Pencil, Trash2 } from 'lucide-react';
import { BusinessModal } from '../components/BusinessModal';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { useBusiness } from '../hooks/useBusiness';
import { toast } from 'sonner';

export function BusinessDetailView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: business, isLoading, isError } = useBusiness(Number(id));

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cargando...
          </h2>
        </div>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Empresa no encontrada
          </h2>
          <button onClick={() => navigate('/businesses')} className="text-[#cf2e2e] hover:underline">
            Volver a Empresas
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    alert(`Eliminando empresa: ${business.name}`);
    setIsDeleteDialogOpen(false);
    navigate('/businesses');
  };

  const handleSubmit = async (businessLike: Partial<Business>) => {
    // await mutation.mutateAsync(businessLike, {
    //   onSuccess: (data) => {
    //     console.log('Business updated:', data);
    //     setIsEditModalOpen(false);
    //     toast.success('Empresa actualizada con éxito', {
    //       position: 'top-right',
    //     });
    //   }
    // });
    console.log('Updating business', businessLike);
    setIsEditModalOpen(false);
    toast.success('Empresa actualizada con éxito');
  }

  return (
    <PermissionGuard allowedRoles={['Super Admin', 'Admin']}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="p-4 lg:p-8">
            {/* Back Button */}
            <button onClick={() => navigate('/businesses')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Volver a Empresas</span>
            </button>

            {/* Business Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-800">
                        {business.name}
                      </h1>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${business.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {business.status === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">
                      {business.direction || 'Sin dirección'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Teléfono: {business.phone} • Actualizado: {new Date(business.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsEditModalOpen(true)} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    <Pencil size={18} />
                    <span>Editar Empresa</span>
                  </button>
                  <button onClick={handleDelete} className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    <Trash2 size={18} />
                    <span>Eliminar Empresa</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <BusinessModal 
        mode="edit" 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        business={business} 
        onSubmit={handleSubmit}
      />
      <ConfirmDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={confirmDelete} 
        title="Eliminar Empresa" 
        message={`¿Estás seguro de que deseas eliminar la empresa "${business.name}"? Esta acción no se puede deshacer.`} 
        confirmText='Eliminar' 
        type='danger' 
      />
    </PermissionGuard>
  );
}
