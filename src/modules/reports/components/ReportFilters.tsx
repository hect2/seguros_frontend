import React, { useState } from 'react';
import { OfficesListResponse } from '@/interfaces/offices.lists.response';

interface ReportFiltersProps {
  onApply?: (filters: any) => void;
  onClear?: () => void;
  offices: OfficesListResponse;
}

export function ReportFilters({ onApply, onClear, offices }: ReportFiltersProps) {
  const [type, setType] = useState<string>('');
  const [office, setOffice] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const handleApplyFilters = () => {
    const filters = {
      report_type: type,
      office_id: office,
      start_date: dateFrom,
      end_date: dateTo,
    };
    console.log('Filtros Aplicados', filters)
    onApply?.(filters);
  };

  const handleClear = () => {
    setType('');
    setOffice('');
    setDateFrom('');
    setDateTo('');

    onClear?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Oficina */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Oficina</label>
          <select
            value={office}
            onChange={e => setOffice(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          >
            <option value="">Todas</option>
            {offices?.data.map(office => (
              <option key={office.id} value={office.id}>
                {office.code}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          />
        </div>

        {/* Tipo de Reporte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="summary_by_office">Resumen por Oficina</option>
            <option value="digessp_certifications">Certificados DIGESSP</option>
            <option value="totals_by_client">Totales por Cliente</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleApplyFilters}
          className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
