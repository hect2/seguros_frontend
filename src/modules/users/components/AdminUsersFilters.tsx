import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { RolesListResponse } from '@/interfaces/roles.lists.response';
import { StatusEmployeesListResponse } from '@/interfaces/status_employees.lists.response';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';

interface AdminUsersFiltersProps {
  onApply: (filters: any) => void;
  onClear: () => void;
  roles: RolesListResponse,
  status_employees: StatusEmployeesListResponse,
  districts: DistrictsListResponse,
}

export function AdminUsersFilters({
  onApply,
  onClear,
  roles,
  status_employees,
  districts,
}: AdminUsersFiltersProps) {
  // ESTADOS DE CADA FILTRO

  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [rol_id, setRolId] = useState<string>('');
  const [selectedDistritos, setSelectedDistritos] = useState<number[]>([]);

  const handleDistritoToggle = (value: number) => {
    setSelectedDistritos(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
  };

  const handleApplyFilters = () => {
    const filters = {
      search,
      status,
      rol_id,
      district_ids: selectedDistritos,
    };
    console.log('Filtros Aplicados', filters)
    onApply?.(filters);
  };

  const handleClear = () => {
    setSearch('');
    setStatus('');
    setRolId('');
    setSelectedDistritos([]);

    onClear?.();
  };
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>
    {/* Search */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Búsqueda
      </label>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" placeholder="Buscar por nombre, DPI o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm" />
      </div>
    </div>
    {/* Rol and Estado */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select
          value={rol_id}
          onChange={e => setRolId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
          <option value="">Todos</option>
          {roles?.data.map(rol =>
            <option key={rol.id} value={rol.id}>
              {rol.name}
            </option>
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
          <option value="">Todos</option>
          {status_employees?.data.map(status =>
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          )}
        </select>
      </div>
    </div>
    {/* Distrito Chips */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Distrito
      </label>
      <div className="flex flex-wrap gap-2">
        {districts?.data.map(distrito => 
          <button 
            key={distrito.id} 
            onClick={() => handleDistritoToggle(distrito.id)} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDistritos.includes(distrito.id) ? 'bg-[#cf2e2e] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
          {distrito.code}
        </button>)}
      </div>
    </div>
    {/* Action Buttons */}
    <div className="flex space-x-3 mt-6">
      <button onClick={handleApplyFilters} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors">
        Aplicar Filtros
      </button>
      <button onClick={handleClear} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
        Limpiar
      </button>
    </div>
  </div>;
}