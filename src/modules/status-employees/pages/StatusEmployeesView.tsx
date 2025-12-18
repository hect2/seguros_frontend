import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { StatusEmployee } from '@/modules/status-employees/interfaces/status-employee.interface';
import { StatusEmployeeModal } from '../components/StatusEmployeeModal';
import { ConfirmDialog } from '../../../components/configuraciones/ConfirmDialog';
import { CustomPagination } from '@/components/custom/CustomPagination';
import { toast } from 'sonner';
import { useStatusEmployees } from '@/modules/status-employees/hooks/useStatusEmployees';
import { useAuthStore } from '@/auth/store/auth.store';
import { useSearchParams } from "react-router-dom";

export function StatusEmployeesView() {
  const { user } = useAuthStore();

  const { data, createStatusEmployee, updateStatusEmployee } = useStatusEmployees();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Activo' | 'Inactivo'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedStatusEmployee, setSelectedStatusEmployee] = useState<StatusEmployee | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusEmployeeToDelete, setStatusEmployeeToDelete] = useState<StatusEmployee | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const statusEmployees = data?.data || [];

  const handleCreate = () => {
    setModalMode('create');
    setSelectedStatusEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (statusEmployee: StatusEmployee) => {
    setModalMode('edit');
    setSelectedStatusEmployee(statusEmployee);
    setIsModalOpen(true);
  };

  const handleDelete = (statusEmployee: StatusEmployee) => {
    setStatusEmployeeToDelete(statusEmployee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    alert(`Eliminando estatus: ${statusEmployeeToDelete?.name}`);
    setIsDeleteDialogOpen(false);
    setStatusEmployeeToDelete(null);
  };

  const handleSubmit = async (statusEmployeeLike: Partial<StatusEmployee>) => {
    const processedData = {
      ...statusEmployeeLike,
    };

    if (modalMode === 'create') {
      await createStatusEmployee(processedData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Estatus creado con éxito', {
            position: 'top-right',
          });
        },
        onError: () => {
          toast.error('No se pudo crear el estatus', {
            position: 'top-right',
          });
        }
      });
    } else {
      await updateStatusEmployee({ ...processedData, id: selectedStatusEmployee!.id }, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Estatus actualizado con éxito', {
            position: 'top-right',
          });
        },
        onError: () => {
          toast.error('No se pudo actualizar el estatus', {
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
                  Gestión de Estatus de Colaborador
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
                      <span>Crear Estatus</span>
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
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">DESCRIPCIÓN</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">ÚLTIMA ACTUALIZACIÓN</th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusEmployees.map((statusEmployee, index) => <tr key={statusEmployee.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-4 px-6">{statusEmployee.name}</td>
                        <td className="py-4 px-6 text-gray-600">{statusEmployee.description}</td>
                        <td className="py-4 px-6 text-center text-gray-600 text-sm">
                          {new Date(statusEmployee.updated_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <button onClick={() => handleEdit(statusEmployee)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Pencil size={18} />
                            </button>
                            {/* <button onClick={() => handleDelete(statusEmployee)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                              <Trash2 size={18} />
                            </button> */}
                          </div>
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
                <CustomPagination totalPages={data?.last_page || 1} from={data?.from || 1} to={data?.to || 1} totalItems={data?.total || 1} module='estatus' />
              </div>
            </main>
          </PermissionGuard>
        </div>
      </div>
      <StatusEmployeeModal
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        isOpen={isModalOpen}
        statusEmployee={selectedStatusEmployee}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Estatus"
        message={`¿Estás seguro de que deseas eliminar el estatus "${statusEmployeeToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText={'Eliminar'}
        type={'danger'}
      />
    </div>
  );
}
