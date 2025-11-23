// src/router/ProtectedRoute.tsx
import { useAuthStore } from "@/auth/store/auth.store";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  requiredPermissions?: string[]; // 👈 Permisos opcionales
  adminOnly?: boolean;            // 👈 Solo admins
}

export const ProtectedRoute = ({ children, requiredPermissions, adminOnly }: Props) => {
  const { authStatus, roles, isAdmin } = useAuthStore();

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/tablero" replace />;
  }

  if (requiredPermissions?.length) {
    const userPerms = roles();
    const hasPerm = requiredPermissions.some(p => userPerms.includes(p));

    if (!hasPerm) {
      return <Navigate to="/tablero" replace />;
    }
  }

  return children;
};
