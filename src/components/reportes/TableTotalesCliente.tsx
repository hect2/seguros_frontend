import { TotalsClientResponse } from '@/modules/reports/interfaces/totals-client-response';
import React from 'react';

interface TableTotalesClienteProps {
  data: TotalsClientResponse,
}

export function TableTotalesCliente({ data }: TableTotalesClienteProps) {
  // const totales = data.reduce((acc, row) => ({
  //   banrural: acc.banrural + row.banrural,
  //   otros: acc.otros + row.otros,
  //   disponible: acc.disponible + row.disponible,
  //   reserva: acc.reserva + row.reserva,
  //   total: acc.total + row.total
  // }), { banrural: 0, otros: 0, disponible: 0, reserva: 0, total: 0 });

  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Totales por Cliente
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-700">OFICINA</th>
              <th className="text-center py-3 px-2 font-semibold text-blue-700">{data?.top_client_name.toUpperCase()}</th>
              <th className="text-center py-3 px-2 font-semibold text-orange-700">OTROS</th>
              <th className="text-center py-3 px-2 font-semibold text-green-700">DISPONIBLE</th>
              <th className="text-center py-3 px-2 font-semibold text-yellow-700">RESERVA</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data?.offices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No hay datos para mostrar.</td>
              </tr>
            ) : (
              data?.offices.map((row, index) => <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-800">{row.office_code}</td>
                <td className="py-3 px-2 text-center bg-blue-50 text-blue-700 font-semibold">{row.top_client_count}</td>
                <td className="py-3 px-2 text-center bg-orange-50 text-orange-700 font-semibold">{row.others_count}</td>
                <td className="py-3 px-2 text-center bg-green-50 text-green-700 font-semibold">{row.available_count}</td>
                <td className="py-3 px-2 text-center bg-yellow-50 text-yellow-700 font-semibold">{row.reserve_count}</td>
                <td className="py-3 px-2 text-center bg-gray-100 font-bold text-gray-800">{row.total}</td>
              </tr>)
            )}
            {data?.offices.length > 0 && (
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                <td className="py-3 px-3 text-gray-800">TOTAL</td>
                <td className="py-3 px-2 text-center bg-blue-100 text-blue-800">{data?.totals.total_top_client}</td>
                <td className="py-3 px-2 text-center bg-orange-100 text-orange-800">{data?.totals.total_others}</td>
                <td className="py-3 px-2 text-center bg-green-100 text-green-800">{data?.totals.total_available}</td>
                <td className="py-3 px-2 text-center bg-yellow-100 text-yellow-800">{data?.totals.total_reserve}</td>
                <td className="py-3 px-2 text-center bg-gray-200 text-gray-900">{data?.totals.grand_total ?? 0}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>;
}