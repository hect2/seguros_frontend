import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { useIncidentCatalogList } from '@/seguros/hooks/useIncidentCatalogList';

interface Props {
  title: string;
  setTitle: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function NovedadesChartFilters({
  title,
  setTitle,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onApply,
  onClear
}: Props) {
  const { data: incidentCatalogList } = useIncidentCatalogList();
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Título
          </label>
          <select
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          >
            <option value="">Todas</option>
            {incidentCatalogList?.data.map(inc => (
              <option key={inc.id} value={inc.name}>
                {inc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Fechas
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
              />
            </div>
            <span className="text-gray-500">a</span>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onApply} 
            className="bg-[#cf2e2e] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b52626] transition-colors whitespace-nowrap"
          >
            Filtrar Gráficas
          </button>
          <button 
            onClick={onClear} 
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
