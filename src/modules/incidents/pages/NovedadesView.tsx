import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { NovedadesSummaryCards } from '../components/NovedadesSummaryCards';
import { NovedadesFilters } from '../components/NovedadesFilters';
import { NovedadesTable } from '../components/NovedadesTable';
import { CreateNovedadModal } from '../components/CreateNovedadModal';
import { useOfficesList } from '@/seguros/hooks/useOfficesList';
import { useTypesList } from '@/seguros/hooks/useTypesList';
import { useCriticalsList } from '@/seguros/hooks/useCriticalsList';
import { Incident } from '@/modules/incidents/interfaces/incident';
import { toast } from 'sonner';
import { useIncidentReports } from '../hooks/useIncidentReports';
import { useIncidents } from '../hooks/useIncidents';
import { DetalleNovedadModal } from '../components/DetalleNovedadModal';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useAuthStore } from '@/auth/store/auth.store';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};


export function NovedadesView() {

  const [filters, setFilters] = useState<any>({});
  const { data } = useIncidentReports();
  const { data: incidents, mutation } = useIncidents(filters);
  const { data: officesList } = useOfficesList();
  const { data: typesList } = useTypesList();
  const { data: criticalsList } = useCriticalsList();
  const { user } = useAuthStore();

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
  const handleViewDetail = (id: number) => {
    setSelectedNovedad(id);
  };

  const handleSubmit = async (incidentLike: Partial<Incident>) => {
    await mutation.mutateAsync(incidentLike, {
      onSuccess: (data) => {
        console.log('Novedad created:', data);
        setIsCreateModalOpen(false);
        toast.success('Novedad creada con éxito', {
          position: 'top-right',
        });
      }
    });
  }

  return <div className="flex min-h-screen w-full bg-gray-50">
    <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
    <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <PermissionGuard allowedPermissions={['incidents_view']} user={user}>
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Gestión de Novedades
            </h1>
            <p className="text-gray-600 mt-1">Notificaciones y seguimiento</p>
          </div>
          <NovedadesSummaryCards data={data} />
          <div className="mt-8">
            <NovedadesFilters
              onApply={(f) => setFilters(f)}
              onClear={() => setFilters({})}
              offices={officesList}
              types={typesList}
              criticals={criticalsList}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <PermissionGuard allowedPermissions={['incidents_create']} user={user} show_dialog={false}>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2">
              <span className="text-xl">+</span>
              <span>Crear Novedad</span>
            </button>
            </PermissionGuard>
          </div>
          <div className="mt-6">
            {/* <NovedadesTable onViewDetail={handleViewDetail} /> */}
            <NovedadesTable
              data={incidents}
              filters={filters}
              onViewDetail={handleViewDetail}
            />
          </div>
        </main>
      </PermissionGuard>
    </div>
    {isCreateModalOpen && <CreateNovedadModal
      onClose={() => setIsCreateModalOpen(false)}
      offices={officesList}
      types={typesList}
      criticals={criticalsList}
      onSubmit={handleSubmit}
    />}
    {selectedNovedad && <DetalleNovedadModal id={selectedNovedad} onClose={() => setSelectedNovedad(null)} />}
  </div>;
}