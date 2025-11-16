import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { NovedadesSummaryCards } from '../components/novedades/NovedadesSummaryCards';
import { NovedadesFilters } from '../components/novedades/NovedadesFilters';
import { NovedadesTable } from '../components/novedades/NovedadesTable';
import { CreateNovedadModal } from '../components/novedades/CreateNovedadModal';
import { DetalleNovedadModal } from '../components/novedades/DetalleNovedadModal';
import { useIncidentReports } from '@/seguros/hooks/useIncidentReports';
export function NovedadesView() {

  const { data } = useIncidentReports();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNovedad, setSelectedNovedad] = useState<any>(null);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const criticidad = searchParams.get('criticidad');
    if (criticidad === 'Alta') {
      // Pre-select the Alta filter
      console.log('Filtering by criticidad: Alta');
    }
  }, [searchParams]);
  const handleViewDetail = (novedad: any) => {
    setSelectedNovedad(novedad);
  };
  return <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Gestión de Novedades
            </h1>
            <p className="text-gray-600 mt-1">Notificaciones y seguimiento</p>
          </div>
          <NovedadesSummaryCards data={data} />
          <div className="mt-8">
            <NovedadesFilters />
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2">
              <span className="text-xl">+</span>
              <span>Crear Novedad</span>
            </button>
          </div>
          <div className="mt-6">
            <NovedadesTable onViewDetail={handleViewDetail} />
          </div>
        </main>
      </div>
      {isCreateModalOpen && <CreateNovedadModal onClose={() => setIsCreateModalOpen(false)} />}
      {selectedNovedad && <DetalleNovedadModal novedad={selectedNovedad} onClose={() => setSelectedNovedad(null)} />}
    </div>;
}