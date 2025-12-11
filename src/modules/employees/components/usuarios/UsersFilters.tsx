import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { OfficesListResponse } from '@/interfaces/offices.lists.response';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';
import { StatusEmployeesListResponse } from '@/interfaces/status_employees.lists.response';

interface EmployeesFiltersProps {
  onApply?: (filters: any) => void;
  onClear?: () => void;
  offices: OfficesListResponse,
  districts: DistrictsListResponse,
  status_employees: StatusEmployeesListResponse,
}

export function UsersFilters({
  onApply,
  onClear,
  offices,
  districts,
  status_employees
}: EmployeesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [office, setOffice] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleApplyFilters = () => {
    const filters = {
      search: searchTerm,
      office_id: office,
      district_id: district,
      status_id: status,
    };
    console.log('Filtros Aplicados', filters)
    onApply?.(filters);
  };

  const handleClear = () => {
    setSearchTerm('');
    setOffice('');
    setDistrict('');
    setStatus('');

    onClear?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o DPI..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm" />
        </div>
        {/* Oficina Filter */}
        <select
          value={office}
          onChange={e => setOffice(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm"
        >
          <option>Todas</option>
          {offices?.data.map(office =>
            <option key={office.id} value={office.id}>
              {office.code}
            </option>
          )}
        </select>
        {/* Distrito Filter */}
        <select
          value={district}
          onChange={e => setDistrict(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm"
        >
          <option value="">Todos</option>
          {districts?.data.map(status =>
            <option key={status.id} value={status.id}>
              {status.code}
            </option>
          )}
        </select>
        {/* Estado Filter */}
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm"
        >
          <option value="">Todos</option>
          {status_employees?.data.map(status =>
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          )}
        </select>
      </div>
      <div className="flex space-x-3 mt-6">
        <button onClick={handleApplyFilters} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors">
          Aplicar Filtros
        </button>
        <button onClick={handleClear} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Limpiar
        </button>
      </div>
    </div>
  );
}