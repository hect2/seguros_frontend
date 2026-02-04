import React, { PropsWithChildren } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginView } from './pages/LoginView';
import { App } from './App';
import { NovedadesView } from './modules/incidents/pages/NovedadesView';
import { EmployeesView } from './modules/employees/pages/EmployeesView';
import { ReportesView } from './modules/reports/pages/ReportesView';
import { AsignacionTerritorialView } from './pages/configuraciones/AsignacionTerritorialView';
import { DistritosView } from './modules/districts/pages/DistritosView';
import { OficinasView } from './modules/offices/pages/OficinasView';
import { OfficeDetailView } from './modules/offices/pages/OfficeDetailView';
import { DistrictDetailView } from './modules/districts/pages/DistrictDetailView';
import { AdministracionUsuariosView } from './modules/users/pages/AdministracionUsuariosView';
import { BusinessesView } from './modules/business/pages/BusinessesView';
import { BusinessDetailView } from './modules/business/pages/BusinessDetailView';
import { AdministracionCatalogosView } from './pages/configuraciones/AdministracionCatalogosView';
import { PositionsView } from './modules/positions/pages/PositionsView';
import { StatusEmployeesView } from './modules/status-employees/pages/StatusEmployeesView';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CustomFullScreenLoading } from './components/custom/CustomFullScreenLoading';
import { useAuthStore } from './auth/store/auth.store';
import { AuthenticatedRoute, NotAuthenticatedRoute } from './components/routes/ProtectedRoutes';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/routes/ProtectionRoutes';
import ProfileView from './pages/ProfileView';
import { IncidentsCatalogView } from './modules/incidentsCatalog/pages/IncidentsCatalogView';

const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const { checkAuthStatus, logout, authStatus } = useAuthStore();

  const { isLoading, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuthStatus,
    retry: false,
    refetchInterval: 1000 * 60 * 1.5,
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    if (isError) {
      logout();
      Navigate('/login')
    }
  }, [isError, logout]);

  if (isLoading || authStatus === 'checking') return <CustomFullScreenLoading />;

  return children;
};

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <CheckAuthProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Rutas públicas */}
              <Route
                path="/login"
                element={
                  <NotAuthenticatedRoute>
                    <LoginView />
                  </NotAuthenticatedRoute>
                }
              />

              {/* Rutas protegidas */}
              <Route
                path="/tablero"
                element={
                  <AuthenticatedRoute>
                    <App />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/novedades"
                element={
                  <ProtectedRoute requiredPermissions={["incidents_view"]}>
                    <NovedadesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute requiredPermissions={["employees_view"]}>
                    <EmployeesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usuarios/carga-masiva"
                element={
                  <ProtectedRoute requiredPermissions={["employees_view"]}>
                    <EmployeesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reportes"
                element={
                  <ProtectedRoute requiredPermissions={["reports_view"]}>
                    <ReportesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/asignacion-territorial"
                element={
                  <ProtectedRoute requiredPermissions={['districts_view', 'offices_view',]}>
                    <AsignacionTerritorialView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/asignacion-territorial/distritos"
                element={
                  <ProtectedRoute requiredPermissions={['districts_view',]}>
                    <DistritosView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/asignacion-territorial/distritos/:id"
                element={
                  <ProtectedRoute requiredPermissions={['districts_view',]}>
                    <DistrictDetailView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/asignacion-territorial/oficinas"
                element={
                  <ProtectedRoute requiredPermissions={['offices_view',]}>
                    <OficinasView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/asignacion-territorial/oficinas/:id"
                element={
                  <ProtectedRoute requiredPermissions={['offices_view',]}>
                    <OfficeDetailView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/catalogos"
                element={
                  <ProtectedRoute requiredPermissions={['users_view']}>
                    <AdministracionCatalogosView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/catalogos/clientes"
                element={
                  <ProtectedRoute requiredPermissions={['business_view',]}>
                    <BusinessesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/catalogos/clientes/:id"
                element={
                  <ProtectedRoute requiredPermissions={['business_view',]}>
                    <BusinessDetailView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/catalogos/cargos"
                element={
                  <ProtectedRoute requiredPermissions={['users_view']}>
                    <PositionsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/catalogos/estatus-empleado"
                element={
                  <ProtectedRoute requiredPermissions={['users_view']}>
                    <StatusEmployeesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/catalogos/novedades"
                element={
                  <ProtectedRoute requiredPermissions={['users_view']}>
                    <IncidentsCatalogView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/configuraciones/seguridad/administracion-usuarios"
                element={
                  <ProtectedRoute requiredPermissions={['users_view',]}>
                    <AdministracionUsuariosView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/perfil"
                element={
                  <AuthenticatedRoute>
                    <ProfileView />
                  </AuthenticatedRoute>
                }
              />

              {/* Redirección por defecto */}
              {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
