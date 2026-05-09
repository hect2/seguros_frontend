import React, { useState } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { DiceRegionCard } from './DiceRegionCard';
import { DinorRegionCard } from './DinorRegionCard';
import { DisoRegionCard } from './DisoRegionCard';
import { DinocRegionCard } from './DinocRegionCard';
import { DiorRegionCard } from './DiorRegionCard';
import { DisosurRegionCard } from './DisosurRegionCard';
import { DistributionByRegionResponse } from '@/modules/reports/interfaces/distribution-by-region';

interface RegionalDistributionProps {
  data: DistributionByRegionResponse;
}

export function RegionalDistribution({ data }: RegionalDistributionProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const grandTotal = data.districts.reduce((acc, curr) => acc + curr.total, 0);

  return <div className="mt-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Distribución por Región
      </h2>
      <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
        <button
          onClick={() => setViewMode('cards')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'cards'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid size={16} />
          <span>Tarjetas</span>
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'table'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TableIcon size={16} />
          <span>Tabla</span>
        </button>
      </div>
    </div>

    {viewMode === 'cards' ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {data.districts
          .filter(item => item.total >= 1)
          .map((item, index) => (
            <DisoRegionCard
              key={index}  
              data={item}
            />
          ))
        }
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">Resumen Detallado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Región
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Oficinas (% del Distrito)
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total (% del General)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.districts
                .filter(item => item.total >= 1)
                .map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
          <div className="flex flex-col gap-1">
            {item.offices.map((office, idx) => (
              <div key={idx} className="flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs border border-gray-200">
                <span className="font-medium mr-1">{office.code}:</span>
                {office.total}
                <span className="ml-1 text-[10px] text-gray-500 font-normal">
                  ({((office.total / item.total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-[#cf2e2e]">{item.total}</span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {((item.total / grandTotal) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900" colSpan={2}>
                  Total General
                </td>
                <td className="px-6 py-4 text-sm text-right text-[#cf2e2e]">
                  <div className="flex flex-col items-end">
                    <span>{grandTotal}</span>
                    <span className="text-[11px] text-gray-500 font-medium">100%</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )}
  </div>;
}