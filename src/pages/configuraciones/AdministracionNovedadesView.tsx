import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { DashboardHeader } from '../../components/DashboardHeader';
import { PermissionGuard } from '../../components/PermissionGuard';
import { ShieldPlus, ArrowRight, Layers, Type } from 'lucide-react';
import { useAuthStore } from '@/auth/store/auth.store';

export function AdministracionNovedadesView() {
  const { user } = useAuthStore();
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
              <div className="flex items-center space-x-3 mb-2">
                <button 
                  onClick={() => navigate('/configuraciones/catalogos')}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  Catálogos
                </button>
                <span className="text-gray-400">/</span>
                <h1 className="text-3xl font-bold text-gray-800">
                  Novedades
                </h1>
              </div>
              <p className="text-gray-600">
                Gestiona los Tipos y Títulos de Novedades del sistema.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <button
                onClick={() => navigate('/configuraciones/catalogos/novedades/tipos')}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Layers className="text-indigo-600" size={28} />
                  </div>
                  <ArrowRight
                    className="text-gray-400 group-hover:text-indigo-600 transition-colors"
                    size={24}
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Tipos de Novedades
                </h2>

                <p className="text-gray-600 mb-4">
                  Define las categorías o tipos principales de novedades.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Administrar tipos
                  </span>
                  <span className="text-indigo-600 font-medium text-sm group-hover:underline">
                    Ver todos →
                  </span>
                </div>
              </button>

              <button
                onClick={() => navigate('/configuraciones/catalogos/novedades/titulos')}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Type className="text-orange-600" size={28} />
                  </div>
                  <ArrowRight
                    className="text-gray-400 group-hover:text-orange-600 transition-colors"
                    size={24}
                  />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Títulos de Novedades
                </h2>

                <p className="text-gray-600 mb-4">
                  Pre-configura los nombres de novedades específicos.
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Administrar títulos
                  </span>
                  <span className="text-orange-600 font-medium text-sm group-hover:underline">
                    Ver todos →
                  </span>
                </div>
              </button>
            </div>
            
          </main>
        </PermissionGuard>
      </div>
    </div>
  );
}
