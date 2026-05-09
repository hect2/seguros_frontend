import React, { useState } from 'react';
import { ArrowUpDown, UserPlus, UserMinus } from 'lucide-react';
import { HiresLowsSummaryResponse } from '../interfaces/hires-lows-summary-response';

interface Props {
  data: HiresLowsSummaryResponse;
}

export function TableResumenAltasBajas({ data }: Props) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data?.offices;

    const { key, direction } = sortConfig;

    return [...data.offices].sort((a: any, b: any) => {
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

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Resumen de Altas y Bajas
        </h2>
        <div className="text-sm text-gray-500 font-medium">
          {data.date_range.start_date} - {data.date_range.end_date}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                <button 
                  onClick={() => handleSort('name')} 
                  className="flex items-center space-x-1 hover:text-[#cf2e2e] transition-colors"
                >
                  <span>OFICINA</span>
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus size={16} className="text-green-600" />
                  <span>ALTAS</span>
                </div>
              </th>
              <th className="text-center py-4 px-6 font-semibold text-gray-700 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <UserMinus size={16} className="text-red-600" />
                  <span>BAJAS</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData?.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-800">
                  {row.name}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    row.hires_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {row.hires_count}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    row.lows_count > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {row.lows_count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-200">
            <tr>
              <td className="py-4 px-6 text-gray-900">TOTAL GENERAL</td>
              <td className="py-4 px-6 text-center text-green-700 text-lg">
                {data.totals.total_hires}
              </td>
              <td className="py-4 px-6 text-center text-red-700 text-lg">
                {data.totals.total_lows}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
