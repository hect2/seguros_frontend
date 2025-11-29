import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { DashboardHeader } from '../../components/DashboardHeader';
import { PermissionGuard } from '../../components/PermissionGuard';
import { MapPin, Building2, Building, ArrowRight, Info } from 'lucide-react';
import { useTerritorialCounters } from '@/hooks/useTerritorialCounters';

export function AsignacionTerritorialView() {
  const { businessesTotal, districtsTotal, officesTotal } =  useTerritorialCounters();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const distritosActivos = districtsTotal;
  const oficinasActivas = officesTotal;
  const empresasActivas = businessesTotal;

  return <PermissionGuard allowedRoles={['Super Admin', 'Admin']}>
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Asignación Territorial
            </h1>
            <p className="text-gray-600">
              Administra la estructura organizacional de distritos y oficinas
            </p>
          </div>
          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => navigate('/configuraciones/asignacion-territorial/empresas')}
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
                Empresas
              </h2>

              <p className="text-gray-600 mb-4">
                Gestiona las empresas y su configuración
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {empresasActivas} empresas activos
                </span>
                <span className="text-emerald-600 font-medium text-sm group-hover:underline">
                  Ver todos →
                </span>
              </div>
            </button>
            <button onClick={() => navigate('/configuraciones/asignacion-territorial/distritos')} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="text-blue-600" size={28} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#cf2e2e] transition-colors" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Distritos
              </h2>
              <p className="text-gray-600 mb-4">
                Gestiona los distritos administrativos y su configuración
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {distritosActivos} distritos activos
                </span>
                <span className="text-[#cf2e2e] font-medium text-sm group-hover:underline">
                  Ver todos →
                </span>
              </div>
            </button>
            <button onClick={() => navigate('/configuraciones/asignacion-territorial/oficinas')} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Building className="text-orange-600" size={28} />
                </div>
                <ArrowRight className="text-gray-400 group-hover:text-[#cf2e2e] transition-colors" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Oficinas
              </h2>
              <p className="text-gray-600 mb-4">
                Administra oficinas y su asignación a distritos
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {oficinasActivas} oficinas activas
                </span>
                <span className="text-[#cf2e2e] font-medium text-sm group-hover:underline">
                  Ver todas →
                </span>
              </div>
            </button>
          </div>
          {/* Information Panel */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Estructura Organizacional
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Los distritos representan divisiones administrativas
                  principales, mientras que las oficinas son unidades
                  operativas asignadas a cada distrito. Esta estructura
                  permite una gestión territorial eficiente de los recursos y
                  personal.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </PermissionGuard>;
}