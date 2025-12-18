import React, { useState } from 'react';
import { Sidebar } from '../../../components/Sidebar';
import { DashboardHeader } from '../../../components/DashboardHeader';
import { ReportFilters } from '../components/ReportFilters';
import { TableResumenOficina } from '../components/TableResumenOficina';
import { TableDigessp } from '../../../components/reportes/TableDigessp';
import { TableTotalesCliente } from '../../../components/reportes/TableTotalesCliente';
import { PNCModalExport } from '../../../components/reportes/PNCModalExport';
import { useOfficesList } from '@/seguros/hooks/useOfficesList';
import { useReportsDigessp } from '../hooks/useReportsDigessp';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreenLoading';
import { useReportsTotalsClient } from '../hooks/useReportsTotalsClient';
import { useReportsSummaryByOffice } from '../hooks/useReportsSummaryByOffice';
import { PermissionGuard } from '@/components/PermissionGuard';
import { useAuthStore } from '@/auth/store/auth.store';

export function ReportesView() {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPNCModalOpen, setIsPNCModalOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const { data: officesList } = useOfficesList({
    user_id: user?.id,
  });
  const { data: DiggespData, isLoading: isLoadingDiggesp, isError: isErrorDiggesp, } = useReportsDigessp(filters);
  const { data: TotalsClientData, isLoading: isLoadingTotalsClient, isError: isErrorTotalsClient, } = useReportsTotalsClient(filters);
  const { data: SummaryByOfficeData, isLoading: isLoadingSummaryByOffice, isError: isErrorSummaryByOffice, } = useReportsSummaryByOffice(filters);

  // if (isLoading) {
  //   return <CustomFullScreenLoading />
  // }

  return <div className="flex min-h-screen w-full bg-gray-50">
    <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
    <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <PermissionGuard allowedPermissions={['reports_view']} user={user}>
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reportes del Sistema
            </h1>
            <p className="text-gray-600">
              Genera y exporta reportes consolidados del sistema
            </p>
          </div>
          <ReportFilters
            offices={officesList}
            onApply={(f) => setFilters(f)}
            onClear={() => setFilters({})}
          />
          {/* <ExportBar onPNCDownload={() => setIsPNCModalOpen(true)} /> */}
          <div className="space-y-8">
            {/* Resumen por oficina */}
            {isLoadingSummaryByOffice && <CustomFullScreenLoading />}
            {!isLoadingSummaryByOffice && SummaryByOfficeData && (
              <TableResumenOficina data={SummaryByOfficeData} />
            )}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* DIGESSP */}
              {isLoadingDiggesp && <CustomFullScreenLoading />}
              {!isLoadingDiggesp && DiggespData && (
                <TableDigessp data={DiggespData} />
              )}
              {/* Totales Cliente */}
              {isLoadingTotalsClient && <CustomFullScreenLoading />}
              {!isLoadingTotalsClient && TotalsClientData && (
                <TableTotalesCliente data={TotalsClientData} />
              )}
            </div>
          </div>
          {/* Errores */}
          {(isErrorDiggesp || isErrorTotalsClient || isErrorSummaryByOffice) && (
            <div className="text-red-600 text-sm">
              ⚠️ Ocurrió un error al cargar uno o más reportes.
            </div>
          )}
        </main>
      </PermissionGuard>
    </div>
    <PNCModalExport isOpen={isPNCModalOpen} onClose={() => setIsPNCModalOpen(false)} filters={filters} />
  </div>;
}