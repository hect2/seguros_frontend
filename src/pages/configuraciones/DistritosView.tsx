import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { DashboardHeader } from '../../components/DashboardHeader';
import { PermissionGuard } from '../../components/PermissionGuard';
import { Search, Plus, Eye, Pencil, Trash2, Upload, FileDown, FileSpreadsheet } from 'lucide-react';
// import { mockDistritos, Distrito } from '../../utils/mockData';
import { District } from '@/interfaces/district.interface';
import { DistrictModal } from '../../components/configuraciones/DistrictModal';
import { ConfirmDialog } from '../../components/configuraciones/ConfirmDialog';
import { useDistricts } from '@/seguros/hooks/useDistricts';
import { CustomPagination } from '@/components/custom/ CustomPagination';

export function DistritosView() {

  const { data } = useDistricts();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'all' | 'Activo' | 'Inactivo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDistrito, setSelectedDistrito] = useState<District | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [distritoToDelete, setDistritoToDelete] = useState<District | null>(null);
  const navigate = useNavigate();
  const districts = data?.data || [];
  const filteredDistritos = districts.filter(distrito => {
    const matchesSearch = distrito.name.toLowerCase().includes(searchTerm.toLowerCase()) || distrito.code.toLowerCase().includes(searchTerm.toLowerCase());
    const statusText = distrito.status === 1 ? 'Activo' : 'Inactivo';
    const matchesEstado = estadoFilter === 'all' || statusText === estadoFilter;
    return matchesSearch && matchesEstado;
  });
  const handleCreate = () => {
    setModalMode('create');
    setSelectedDistrito(null);
    setIsModalOpen(true);
  };
  const handleEdit = (distrito: District) => {
    setModalMode('edit');
    setSelectedDistrito(distrito);
    setIsModalOpen(true);
  };
  const handleDelete = (distrito: District) => {
    setDistritoToDelete(distrito);
    setIsDeleteDialogOpen(true);
  };
  const handleViewDistrict = (distrito: District) => {
    navigate(`/configuraciones/asignacion-territorial/distritos/${distrito.id}`);
  };
  const confirmDelete = () => {
    alert(`Eliminando distrito: ${distritoToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setDistritoToDelete(null);
  };
  return <PermissionGuard allowedRoles={['Super Admin', 'Admin']}>
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gestión de Distritos
            </h1>
          </div>
          {/* Filters and Actions Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                <div className="relative flex-1 lg:max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Buscar por nombre o código..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                </div>
                <select value={estadoFilter} onChange={e => setEstadoFilter(e.target.value as any)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                  <option value="all">Todos los estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
                </button>
                <button onClick={handleCreate} className="flex items-center space-x-2 px-4 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
                  <Plus size={18} />
                  <span>Crear Distrito</span>
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
                      CÓDIGO
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                      NOMBRE DE DISTRITO
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                      OFICINAS ASOCIADAS
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
                  {filteredDistritos.map((distrito, index) => <tr key={distrito.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`} onClick={() => handleViewDistrict(distrito)}>
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {distrito.name}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {distrito.name}
                        </div>
                        {distrito.description && <div className="text-sm text-gray-500">
                          {distrito.description}
                        </div>}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button onClick={e => {
                        e.stopPropagation();
                        navigate(`/configuraciones/asignacion-territorial/oficinas?distrito=${distrito.code}`);
                      }} className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition-colors">
                        {/* {distrito.oficinasCount} */}
                        6
                      </button>
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
                        <button onClick={e => {
                          e.stopPropagation();
                          handleViewDistrict(distrito);
                        }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                          <Eye size={18} />
                        </button>
                        <button onClick={e => {
                          e.stopPropagation();
                          handleEdit(distrito);
                        }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                          <Pencil size={18} />
                        </button>
                        <button onClick={e => {
                          e.stopPropagation();
                          handleDelete(distrito);
                        }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>




            {/* Pagination */}
            <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1}  />




          </div>
        </main>
      </div>
    </div>
    {/* <DistrictModal mode={modalMode} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} distrito={selectedDistrito} onSubmit={data => {
      alert(`${modalMode === 'create' ? 'Creando' : 'Actualizando'} distrito: ${data.nombre}`);
      setIsModalOpen(false);
    }} /> */}
    {/* <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={confirmDelete} title="Eliminar Distrito" message={distritoToDelete?.oficinasCount && distritoToDelete.oficinasCount > 0 ? `No se puede eliminar el distrito "${distritoToDelete?.nombre}" porque tiene ${distritoToDelete?.oficinasCount} oficinas asociadas. Por favor, reasigna o elimina las oficinas primero.` : `¿Estás seguro de que deseas eliminar el distrito "${distritoToDelete?.nombre}"? Esta acción no se puede deshacer.`} confirmText={distritoToDelete?.oficinasCount && distritoToDelete.oficinasCount > 0 ? undefined : 'Eliminar'} type={distritoToDelete?.oficinasCount && distritoToDelete.oficinasCount > 0 ? 'warning' : 'danger'} /> */}
  </PermissionGuard>;
}