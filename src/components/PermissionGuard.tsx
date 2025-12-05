import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { User } from '@/auth/interfaces/auth.response';
// import { User } from '../interfaces/auth.response';

interface PermissionGuardProps {
  allowedRoles?: string[];          // Opcional: Roles requeridos
  allowedPermissions?: string[];    // Opcional: Permisos requeridos
  show_dialog?: boolean;
  children: React.ReactNode;
  user: User | null;
}

export function PermissionGuard({
  allowedRoles = [],
  allowedPermissions = [],
  show_dialog = true,
  children,
  user,
}: PermissionGuardProps) {

  const hasRole =
    allowedRoles.length === 0 ||
    allowedRoles.some(role => user?.role_names?.includes(role));

  const hasPermission =
    allowedPermissions.length === 0 ||
    allowedPermissions.some(perm => user?.permission_names?.includes(perm));

  const isAllowed = hasRole && hasPermission;

  if (!isAllowed) {
    if (!isAllowed && !show_dialog) {
      return '';
    }
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="text-[#cf2e2e]" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección. Contacta al
            administrador del sistema si necesitas acceso.
          </p>

          {allowedRoles.length > 0 && (
            <div className="text-sm text-gray-500 mb-1">
              Roles permitidos: {allowedRoles.join(', ')}
            </div>
          )}

          {allowedPermissions.length > 0 && (
            <div className="text-sm text-gray-500">
              Permisos requeridos: {allowedPermissions.join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
