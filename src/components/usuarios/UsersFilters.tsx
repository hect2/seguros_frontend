import React, { useState } from 'react';
import { Search } from 'lucide-react';
export function UsersFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [oficina, setOficina] = useState('all');
  const [distrito, setDistrito] = useState('all');
  const [estado, setEstado] = useState('all');
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o DPI..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm" />
        </div>
        {/* Oficina Filter */}
        <select value={oficina} onChange={e => setOficina(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm">
          <option value="all">Todas las Oficinas</option>
          <option value="AREA NORTE">AREA NORTE</option>
          <option value="AREA SUR">AREA SUR</option>
          <option value="OTR SALAMÁ">OTR SALAMÁ</option>
          <option value="OTR SACATEPÉQUEZ">OTR SACATEPÉQUEZ</option>
        </select>
        {/* Distrito Filter */}
        <select value={distrito} onChange={e => setDistrito(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm">
          <option value="all">Todos los Distritos</option>
          <option value="DICE">DICE</option>
          <option value="DINOR">DINOR</option>
          <option value="DISO">DISO</option>
          <option value="DINOC">DINOC</option>
        </select>
        {/* Estado Filter */}
        <select value={estado} onChange={e => setEstado(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent text-sm">
          <option value="all">Todos los Estados</option>
          <option value="Activo">Activo</option>
          <option value="En revisión">En revisión</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
    </div>;
}