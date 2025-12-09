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
  const { data: distributionByRegionData, isError: isErrorDistribution } = useDistributionByRegion();
  const { data: TotalsClientData, isError: isErrorTotals } = useReportsTotalsClient({});

  const isLoadingAny =
    isLoadingGlobal ||
    distributionByRegionData === undefined ||
    TotalsClientData === undefined;

  const isErrorAny = isErrorGlobal || isErrorDistribution || isErrorTotals;

  if (isLoadingAny && !isErrorAny) {
    return <CustomFullScreenLoading />;
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="p-4 lg:p-8">
          <PermissionGuard allowedPermissions={['dashboard_view_reports']} user={user} show_dialog={false}>
            {/* <SummaryCards
              data={TotalsClientData ?? []}
            /> */}
            <SummaryCards data={TotalsClientData ?? {
              totals: {
                grand_total: 0,
                total_top_client: 0,
                total_others: 0,
                total_available: 0
              },
              top_client_name: 'N/A'
            }} />

          </PermissionGuard>
          <PermissionGuard allowedPermissions={['dashboard_view_charts']} user={user} show_dialog={false}>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Visión Global
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PieChartCard
                  data={globalDistributionByRegionData ?? []}
                />
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
              </div>
            </div>

            <RegionalDistribution
              data={distributionByRegionData ?? []}
            />
          </PermissionGuard>
        </main>
      </div>
    </div>
  );
}