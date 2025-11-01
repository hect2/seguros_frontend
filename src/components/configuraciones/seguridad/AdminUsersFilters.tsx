import React, { useState } from 'react';
import { Search } from 'lucide-react';
interface AdminUsersFiltersProps {
  filters: {
    searchTerm: string;
    rol: string;
    estado: string;
    distrito: string;
    oficina: string;
  };
  onApply: (filters: any) => void;
  onClear: () => void;
}
const distritos = ['DINOC', 'ADMINISTRATIVO', 'DICE', 'DINOR', 'DIOR', 'DISO', 'DISO SUR', 'STAFF', 'ACADEMIA'];
export function AdminUsersFilters({
  filters,
  onApply,
  onClear
}: AdminUsersFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedDistritos, setSelectedDistritos] = useState<string[]>([]);
  const handleDistritoToggle = (distrito: string) => {
    setSelectedDistritos(prev => {
      if (prev.includes(distrito)) {
        return prev.filter(d => d !== distrito);
      }
      return [...prev, distrito];
    });
  };
  const handleApply = () => {
    onApply({
      ...localFilters,
      distrito: selectedDistritos.length > 0 ? selectedDistritos.join(',') : 'all'
    });
  };
  const handleClear = () => {
    setLocalFilters({
      searchTerm: '',
      rol: 'all',
      estado: 'all',
      distrito: 'all',
      oficina: 'all'
    });
    setSelectedDistritos([]);
    onClear();
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
          <input type="text" placeholder="Buscar por nombre, DPI o email..." value={localFilters.searchTerm} onChange={e => setLocalFilters({
          ...localFilters,
          searchTerm: e.target.value
        })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm" />
        </div>
      </div>
      {/* Rol and Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rol
          </label>
          <select value={localFilters.rol} onChange={e => setLocalFilters({
          ...localFilters,
          rol: e.target.value
        })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
            <option value="all">Todos</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Operador">Operador</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select value={localFilters.estado} onChange={e => setLocalFilters({
          ...localFilters,
          estado: e.target.value
        })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
            <option value="all">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="En revisión">En revisión</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>
      {/* Distrito Chips */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Distrito
        </label>
        <div className="flex flex-wrap gap-2">
          {distritos.map(distrito => <button key={distrito} onClick={() => handleDistritoToggle(distrito)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDistritos.includes(distrito) ? 'bg-[#cf2e2e] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {distrito}
            </button>)}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button onClick={handleApply} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors">
          Aplicar Filtros
        </button>
        <button onClick={handleClear} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Limpiar
        </button>
      </div>
    </div>;
}