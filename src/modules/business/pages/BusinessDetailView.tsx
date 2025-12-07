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
import { DistrictModal } from '@/modules/districts/components/DistrictModal';
import { District } from '@/modules/districts/interfaces/district.interface';
import { Distrito } from '../interfaces/business-response';
import { useDistricts } from '@/modules/districts/hooks/useDistricts';
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
  const [selectedDistrito, setSelectedDistrito] = useState<Distrito | null>(null);
  const navigate = useNavigate();

  const { data, createDistrict, updateDistrict } = useDistricts();
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
            Empresa no encontrada
          </h2>
          <button onClick={() => navigate(-1)} className="text-[#cf2e2e] hover:underline">
            Volver a Empresas
          </button>
        </div>
      </div>
    );
  }
  console.log(`Business By Id: ${business}`)

  const filteredDistritos = business.distrito.filter(oficina => oficina.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const distritosActivas = business.distrito.filter(o => o.status === 1).length;
  const distritosInactivas = business.distrito.filter(o => o.status === 0).length;

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    alert(`Eliminando empresa: ${business.name}`);
    setIsDeleteDialogOpen(false);
    navigate('/configuraciones/asignacion-territorial/empresas');
  };

  const handleSubmit = async (businessLike: Partial<Business>) => {
    await updateBusiness(businessLike, {
      onSuccess: (data) => {
        console.log('Business updated:', data);
        setIsEditModalOpen(false);
        toast.success('Empresa actualizada con éxito', {
          position: 'top-right',
        });
      }
    });
  }
  const handleSubmitDistrict = async (distritoLike: Partial<District>) => {
    console.log(`handleSubmitDistrict: ${distritoLike}`)
    if (modalMode == 'create') {
      distritoLike.business_id = business.id;
      await createDistrict(distritoLike, {
        onSuccess: (data) => {
          console.log('District created:', data);
          setIsModalOpen(false);
          toast.success('Districto creado con éxito', {
            position: 'top-right',
          });
        }
      });
    }
    else {
      await updateDistrict(distritoLike, {
        onSuccess: (data) => {
          console.log('District updated:', data);
          setIsModalOpen(false);
          toast.success('Districto actualizado con éxito', {
            position: 'top-right',
          });
        }
      });
    }
  };


  const handleCreate = () => {
    setModalMode('create');
    setSelectedDistrito(null);
    setIsModalOpen(true);
  };
  const handleEdit = (distrito: Distrito) => {
    setModalMode('edit');
    setSelectedDistrito(distrito);
    setIsModalOpen(true);
  };


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
                  {/* <button onClick={handleDelete} className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    <Trash2 size={18} />
                    <span>Eliminar Empresa</span>
                  </button> */}
                </div>
              </div>
            </div>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total de Distritos
                </h3>
                <p className="text-4xl font-bold text-gray-800">
                  {filteredDistritos.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Distritos Activos
                </h3>
                <p className="text-4xl font-bold text-green-600">
                  {distritosActivas}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Distritos Inactivos
                </h3>
                <p className="text-4xl font-bold text-gray-600">
                  {distritosInactivas}
                </p>
              </div>
            </div>
            {/* Offices Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Distritos de la Empresa
                </h2>
                <button
                  onClick={handleCreate}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626]">
                  <Plus size={18} />
                  <span>Agregar Distrito</span>
                </button>

              </div>
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar oficina..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              {/* Offices Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                        CÓDIGO
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                        NOMBRE
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                        ESTADO
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                        ACTUALIZADO
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                        ACCIONES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDistritos.length === 0 ? <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No hay oficinas en este distrito
                      </td>
                    </tr> : filteredDistritos.map((distrito, index) => <tr key={distrito.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {distrito.code}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">
                          {distrito.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${distrito.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {distrito.status === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-600 text-sm">
                        {new Date(distrito.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => navigate(`/configuraciones/asignacion-territorial/distritos/${distrito.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(distrito)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                            <Pencil size={18} />
                          </button>
                          {/* <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 size={18} />
                          </button> */}
                        </div>
                      </td>
                    </tr>)}
                  </tbody>
                </table>
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
      <DistrictModal
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        isOpen={isModalOpen}
        distrito={selectedDistrito}
        business={businessList}
        presetDistrictId={business.id}
        onSubmit={handleSubmitDistrict}
      />


    </div>
  );
}
