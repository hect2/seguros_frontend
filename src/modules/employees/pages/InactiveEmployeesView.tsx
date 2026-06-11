import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useAuthStore } from '@/auth/store/auth.store';
import { useInactiveEmployees } from '../hooks/useInactiveEmployees';
import { useReactivateEmployee } from '../hooks/useReactivateEmployee';
import { ConfirmDialog } from '@/components/configuraciones/ConfirmDialog';
import { toast } from 'sonner';

export function InactiveEmployeesView() {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [selectedUserToReactivate, setSelectedUserToReactivate] = useState<number | null>(null);

  const { data: users, isLoading } = useInactiveEmployees({ search });
  const { mutate: reactivate } = useReactivateEmployee();

  const handleOpenReactivateModal = (id: number) => {
    setSelectedUserToReactivate(id);
    setIsReactivateModalOpen(true);
  };

  const handleConfirmReactivate = () => {
    if (selectedUserToReactivate) {
      reactivate(selectedUserToReactivate, {
        onSuccess: () => {
          toast.success('Colaborador reactivado con éxito');
          setIsReactivateModalOpen(false);
          setSelectedUserToReactivate(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Error al reactivar colaborador');
          setIsReactivateModalOpen(false);
          setSelectedUserToReactivate(null);
        }
      });
    }
  };

  const canReactivate = user?.role_names?.some(role => 
    role.toLowerCase().includes('tth') || 
    role.toLowerCase() === 'talento humano' || 
    role.toLowerCase() === 'super administrador'
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-50' : 'ml-0'} lg:ml-60`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <PermissionGuard allowedPermissions={['employees_view']} user={user}>
          <main className="p-4 lg:p-8">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Colaboradores Inactivos
              </h1>
              <p className="text-gray-600 mt-1">
                Visualización y reactivación de colaboradores dados de baja
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <input
                  type="text"
                  placeholder="Buscar por DPI o Nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-[#cf2e2e] transition-shadow w-64"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                      <th className="p-4 font-semibold">DPI</th>
                      <th className="p-4 font-semibold">Nombre Completo</th>
                      <th className="p-4 font-semibold">Fecha de Baja</th>
                      <th className="p-4 font-semibold">Razón</th>
                      <th className="p-4 font-semibold text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users?.data?.map((u: any) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 text-gray-800">{u.dpi || '-'}</td>
                        <td className="p-4 text-gray-800 font-medium">{u.full_name}</td>
                        <td className="p-4 text-gray-600">
                          {new Date(u.deleted_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-gray-600">{u.reason || '-'}</td>
                        <td className="p-4 flex justify-center space-x-2">
                          {canReactivate ? (
                            <button
                              onClick={() => handleOpenReactivateModal(u.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                            >
                              Reactivar
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No autorizado</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users?.data?.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-500">
                          No hay colaboradores inactivos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </PermissionGuard>
      </div>

      <ConfirmDialog
        isOpen={isReactivateModalOpen}
        onClose={() => {
          setIsReactivateModalOpen(false);
          setSelectedUserToReactivate(null);
        }}
        onConfirm={handleConfirmReactivate}
        title="Reactivar Colaborador"
        message="¿Estás seguro que deseas reactivar este colaborador? Esta acción restaurará su perfil en la tabla de colaboradores activos."
        confirmText="Reactivar"
        cancelText="Cancelar"
        type="info"
      />
    </div>
  );
}
