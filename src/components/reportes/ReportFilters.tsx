import React, { useState } from 'react';
interface ReportFiltersProps {
  filters: {
    oficina: string;
    fechaInicio: string;
    fechaFin: string;
    tipo: string;
  };
  onApply: (filters: any) => void;
  onClear: () => void;
}
export function ReportFilters({
  filters,
  onApply,
  onClear
}: ReportFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const handleApply = () => {
    onApply(localFilters);
  };
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Oficina
          </label>
          <select value={localFilters.oficina} onChange={e => setLocalFilters({
          ...localFilters,
          oficina: e.target.value
        })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
            <option value="all">Todas</option>
            <option value="STAFF">STAFF</option>
            <option value="ACADEMIA">ACADEMIA</option>
            <option value="AREA NORTE">AREA NORTE</option>
            <option value="AREA SUR">AREA SUR</option>
            <option value="OTR SALAMÁ">OTR SALAMÁ</option>
            <option value="OTR SACATEPÉQUEZ">OTR SACATEPÉQUEZ</option>
            <option value="OTR PETÉN">OTR PETÉN</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input type="date" value={localFilters.fechaInicio} onChange={e => setLocalFilters({
          ...localFilters,
          fechaInicio: e.target.value
        })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input type="date" value={localFilters.fechaFin} onChange={e => setLocalFilters({
          ...localFilters,
          fechaFin: e.target.value
        })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Reporte
          </label>
          <select value={localFilters.tipo} onChange={e => setLocalFilters({
          ...localFilters,
          tipo: e.target.value
        })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
            <option value="all">Todos</option>
            <option value="resumen">Resumen por Oficina</option>
            <option value="certificados">Certificados DIGESSP</option>
            <option value="clientes">Totales por Cliente</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-3 mt-6">
        <button onClick={handleApply} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors">
          Aplicar Filtros
        </button>
        <button onClick={() => {
        onClear();
        setLocalFilters({
          oficina: 'all',
          fechaInicio: '',
          fechaFin: '',
          tipo: 'all'
        });
      }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Limpiar
        </button>
      </div>
    </div>;
}