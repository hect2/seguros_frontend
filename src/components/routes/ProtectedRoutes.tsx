import { useAuthStore } from "@/auth/store/auth.store";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectionRoutes";


export const AuthenticatedRoute = ({ children }: PropsWithChildren) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();
  if (authStatus === "checking") return null;
  if (authStatus === "authenticated") return <Navigate to="/tablero" replace />;
  return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => (
  <ProtectedRoute adminOnly>{children}</ProtectedRoute>
);