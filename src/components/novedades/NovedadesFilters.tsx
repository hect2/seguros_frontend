import React, { useState } from 'react';
import { Search } from 'lucide-react';
interface NovedadesFiltersProps {
  onApply?: (filters: any) => void;
  onClear?: () => void;
}
export function NovedadesFilters({
  onApply,
  onClear
}: NovedadesFiltersProps) {
  const [selectedCriticality, setSelectedCriticality] = useState<string[]>([]);
  const criticalities = [{
    label: 'Alta',
    value: 'alta',
    color: 'bg-red-100 text-red-700 border-red-300'
  }, {
    label: 'Media',
    value: 'media',
    color: 'bg-orange-100 text-orange-700 border-orange-300'
  }, {
    label: 'Baja',
    value: 'baja',
    color: 'bg-green-100 text-green-700 border-green-300'
  }];
  const toggleCriticality = (value: string) => {
    setSelectedCriticality(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
  };
  return <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Novedad
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
            <option>Todos</option>
            <option>Importantes</option>
            <option>Negativas</option>
            <option>Supervisiones</option>
            <option>Permisos</option>
            <option>Faltando</option>
            <option>Servicios Especiales</option>
            <option>Vacaciones</option>
            <option>Rutinas</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Oficina
          </label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
            <option>Todas</option>
            <option>DICE</option>
            <option>DINOR</option>
            <option>DISO</option>
            <option>DINOC</option>
            <option>DIOR</option>
            <option>DISOSUR</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuario Responsable
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar usuario..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Fechas
          </label>
          <div className="flex space-x-2">
            <input type="date" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
            <input type="date" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Criticidad
        </label>
        <div className="flex flex-wrap gap-2">
          {criticalities.map(crit => <button key={crit.value} onClick={() => toggleCriticality(crit.value)} className={`px-4 py-2 rounded-full border transition-all ${selectedCriticality.includes(crit.value) ? crit.color : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
              {crit.label}
            </button>)}
        </div>
      </div>
      <div className="flex space-x-3 mt-6">
        <button onClick={() => onApply?.({})} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors">
          Aplicar Filtros
        </button>
        <button onClick={() => {
        setSelectedCriticality([]);
        onClear?.();
      }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Limpiar
        </button>
      </div>
    </div>;
}