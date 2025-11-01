import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { ReportFilters } from '../components/reportes/ReportFilters';
import { ExportBar } from '../components/reportes/ExportBar';
import { TableResumenOficina } from '../components/reportes/TableResumenOficina';
import { TableDigessp } from '../components/reportes/TableDigessp';
import { TableTotalesCliente } from '../components/reportes/TableTotalesCliente';
import { PNCModalExport } from '../components/reportes/PNCModalExport';
export function ReportesView() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPNCModalOpen, setIsPNCModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    oficina: 'all',
    fechaInicio: '',
    fechaFin: '',
    tipo: 'all'
  });
  return <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reportes del Sistema
            </h1>
            <p className="text-gray-600">
              Genera y exporta reportes consolidados del sistema
            </p>
          </div>
          <ReportFilters filters={filters} onApply={setFilters} onClear={() => setFilters({
          oficina: 'all',
          fechaInicio: '',
          fechaFin: '',
          tipo: 'all'
        })} />
          <ExportBar onPNCDownload={() => setIsPNCModalOpen(true)} />
          <div className="space-y-8">
            <TableResumenOficina />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TableDigessp />
              <TableTotalesCliente />
            </div>
          </div>
        </main>
      </div>
      <PNCModalExport isOpen={isPNCModalOpen} onClose={() => setIsPNCModalOpen(false)} filters={filters} />
    </div>;
}