import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SummaryByOfficeResponse } from '@/modules/reports/interfaces/summary-by-office-response';

interface TableResumenOficinaProps {
  data: SummaryByOfficeResponse,
}

const zonaColors: Record<string, string> = {
  roja: 'bg-red-50',
  naranja: 'bg-orange-50',
  azul: 'bg-blue-50',
  verde: 'bg-green-50',
  amarilla: 'bg-yellow-50',
  gris: 'bg-gray-50'
};

const getZona = (row: {
  temporary_guards_count: number;
  suspended_count: number;
  total_insured_count: number;
}): string => {
  const { temporary_guards_count, suspended_count, total_insured_count } = row;

  if (total_insured_count === 0) return 'gris';

  const problemRatio = (temporary_guards_count + suspended_count) / total_insured_count;

  return problemRatio >= 0.5
    ? 'roja'
    : problemRatio >= 0.2
      ? 'naranja'
      : problemRatio >= 0.1
        ? 'amarilla'
        : problemRatio > 0
          ? 'verde'
          : 'azul';
};


export function TableResumenOficina({ data }: TableResumenOficinaProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data?.offices;

    const { key, direction } = sortConfig;

    return [...data.offices].sort((a: any, b: any) => {
      // Asumimos que los valores son string o number
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data?.offices, sortConfig]);

  const handleSort = (key: keyof SummaryByOfficeResponse['offices'][0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
              <button onClick={() => handleSort('code')} className="flex items-center space-x-1 hover:text-[#cf2e2e]">
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
          {sortedData?.map((row, index) => <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${zonaColors[getZona(row)]}`}>
            <td className="py-3 px-4 font-medium text-gray-800">
              {row.name}
            </td>
            <td className="py-3 px-4 text-center text-gray-700">
              {row.temporary_guards_count}
            </td>
            <td className="py-3 px-4 text-center text-gray-700">
              {row.suspended_count}
            </td>
            <td className="py-3 px-4 text-center font-semibold text-gray-800">
              {row.total_insured_count}
            </td>
            <td className="py-3 px-4 text-center text-gray-700">
              {row.training_count}
            </td>
          </tr>)}
          <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <td className="py-3 px-4 text-gray-800">TOTAL</td>
            <td className="py-3 px-4 text-center text-gray-800">
              {data?.totals.total_temporary_guards}
            </td>
            <td className="py-3 px-4 text-center text-gray-800">
              {data?.totals.total_temporary_guards}
            </td>
            <td className="py-3 px-4 text-center text-gray-800">
              {data?.totals.total_insured}
            </td>
            <td className="py-3 px-4 text-center text-gray-800">
              {data?.totals.total_training}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>;
}