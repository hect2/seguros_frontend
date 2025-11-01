import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginView } from './pages/LoginView';
import { App } from './App';
import { NovedadesView } from './pages/NovedadesView';
import { UsuariosView } from './pages/UsuariosView';
import { ReportesView } from './pages/ReportesView';
import { AsignacionTerritorialView } from './pages/configuraciones/AsignacionTerritorialView';
import { DistritosView } from './pages/configuraciones/DistritosView';
import { OficinasView } from './pages/configuraciones/OficinasView';
import { DistrictDetailView } from './pages/configuraciones/DistrictDetailView';
import { AdministracionUsuariosView } from './pages/configuraciones/seguridad/AdministracionUsuariosView';
export function AppRouter() {
  return <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/tablero" element={<ProtectedRoute>
                <App />
              </ProtectedRoute>} />
          <Route path="/novedades" element={<ProtectedRoute>
                <NovedadesView />
              </ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute>
                <UsuariosView />
              </ProtectedRoute>} />
          <Route path="/usuarios/carga-masiva" element={<ProtectedRoute>
                <UsuariosView />
              </ProtectedRoute>} />
          <Route path="/reportes" element={<ProtectedRoute>
                <ReportesView />
              </ProtectedRoute>} />
          <Route path="/configuraciones/asignacion-territorial" element={<ProtectedRoute>
                <AsignacionTerritorialView />
              </ProtectedRoute>} />
          <Route path="/configuraciones/asignacion-territorial/distritos" element={<ProtectedRoute>
                <DistritosView />
              </ProtectedRoute>} />
          <Route path="/configuraciones/asignacion-territorial/distritos/:id" element={<ProtectedRoute>
                <DistrictDetailView />
              </ProtectedRoute>} />
          <Route path="/configuraciones/asignacion-territorial/oficinas" element={<ProtectedRoute>
                <OficinasView />
              </ProtectedRoute>} />
          <Route path="/configuraciones/seguridad/administracion-usuarios" element={<ProtectedRoute>
                <AdministracionUsuariosView />
              </ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>;
}