import React from 'react';
import { ShieldAlert } from 'lucide-react';
interface PermissionGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  currentRole?: string;
}
export function PermissionGuard({
  allowedRoles,
  children,
  currentRole = 'Admin' // Mock default role
}: PermissionGuardProps) {
  if (!allowedRoles.includes(currentRole)) {
    return <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
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
          <div className="text-sm text-gray-500">
            Roles permitidos: {allowedRoles.join(', ')}
          </div>
        </div>
      </div>;
  }
  return <>{children}</>;
}