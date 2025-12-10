import React, { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { PermissionGuard } from '../../../components/PermissionGuard';
import { AdminUsersFilters } from '../components/AdminUsersFilters';
import { AdminUsersTable } from '../components/AdminUsersTable';
import { AdminCreateUserModal } from '../components/AdminCreateUserModal';
import { AdminUserDetailModal } from '../components/AdminUserDetailModal';
import { AdminEditUserModal } from '../components/AdminEditUserModal';
import { ChevronRight } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useRolesList } from '@/seguros/hooks/useRolesList';
import { useStatusEmployeesList } from '@/seguros/hooks/useStatusEmployeesList';
import { useDistrictsList } from '@/seguros/hooks/useDistrictsList';
import { User } from '../interfaces/user';
import { User as UserUpdate } from '../interfaces/user.response';
import { toast } from 'sonner';
import { Data as UserData } from '../interfaces/users.response';
import { useAuthStore } from '@/auth/store/auth.store';
import { useOfficesList } from '@/seguros/hooks/useOfficesList';

export function AdministracionUsuariosView() {
  const { user } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData>();
  const [userToEdit, setUserToEdit] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});

  const { data: rolesList } = useRolesList();
  const { data: statusEmployeesList } = useStatusEmployeesList();
  const { data: districtsList } = useDistrictsList();
  const { data: officesList } = useOfficesList();
  const { data: users, mutation, updateMutation } = useUsers(filters);

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    console.log('Ver usuario: ', user)
  };
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setUserToEdit(user);
  };
  const handleSaveUser = async (userLike: Partial<UserUpdate>) => {
    console.log('Usuario actualizado:', userLike);
    await updateMutation.mutateAsync(userLike, {
      onSuccess: () => {
        toast.success("Usuario actualizado con éxito", {
          position: "top-right",
        });

        // Recargar tabla de usuarios
        // queryClient.invalidateQueries({ queryKey: ["users"] });

        // Cerrar modal de edición
        setUserToEdit(null);

        // Actualizar detalle si estaba abierto
        if (selectedUser && selectedUser.id === userLike.id) {
          setSelectedUser((prev: any) => ({
            ...prev,
            ...userLike, // mezcla lo nuevo con lo viejo
          }));
        }
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Error desconocido";

        console.error("Error updating user:", message);

        toast.error(
          "Error al actualizar el usuario: " +
          message.replace("(and 1 more error)", ""),
          {
            position: "top-right",
          }
        );
      },
    });
    setUserToEdit(null);
  };


  const handleSubmit = async (userLike: Partial<User>) => {
    await mutation.mutateAsync(userLike, {
      onSuccess: (data) => {
        console.log('User created:', data);
        setIsCreateModalOpen(false);
        toast.success('Usuario creado con éxito', {
          position: 'top-right',
        });
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Error desconocido";

        console.error("Error creating user:", message);
        toast.success('Error al crear el usuario: ' + message.replace('(and 1 more error)', ''), {
          position: 'top-right',
        });
      },
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} allowedPermissions={['users_view']} user={user}>
          <main className="p-4 lg:p-8">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 textselectedUser-sm text-gray-600 mb-4">
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
            <AdminUsersFilters
              onApply={(f) => setFilters(f)}
              onClear={() => setFilters({})}
              roles={rolesList}
              status_employees={statusEmployeesList}
              districts={districtsList}
            />
            {/* Create Button */}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2">
                <span className="text-xl">+</span>
                <span>Crear Usuario</span>
              </button>
            </div>
            {/* Table */}
            <div className="mt-6">
              <AdminUsersTable
                data={users}
                onViewUser={handleViewUser}
                onEditUser={handleEditUser}
              />
            </div>
          </main>
        </PermissionGuard>
      </div>
      {isCreateModalOpen && <AdminCreateUserModal
        onClose={() => setIsCreateModalOpen(false)}
        roles={rolesList}
        status_employees={statusEmployeesList}
        districts={districtsList}
        offices={officesList}
        onSubmit={handleSubmit}
      />}
      {selectedUser && <AdminUserDetailModal
        id={selectedUser.id}
        onClose={() => setSelectedUser(null)}
        onEdit={handleEditUser}
      />}
      {userToEdit && <AdminEditUserModal
        user={userToEdit}
        roles={rolesList}
        status_employees={statusEmployeesList}
        districts={districtsList}
        onClose={() => setUserToEdit(null)}
        onSave={handleSaveUser} />}
    </div>
  );
}