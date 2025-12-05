import React, { useState } from 'react';
import { UsersFilters } from '../components/usuarios/UsersFilters';
import { UsersTable } from '../components/usuarios/UsersTable';
import { CreateUserModal } from '../components/usuarios/CreateUserModal';
import { UserDetailModal } from '../components/usuarios/UserDetailModal';
import { BulkUploadTab } from '../components/usuarios/bulk-upload/BulkUploadTab';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useOfficesList } from '@/seguros/hooks/useOfficesList';
import { useDistrictsList } from '@/seguros/hooks/useDistrictsList';
import { useStatusEmployeesList } from '@/seguros/hooks/useStatusEmployeesList';
import { useEmployees } from '../hooks/useEmployees';
import { useAuthStore } from '@/auth/store/auth.store';
import { EditUserModal } from '../components/usuarios/EditUserModal';
import { useRolesList } from '@/seguros/hooks/useRolesList';
import { usePositionTypesList } from '@/seguros/hooks/usePositionTypesList';

export function EmployeesView() {
  const { user } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'listado' | 'carga-masiva'>('listado');
  const [filters, setFilters] = useState<any>({});

  const { data: users, createEmployee, updateEmployee } = useEmployees(filters);
  const { data: officesList } = useOfficesList();
  const { data: statusEmployeesList } = useStatusEmployeesList();
  const { data: positionTypesList } = usePositionTypesList();
  const { data: districtsList } = useDistrictsList();

  const handleViewEditUser = (user_id: number) => {
    setSelectedUser(user_id);
    setIsEditModalOpen(true);
  };

  const handleViewUser = (user_id: number) => {
    setSelectedUser(user_id);
    setIsDetailModalOpen(true);
  };
  const handleBulkUploadComplete = () => {
    setActiveTab('listado');
  };

  const handleCreateUser = (data: any) => {
    console.log('handleCreateUser:', data);
    createEmployee(data);
  };

  const handleEditUser = (employeeId: number, data: any) => {
    console.log('handleEditUser:', data);
    updateEmployee({ id: employeeId, data: data });
  };

  return <div className="flex min-h-screen w-full bg-gray-50">
    <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
    <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-50' : 'ml-0'} lg:ml-60`}>
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <PermissionGuard allowedPermissions={['employees_view']} user={user}>
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mt-1">
              Administración de empleados y colaboradores
            </p>
          </div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button onClick={() => setActiveTab('listado')} className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'listado' ? 'text-[#cf2e2e] border-b-2 border-[#cf2e2e]' : 'text-gray-600 hover:text-gray-800'}`}>
                Listado
              </button>

              <PermissionGuard allowedPermissions={['employees_create_or_import']} user={user} show_dialog={false}>
              <button onClick={() => setActiveTab('carga-masiva')} className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'carga-masiva' ? 'text-[#cf2e2e] border-b-2 border-[#cf2e2e]' : 'text-gray-600 hover:text-gray-800'}`}>
                Carga masiva
              </button>
              </PermissionGuard>
            </div>
          </div>
          {activeTab === 'listado' && <>
            <UsersFilters
              offices={officesList}
              status_employees={statusEmployeesList}
              districts={districtsList}
              onApply={(f) => setFilters(f)}
              onClear={() => setFilters({})}
            />
            <div className="mt-6 flex justify-end">
              <PermissionGuard allowedPermissions={['employees_create_or_import']} user={user} show_dialog={false}>
              <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2">
                <span className="text-xl">+</span>
                <span>Crear Usuario</span>
              </button>
              </PermissionGuard>
            </div>
            <div className="mt-6">
              <UsersTable
                data={users}
                onViewUser={handleViewUser}
                onViewEditUser={handleViewEditUser}
              />
            </div>
          </>}
          {activeTab === 'carga-masiva' && <PermissionGuard allowedPermissions={['employees_create_or_import']} user={user} show_dialog={false}>
            <BulkUploadTab onComplete={handleBulkUploadComplete} />
          </PermissionGuard>}
        </main>
      </PermissionGuard>
    </div>
    {isCreateModalOpen &&
      <CreateUserModal
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        offices={officesList}
        districts={districtsList}
        positionTypes={positionTypesList}
      />}
    {isEditModalOpen && (
      <EditUserModal
        user_id={selectedUser}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditUser}
        offices={officesList}
        districts={districtsList}
        positionTypes={positionTypesList}
      />
    )}

    {isDetailModalOpen &&
      <UserDetailModal
        user_id={selectedUser}
        onClose={() => setIsDetailModalOpen(false)}
      />
    }
  </div >;
}