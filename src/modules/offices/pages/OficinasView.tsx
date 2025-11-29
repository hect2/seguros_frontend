import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { Search, Plus, Eye, Pencil, Trash2, Upload, FileDown, FileSpreadsheet } from 'lucide-react';
import { mockOficinas, mockDistritos, Oficina } from '../../../utils/mockData';
import { OfficeModal } from '../components/OfficeModal';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
export function OficinasView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<'all' | 'Activo' | 'Inactivo'>('all');
  const [distritoFilter, setDistritoFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedOficina, setSelectedOficina] = useState<Oficina | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [oficinaToDelete, setOficinaToDelete] = useState<Oficina | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const distritoParam = searchParams.get('distrito');
    if (distritoParam) {
      setDistritoFilter(distritoParam);
    }
  }, [searchParams]);
  const filteredOficinas = mockOficinas.filter(oficina => {
    const matchesSearch = oficina.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || oficina.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === 'all' || oficina.estado === estadoFilter;
    const matchesDistrito = distritoFilter === 'all' || oficina.distrito === distritoFilter;
    return matchesSearch && matchesEstado && matchesDistrito;
  });
  const handleCreate = () => {
    setModalMode('create');
    setSelectedOficina(null);
    setIsModalOpen(true);
  };
  const handleEdit = (oficina: Oficina) => {
    setModalMode('edit');
    setSelectedOficina(oficina);
    setIsModalOpen(true);
  };
  const handleDelete = (oficina: Oficina) => {
    setOficinaToDelete(oficina);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = () => {
    alert(`Eliminando oficina: ${oficinaToDelete?.nombre}`);
    setIsDeleteDialogOpen(false);
    setOficinaToDelete(null);
  };
  return <PermissionGuard allowedRoles={['Super Admin', 'Admin']}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="p-4 lg:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestión de Oficinas
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
                  <select value={distritoFilter} onChange={e => setDistritoFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                    <option value="all">Todos los distritos</option>
                    {mockDistritos.map(distrito => <option key={distrito.id} value={distrito.codigo}>
                        {distrito.nombre}
                      </option>)}
                  </select>
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
                    <span>Crear Oficina</span>
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
                        NOMBRE DE OFICINA
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                        DISTRITO
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                        USUARIO ASIGNADO
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
                    {filteredOficinas.map((oficina, index) => <tr key={oficina.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-6 font-medium text-gray-800">
                          {oficina.codigo}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">
                            {oficina.nombre}
                          </div>
                          {oficina.direccion && <div className="text-sm text-gray-500">
                              {oficina.direccion}
                            </div>}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {oficina.distrito}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700">
                          {oficina.usuarioAsignado || <span className="text-gray-400 italic">
                              Sin asignar
                            </span>}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${oficina.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {oficina.estado}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-gray-600 text-sm">
                          {oficina.updatedAt}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => navigate(`/configuraciones/asignacion-territorial/oficinas/${oficina.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver detalles">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleEdit(oficina)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDelete(oficina)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando 1 a {filteredOficinas.length} de{' '}
                  {filteredOficinas.length} oficinas
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                    Anterior
                  </button>
                  <button className="px-3 py-1.5 bg-[#cf2e2e] text-white rounded-lg text-sm">
                    Página 1 de 1
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <OfficeModal mode={modalMode} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} oficina={selectedOficina} onSubmit={data => {
      alert(`${modalMode === 'create' ? 'Creando' : 'Actualizando'} oficina: ${data.nombre}`);
      setIsModalOpen(false);
    }} />
      <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={confirmDelete} title="Eliminar Oficina" message={`¿Estás seguro de que deseas eliminar la oficina "${oficinaToDelete?.nombre}"? Esta acción no se puede deshacer.`} confirmText="Eliminar" type="danger" />
    </PermissionGuard>;
}