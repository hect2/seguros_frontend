import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { getCriticalityColor } from '@/utils/criticality';
import { TypesListResponse } from '@/interfaces/types.lists.response';
import { CriticalsListResponse } from '@/interfaces/criticals.lists.response';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';
import { useAuthStore } from '@/auth/store/auth.store';

interface NovedadesFiltersProps {
  onApply?: (filters: any) => void;
  onClear?: () => void;
  districts: DistrictsListResponse,
  types: TypesListResponse,
  criticals: CriticalsListResponse,
}

export function NovedadesFilters({
  onApply,
  onClear,
  districts,
  types,
  criticals,
}: NovedadesFiltersProps) {
  // ESTADOS DE CADA FILTRO
  const { user: userProfile } = useAuthStore();
  const [type, setType] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedCriticality, setSelectedCriticality] = useState<string[]>([]);

  const toggleCriticality = (value: string) => {
    setSelectedCriticality(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
  };
  const handleApplyFilters = () => {
    const filters = {
      type,
      district,
      user,
      dateFrom,
      dateTo,
      criticality: selectedCriticality
    };
    console.log('Filtros Aplicados', filters)
    onApply?.(filters);
  };

  const handleClear = () => {
    setType('');
    setDistrict('');
    setUser('');
    setDateFrom('');
    setDateTo('');
    setSelectedCriticality([]);

    onClear?.();
  };

  const districtIds = Array.isArray(userProfile?.district)
    ? userProfile.district
    : JSON.parse(userProfile?.district || "[]");

  return <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Novedad
        </label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
        >
          <option value="">Todos</option>
          {types?.data.map(type =>
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Districto
        </label>
        <select
          value={district}
          onChange={e => setDistrict(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
        >
          <option>Todas</option>
          {districts?.data
            .filter(d =>
              districtIds.length === 0
                ? true
                : districtIds.includes(d.id)
            )
            .map(district =>
              <option key={district.id} value={district.id}>
                {district.code}
              </option>
            )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usuario Responsable
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={user}
            onChange={e => setUser(e.target.value)}
            placeholder="Buscar usuario..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rango de Fechas
        </label>
        <div className="flex space-x-2">
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent"
          />
        </div>
      </div>
    </div>
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Criticidad
      </label>
      <div className="flex flex-wrap gap-2">
        {criticals?.data.map(crit =>
          <button key={crit.slug} onClick={() => toggleCriticality(crit.slug)}
            className={`px-4 py-2 rounded-full border transition-all ${selectedCriticality.includes(crit.slug) ? getCriticalityColor(crit.slug) : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
            {crit.name}
          </button>
        )}
      </div>
    </div>
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