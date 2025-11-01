import React, { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { AdminUsersFilters } from '../../../components/configuraciones/seguridad/AdminUsersFilters';
import { AdminUsersTable } from '../../../components/configuraciones/seguridad/AdminUsersTable';
import { AdminCreateUserModal } from '../../../components/configuraciones/seguridad/AdminCreateUserModal';
import { AdminUserDetailModal } from '../../../components/configuraciones/seguridad/AdminUserDetailModal';
import { AdminEditUserModal } from '../../../components/configuraciones/seguridad/AdminEditUserModal';
import { ChevronRight } from 'lucide-react';
export function AdministracionUsuariosView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToEdit, setUserToEdit] = useState<any>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    rol: 'all',
    estado: 'all',
    distrito: 'all',
    oficina: 'all'
  });
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };
  const handleEditUser = (user: any) => {
    setSelectedUser(null);
    setUserToEdit(user);
  };
  const handleSaveUser = (updatedUser: any) => {
    console.log('Usuario actualizado:', updatedUser);
    setUserToEdit(null);
  };
  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };
  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      rol: 'all',
      estado: 'all',
      distrito: 'all',
      oficina: 'all'
    });
  };
  return <PermissionGuard allowedRoles={['Super Admin', 'Admin']}>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="p-4 lg:p-8">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <span>Configuraciones</span>
              <ChevronRight size={16} />
              <span>Seguridad</span>
              <ChevronRight size={16} />
              <span className="text-gray-900 font-medium">
                Administración de Usuarios
              </span>
            </div>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Administración de Usuarios
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión de accesos y permisos del sistema
              </p>
            </div>
            {/* Filters */}
            <AdminUsersFilters filters={filters} onApply={handleApplyFilters} onClear={handleClearFilters} />
            {/* Create Button */}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2">
                <span className="text-xl">+</span>
                <span>Crear Usuario</span>
              </button>
            </div>
            {/* Table */}
            <div className="mt-6">
              <AdminUsersTable onViewUser={handleViewUser} onEditUser={handleEditUser} filters={filters} />
            </div>
          </main>
        </div>
        {isCreateModalOpen && <AdminCreateUserModal onClose={() => setIsCreateModalOpen(false)} />}
        {selectedUser && <AdminUserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onEdit={handleEditUser} />}
        {userToEdit && <AdminEditUserModal user={userToEdit} onClose={() => setUserToEdit(null)} onSave={handleSaveUser} />}
      </div>
    </PermissionGuard>;
}