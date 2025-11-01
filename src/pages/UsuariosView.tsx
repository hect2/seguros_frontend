import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { PermissionGuard } from '../components/PermissionGuard';
import { UsersFilters } from '../components/usuarios/UsersFilters';
import { UsersTable } from '../components/usuarios/UsersTable';
import { CreateUserModal } from '../components/usuarios/CreateUserModal';
import { UserDetailModal } from '../components/usuarios/UserDetailModal';
import { BulkUploadTab } from '../components/usuarios/bulk-upload/BulkUploadTab';
export function UsuariosView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'listado' | 'carga-masiva'>('listado');
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };
  const handleBulkUploadComplete = () => {
    setActiveTab('listado');
  };
  return <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
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
              <PermissionGuard allowedRoles={['Super Admin', 'Admin']} currentRole="Admin">
                <button onClick={() => setActiveTab('carga-masiva')} className={`pb-3 px-1 font-medium text-sm transition-colors ${activeTab === 'carga-masiva' ? 'text-[#cf2e2e] border-b-2 border-[#cf2e2e]' : 'text-gray-600 hover:text-gray-800'}`}>
                  Carga masiva
                </button>
              </PermissionGuard>
            </div>
          </div>
          {activeTab === 'listado' && <>
              <UsersFilters />
              <div className="mt-6 flex justify-end">
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2">
                  <span className="text-xl">+</span>
                  <span>Crear Usuario</span>
                </button>
              </div>
              <div className="mt-6">
                <UsersTable onViewUser={handleViewUser} />
              </div>
            </>}
          {activeTab === 'carga-masiva' && <PermissionGuard allowedRoles={['Super Admin', 'Admin']} currentRole="Admin">
              <BulkUploadTab onComplete={handleBulkUploadComplete} />
            </PermissionGuard>}
        </main>
      </div>
      {isCreateModalOpen && <CreateUserModal onClose={() => setIsCreateModalOpen(false)} />}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>;
}