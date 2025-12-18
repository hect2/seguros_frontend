import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { SummaryCards } from './components/SummaryCards';
import { PieChartCard } from './components/PieChartCard';
import { BarChartCard } from './components/BarChartCard';
import { RegionalDistribution } from './components/RegionalDistribution';
import { useGlobalDistributionByRegion } from './modules/reports/hooks/useGlobalDistributionByRegion';
import { useDistributionByRegion } from './modules/reports/hooks/useDistributionByRegion';
import { CustomFullScreenLoading } from './components/custom/CustomFullScreenLoading';
import { useReportsTotalsClient } from './modules/reports/hooks/useReportsTotalsClient';
import { PermissionGuard } from './components/PermissionGuard';
import { useAuthStore } from './auth/store/auth.store';
import { useReportsDailySummary } from './modules/reports/hooks/useReportsDailySummary';
import { DailySummaryCards } from './components/DailySummaryCards';
export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuthStore();
  const filters = {
    "report_type": "totals_by_client",
    // "format": "",
    "office_id": null,
    "start_date": "",
    "end_date": ""
  }
  const { data: globalDistributionByRegionData, isLoading: isLoadingGlobal, isError: isErrorGlobal } = useGlobalDistributionByRegion();
  const { data: distributionByRegionData, isLoading: isLoadingDistribution, isError: isErrorDistribution } = useDistributionByRegion();
  const { data: TotalsClientData, isLoading: isLoadingTotals, isError: isErrorTotals } = useReportsTotalsClient({});
  const { data: dailySummaryData, isLoading: isLoadingDailySummary, isError: isErrorDailySummary } = useReportsDailySummary({});


  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-4 lg:p-8">
          <PermissionGuard allowedPermissions={['dashboard_view_reports']} user={user} show_dialog={false}>

            {/* Reporte de Resumen de Cliente */}
            {isLoadingTotals && <CustomFullScreenLoading />}
            {!isLoadingTotals && TotalsClientData && (
              <SummaryCards data={TotalsClientData ?? {
                totals: {
                  grand_total: 0,
                  total_top_client: 0,
                  total_others: 0,
                  total_available: 0
                },
                top_client_name: 'N/A'
              }} />
            )}


            <br />
            {/* Reporte de Resumen Diario de Estados */}
            {isLoadingDailySummary && <CustomFullScreenLoading />}
            {!isLoadingDailySummary && dailySummaryData && (
              <DailySummaryCards data={dailySummaryData} />
            )}

            {/* Errores */}
            {(isErrorDailySummary || isErrorTotals) && (
              <div className="text-red-600 text-sm">
                ⚠️ Ocurrió un error al cargar uno o más reportes.
              </div>
            )}
          </PermissionGuard>
          <PermissionGuard allowedPermissions={['dashboard_view_charts']} user={user} show_dialog={false}>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Visión Global
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reporte de Distribucion Global por Region */}
                {isLoadingGlobal && <CustomFullScreenLoading />}
                {!isLoadingGlobal && globalDistributionByRegionData && (
                  <PieChartCard
                    data={globalDistributionByRegionData ?? []}
                  />
                )}


                {/* Reporte de Clientes Totales */}
                {isLoadingTotals && <CustomFullScreenLoading />}
                {!isLoadingTotals && TotalsClientData && (
                  <BarChartCard
                    data={TotalsClientData ?? {
                      totals: {
                        grand_total: 0,
                        total_top_client: 0,
                        total_others: 0,
                        total_available: 0,
                        total_reserve: 0,
                      },
                      top_client_name: 'N/A'
                    }}
                  />
                )}

              </div>
            </div>

            {/* Reporte de Distribucion por Region */}
            {isLoadingDistribution && <CustomFullScreenLoading />}
            {!isLoadingDistribution && distributionByRegionData && (
              <RegionalDistribution
                data={distributionByRegionData ?? []}
              />
            )}

            {/* Errores */}
            {(isErrorDistribution || isErrorGlobal || isErrorTotals) && (
              <div className="text-red-600 text-sm">
                ⚠️ Ocurrió un error al cargar uno o más reportes.
              </div>
            )}
          </PermissionGuard>
        </main>
      </div>
    </div>
  );
}