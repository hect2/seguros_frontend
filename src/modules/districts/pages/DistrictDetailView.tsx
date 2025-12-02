import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { ArrowLeft, MapPin, Pencil, Trash2, Plus, Search, Eye } from 'lucide-react';
import { mockDistritos, mockOficinas, Distrito, Oficina } from '../../../utils/mockData';
import { DistrictModal } from '../components/DistrictModal';
import { OfficeModal } from '../../offices/components/OfficeModal';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { useAuthStore } from '@/auth/store/auth.store';
import { useDistrict } from '../hooks/useDistrict';
import { useDistricts } from '../hooks/useDistricts';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';

export function DistrictDetailView() {
  const { id } = useParams<{ id: string }>();
  console.log(`District ID: ${id}`)
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddOfficeModalOpen, setIsAddOfficeModalOpen] = useState(false);
  const [isEditOfficeModalOpen, setIsEditOfficeModalOpen] = useState(false);
  const [selectedOficina, setSelectedOficina] = useState<Oficina | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();


  const { data: distritoData, isLoading, isError } = useDistrict(Number(id));
  const { updateBusiness } = useDistricts();

  if (isLoading) {
    return <CustomFullScreenLoading />
  }

  const distrito = distritoData?.data;

  if (!distrito) {
    return <div className="flex min-h-screen w-full bg-gray-50 items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Distrito no encontrado
        </h2>
        <button onClick={() => navigate(-1)} className="text-[#cf2e2e] hover:underline">
          Volver a Distritos
        </button>
      </div>
    </div>;
  }
  console.log(`District By Id: ${distrito}`)

  const filteredOficinas = distrito.offices.filter(oficina => oficina.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const oficinasActivas = distrito.offices.filter(o => o.status === 1).length;
  const oficinasInactivas = distrito.offices.filter(o => o.status === 0).length;
  // const handleDelete = () => {
  //   if (oficinasDelDistrito.length > 0) {
  //     setIsDeleteDialogOpen(true);
  //   } else {
  //     setIsDeleteDialogOpen(true);
  //   }
  // };
  const handleEditOffice = (oficina: Oficina) => {
    setSelectedOficina(oficina);
    setIsEditOfficeModalOpen(true);
  };
  const confirmDelete = () => {
    alert(`Eliminando distrito: ${distrito.name}`);
    setIsDeleteDialogOpen(false);
    navigate('/configuraciones/asignacion-territorial/distritos');
  };
  return (
    <div>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <PermissionGuard allowedPermissions={['districts_view']} user={user}>
            <main className="p-4 lg:p-8">
              {/* Back Button */}
              <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Volver a Distritos</span>
              </button>
              {/* District Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <MapPin className="text-blue-600" size={32} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-800">
                          {distrito.name}
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${distrito.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {distrito.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">
                        {distrito.description || 'Sin descripción'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Código: {distrito.code} • Actualizado:{' '}
                        {new Date(distrito.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setIsEditModalOpen(true)} className="flex items-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                      <Pencil size={18} />
                      <span>Editar Distrito</span>
                    </button>
                    <button
                      // onClick={handleDelete} 
                      className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium">
                      <Trash2 size={18} />
                      <span>Eliminar Distrito</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Total de Oficinas
                  </h3>
                  <p className="text-4xl font-bold text-gray-800">
                    {distrito.offices.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Oficinas Activas
                  </h3>
                  <p className="text-4xl font-bold text-green-600">
                    {oficinasActivas}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Oficinas Inactivas
                  </h3>
                  <p className="text-4xl font-bold text-gray-600">
                    {oficinasInactivas}
                  </p>
                </div>
              </div>
              {/* Offices Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Oficinas del Distrito
                  </h2>
                  <button onClick={() => setIsAddOfficeModalOpen(true)} className="flex items-center space-x-2 px-4 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
                    <Plus size={18} />
                    <span>Agregar Oficina</span>
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
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                          DIRECCIÓN
                        </th>
                        {/* <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                          USUARIO ASIGNADO
                        </th> */}
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
                      {filteredOficinas.length === 0 ? <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          No hay oficinas en este distrito
                        </td>
                      </tr> : filteredOficinas.map((oficina, index) => <tr key={oficina.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {oficina.code}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">
                            {oficina.name}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {oficina.direction || <span className="text-gray-400 italic">-</span>}
                        </td>
                        {/* <td className="py-4 px-6">
                          {oficina.usuarioAsignado ? <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#cf2e2e] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-xs">
                                {oficina.usuarioAsignado.split(' ').slice(0, 2).map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {oficina.usuarioAsignado}
                              </p>
                            </div>
                          </div> : <span className="text-sm text-gray-400 italic">
                            Sin asignar
                          </span>}
                        </td> */}
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${oficina.status === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {oficina.status === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600 text-sm">
                          {new Date(oficina.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => navigate(`/configuraciones/asignacion-territorial/oficinas/${oficina.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleEditOffice(oficina)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                              <Trash2 size={18} />
                            </button>
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
      </div>
      {/* Modals */}
      <DistrictModal mode="edit" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} distrito={distrito} onSubmit={data => {
        alert(`Actualizando distrito: ${distrito.name}`);
        setIsEditModalOpen(false);
      }} />
      {/* <OfficeModal mode="create" isOpen={isAddOfficeModalOpen} onClose={() => setIsAddOfficeModalOpen(false)} oficina={null} presetDistrictId={distrito.codigo} onSubmit={data => {
        alert(`Creando oficina: ${data.nombre} en distrito ${distrito.nombre}`);
        setIsAddOfficeModalOpen(false);
      }} /> */}
      {/* <OfficeModal mode="edit" isOpen={isEditOfficeModalOpen} onClose={() => {
        setIsEditOfficeModalOpen(false);
        setSelectedOficina(null);
      }} oficina={selectedOficina} onSubmit={data => {
        alert(`Actualizando oficina: ${data.nombre}`);
        setIsEditOfficeModalOpen(false);
        setSelectedOficina(null);
      }} /> */}
      {/* <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={oficinasDelDistrito.length > 0 ? undefined : confirmDelete} title="Eliminar Distrito" message={oficinasDelDistrito.length > 0 ? `No se puede eliminar el distrito "${distrito.nombre}" porque tiene ${oficinasDelDistrito.length} oficinas asociadas. Por favor, reasigna o elimina las oficinas primero.` : `¿Estás seguro de que deseas eliminar el distrito "${distrito.nombre}"? Esta acción no se puede deshacer.`} confirmText={oficinasDelDistrito.length > 0 ? undefined : 'Eliminar'} type={oficinasDelDistrito.length > 0 ? 'warning' : 'danger'} /> */}
    </div>
  );
}