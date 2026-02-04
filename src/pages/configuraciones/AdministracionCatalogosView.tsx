import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { DashboardHeader } from '../../components/DashboardHeader';
import { PermissionGuard } from '../../components/PermissionGuard';
import { Briefcase, UserCheck, ArrowRight, Info, Building2, ShieldPlus } from 'lucide-react';
import { useAuthStore } from '@/auth/store/auth.store';
import { useTerritorialCounters } from '@/hooks/useTerritorialCounters';
// TODO: Create and use real hooks
// import { usePositionTypesCounters } from '@/hooks/usePositionTypesCounters';
// import { useStatusEmployeesCounters } from '@/hooks/useStatusEmployeesCounters';

export function AdministracionCatalogosView() {
  const { user } = useAuthStore();

  const { businessesTotal, positionsTypesTotal, statusEmployeeTotal, incidentsCatalogTotal } = useTerritorialCounters();
  // TODO: Replace with real data from hooks
  const positionTypesTotal = positionsTypesTotal; // Mock data
  const statusEmployeesTotal = statusEmployeeTotal; // Mock 
  const empresasActivas = businessesTotal;
  const incidentsCatalogTotalCount = incidentsCatalogTotal;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <PermissionGuard allowedRoles={['Super Administrador', 'Administrador']} user={user}>
          <main className="p-4 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Administración de Catálogos
              </h1>
              <p className="text-gray-600">
                Gestiona los catálogos de Clientes, Cargos/Puestos y Estatus del Colaborador.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => navigate('/configuraciones/catalogos/clientes')}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Building2 className="text-emerald-600" size={28} />
                  </div>
                  <ArrowRight
                    className="text-gray-400 group-hover:text-emerald-600 transition-colors"
                    size={24}
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Clientes
                </h2>

                <p className="text-gray-600 mb-4">
                  Gestiona de los clientes y su configuración
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {empresasActivas} clientes activos
                  </span>
                  <span className="text-emerald-600 font-medium text-sm group-hover:underline">
                    Ver todos →
                  </span>
                </div>
              </button>
              <button
                onClick={() => navigate('/configuraciones/catalogos/cargos')}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-purple-600" size={28} />
                  </div>
                  <ArrowRight
                    className="text-gray-400 group-hover:text-purple-600 transition-colors"
                    size={24}
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Cargos / Puestos
                </h2>

                <p className="text-gray-600 mb-4">
                  Gestiona los cargos y puestos de los colaboradores.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {positionTypesTotal} cargos activos
                  </span>
                  <span className="text-purple-600 font-medium text-sm group-hover:underline">
                    Ver todos →
                  </span>
                </div>
              </button>

              <button
                onClick={() => navigate('/configuraciones/catalogos/estatus-empleado')}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="text-teal-600" size={28} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-teal-600 transition-colors" size={24} />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Estatus del Colaborador
                </h2>

                <p className="text-gray-600 mb-4">
                  Administra los diferentes estatus de los colaboradores.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {statusEmployeesTotal} estatus activos
                  </span>
                  <span className="text-teal-600 font-medium text-sm group-hover:underline">
                    Ver todos →
                  </span>
                </div>
              </button>
              <button
                onClick={() => navigate('/configuraciones/catalogos/novedades')}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center">
                    <ShieldPlus className="text-rose-600" size={28} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-rose-600 transition-colors" size={24} />
                </div>


                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Novedades
                </h2>

                <p className="text-gray-600 mb-4">
                  Administra los diferentes novedades registradas en el sistema.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {incidentsCatalogTotalCount} novedades activas
                  </span>
                  <span className="text-rose-600 font-medium text-sm group-hover:underline">
                    Ver todos →
                  </span>
                </div>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Catálogos del Sistema
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Estos catálogos son fundamentales para la correcta clasificación y gestión de la información de los colaboradores dentro del sistema.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </PermissionGuard>
      </div>
    </div>
  );
}
