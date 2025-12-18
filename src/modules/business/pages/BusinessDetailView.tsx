import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { ArrowLeft, Building, Pencil, Trash2, Plus, Search, Eye } from 'lucide-react';
import { BusinessModal } from '../components/BusinessModal';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { useBusiness } from '../hooks/useBusiness';
import { toast } from 'sonner';
import { Business } from '../interfaces/business.interface';
import { useAuthStore } from '@/auth/store/auth.store';
import { useBusinesses } from '../hooks/useBusinesses';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
// import { DistrictModal } from '@/modules/districts/components/DistrictModal';
// import { District } from '@/modules/districts/interfaces/district.interface';
// import { Distrito } from '../interfaces/business-response';
// import { useDistricts } from '@/modules/districts/hooks/useDistricts';
import { useBusinessList } from '@/seguros/hooks/useBusinessList';

export function BusinessDetailView() {
  const { id } = useParams<{ id: string }>();
  console.log(`Business ID: ${id}`)
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [selectedDistrito, setSelectedDistrito] = useState<Distrito | null>(null);
  const navigate = useNavigate();

  // const { data, createDistrict, updateDistrict } = useDistricts();
  const { data: businessData, isLoading, isError } = useBusiness(Number(id));
  const { updateBusiness } = useBusinesses();
  const {data :businessList} = useBusinessList();

  if (isLoading) {
    return <CustomFullScreenLoading />
  }

  const business = businessData?.data;

  if (isError || !business) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cliente no encontrado
          </h2>
          <button onClick={() => navigate(-1)} className="text-[#cf2e2e] hover:underline">
            Volver a Clientes
          </button>
        </div>
      </div>
    );
  }
  console.log(`Business By Id: ${business}`)


  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    alert(`Eliminando Cliente: ${business.name}`);
    setIsDeleteDialogOpen(false);
    navigate('/configuraciones/catalogos/clientes');
  };

  const handleSubmit = async (businessLike: Partial<Business>) => {
    await updateBusiness(businessLike, {
      onSuccess: (data) => {
        console.log('Business updated:', data);
        setIsEditModalOpen(false);
        toast.success('Cliente actualizado con éxito', {
          position: 'top-right',
        });
      }
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} allowedPermissions={['business_view']} user={user}>
          <main className="p-4 lg:p-8">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Volver a Clientes</span>
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
                    <span>Editar Cliente</span>
                  </button>
                  {/* <button onClick={handleDelete} className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    <Trash2 size={18} />
                    <span>Eliminar Cliente</span>
                  </button> */}
                </div>
              </div>
            </div>
          </main>
        </PermissionGuard>
      </div>

      {/* Modals */}
      <BusinessModal
        mode="edit"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        business={business}
        onSubmit={handleSubmit}
      />
      {/* <DistrictModal
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        isOpen={isModalOpen}
        distrito={selectedDistrito}
        business={businessList}
        presetDistrictId={business.id}
        onSubmit={handleSubmitDistrict}
      /> */}


    </div>
  );
}
