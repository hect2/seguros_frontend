import { DigesspResponse } from '@/modules/reports/interfaces/digessp-certifications-response';
import React from 'react';

interface TableResumenOficinaProps {
  data: DigesspResponse,
}

const getBadgeColor = (porcentaje: number) => {
  if (porcentaje >= 30) return 'bg-red-100 text-red-700';
  if (porcentaje >= 10) return 'bg-orange-100 text-orange-700';
  return 'bg-green-100 text-green-700';
};

export function TableDigessp({ data }: TableResumenOficinaProps) {

  const porcentajeTotal = data?.totals.total > 0 ? (data?.totals.total_vigentes / data?.totals.total * 100).toFixed(1) : '0.0';

  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      CERTIFICADOS DIGESSP
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3 px-3 font-semibold text-gray-700">OFICINA</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">TOTAL</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">VIGENTES</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">%</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">VENCIDOS</th>
            <th className="text-center py-3 px-2 font-semibold text-gray-700">SIN CERT.</th>
          </tr>
        </thead>
        <tbody>
          {data?.offices.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">No hay datos para mostrar.</td>
            </tr>
          ) : (
            data?.offices.map((row, index) => <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-3 font-medium text-gray-800">{row.code}</td>
              <td className="py-3 px-2 text-center text-gray-700">{row.total}</td>
              <td className="py-3 px-2 text-center font-semibold text-gray-800">{row.vigentes}</td>
              <td className="py-3 px-2 text-center">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(row.percentage)}`}>
                  {row.percentage.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-2 text-center text-gray-700">{row.vencidos}</td>
              <td className="py-3 px-2 text-center text-gray-700">{row.sin_certificado}</td>
            </tr>)
          )}
          {data?.offices.length > 0 && (
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <td className="py-3 px-3 text-gray-800">TOTAL</td>
              <td className="py-3 px-2 text-center text-gray-800">{data?.totals.total}</td>
              <td className="py-3 px-2 text-center text-gray-800">{data?.totals.total_vigentes}</td>
              <td className="py-3 px-2 text-center">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(Number(porcentajeTotal))}`}>
                  {porcentajeTotal}%
                </span>
              </td>
              <td className="py-3 px-2 text-center text-gray-800">{data?.totals.total_vencidos}</td>
              <td className="py-3 px-2 text-center text-gray-800">{data?.totals.total_sin_certificado}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>;
}