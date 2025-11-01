import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
const mockData = [{
  oficina: 'STAFF',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 21,
  capacitacion: 0,
  zona: 'gris'
}, {
  oficina: 'ACADEMIA',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 9,
  capacitacion: 0,
  zona: 'gris'
}, {
  oficina: 'AREA NORTE',
  guardiasTemporales: 1,
  suspendidos: 1,
  totalAsegurados: 161,
  capacitacion: 0,
  zona: 'roja'
}, {
  oficina: 'AREA SUR',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 63,
  capacitacion: 0,
  zona: 'naranja'
}, {
  oficina: 'OTR SALAMÁ',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 60,
  capacitacion: 0,
  zona: 'naranja'
}, {
  oficina: 'OTR SACATEPÉQUEZ',
  guardiasTemporales: 0,
  suspendidos: 1,
  totalAsegurados: 112,
  capacitacion: 0,
  zona: 'naranja'
}, {
  oficina: 'OTR PETÉN',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 120,
  capacitacion: 0,
  zona: 'azul'
}, {
  oficina: 'OTR IZABAL',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 113,
  capacitacion: 0,
  zona: 'azul'
}, {
  oficina: 'OTR ZACAPA',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 95,
  capacitacion: 0,
  zona: 'verde'
}, {
  oficina: 'OTR CHIQUIMULA',
  guardiasTemporales: 0,
  suspendidos: 0,
  totalAsegurados: 92,
  capacitacion: 0,
  zona: 'verde'
}];
const zonaColors: Record<string, string> = {
  roja: 'bg-red-50',
  naranja: 'bg-orange-50',
  azul: 'bg-blue-50',
  verde: 'bg-green-50',
  amarilla: 'bg-yellow-50',
  gris: 'bg-gray-50'
};
export function TableResumenOficina() {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const totales = mockData.reduce((acc, row) => ({
    guardiasTemporales: acc.guardiasTemporales + row.guardiasTemporales,
    suspendidos: acc.suspendidos + row.suspendidos,
    totalAsegurados: acc.totalAsegurados + row.totalAsegurados,
    capacitacion: acc.capacitacion + row.capacitacion
  }), {
    guardiasTemporales: 0,
    suspendidos: 0,
    totalAsegurados: 0,
    capacitacion: 0
  });
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({
      key,
      direction
    });
  };
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Resumen por Oficina
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                <button onClick={() => handleSort('oficina')} className="flex items-center space-x-1 hover:text-[#cf2e2e]">
                  <span>OFICINA</span>
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                GUARDIAS TEMPORALES
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                SUSPENDIDOS
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                TOTAL DE ASEGURADOS
              </th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">
                CAPACITACIÓN
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${zonaColors[row.zona]}`}>
                <td className="py-3 px-4 font-medium text-gray-800">
                  {row.oficina}
                </td>
                <td className="py-3 px-4 text-center text-gray-700">
                  {row.guardiasTemporales}
                </td>
                <td className="py-3 px-4 text-center text-gray-700">
                  {row.suspendidos}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {row.totalAsegurados}
                </td>
                <td className="py-3 px-4 text-center text-gray-700">
                  {row.capacitacion}
                </td>
              </tr>)}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <td className="py-3 px-4 text-gray-800">TOTAL</td>
              <td className="py-3 px-4 text-center text-gray-800">
                {totales.guardiasTemporales}
              </td>
              <td className="py-3 px-4 text-center text-gray-800">
                {totales.suspendidos}
              </td>
              <td className="py-3 px-4 text-center text-gray-800">
                {totales.totalAsegurados}
              </td>
              <td className="py-3 px-4 text-center text-gray-800">
                {totales.capacitacion}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>;
}