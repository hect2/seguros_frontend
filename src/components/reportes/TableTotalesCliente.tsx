import React from 'react';
const mockData = [{
  oficina: 'AREA NORTE',
  banrural: 111,
  otros: 57,
  disponible: 1,
  reserva: 9,
  total: 178
}, {
  oficina: 'AREA SUR',
  banrural: 35,
  otros: 19,
  disponible: 0,
  reserva: 6,
  total: 60
}, {
  oficina: 'OTR SALAMÁ',
  banrural: 38,
  otros: 15,
  disponible: 1,
  reserva: 4,
  total: 58
}, {
  oficina: 'OTR SACATEPÉQUEZ',
  banrural: 54,
  otros: 40,
  disponible: 2,
  reserva: 13,
  total: 109
}, {
  oficina: 'OTR PETÉN',
  banrural: 78,
  otros: 28,
  disponible: 3,
  reserva: 11,
  total: 120
}, {
  oficina: 'OTR IZABAL',
  banrural: 71,
  otros: 30,
  disponible: 2,
  reserva: 10,
  total: 113
}, {
  oficina: 'OTR ZACAPA',
  banrural: 58,
  otros: 25,
  disponible: 2,
  reserva: 10,
  total: 95
}, {
  oficina: 'OTR CHIQUIMULA',
  banrural: 63,
  otros: 27,
  disponible: 2,
  reserva: 10,
  total: 102
}];
export function TableTotalesCliente() {
  const totales = mockData.reduce((acc, row) => ({
    banrural: acc.banrural + row.banrural,
    otros: acc.otros + row.otros,
    disponible: acc.disponible + row.disponible,
    reserva: acc.reserva + row.reserva,
    total: acc.total + row.total
  }), {
    banrural: 0,
    otros: 0,
    disponible: 0,
    reserva: 0,
    total: 0
  });
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Totales por Cliente
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-700">
                OFICINA
              </th>
              <th className="text-center py-3 px-2 font-semibold text-blue-700">
                BANRURAL
              </th>
              <th className="text-center py-3 px-2 font-semibold text-orange-700">
                OTROS
              </th>
              <th className="text-center py-3 px-2 font-semibold text-green-700">
                DISPONIBLE
              </th>
              <th className="text-center py-3 px-2 font-semibold text-yellow-700">
                RESERVA
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-800">
                  {row.oficina}
                </td>
                <td className="py-3 px-2 text-center bg-blue-50 text-blue-700 font-semibold">
                  {row.banrural}
                </td>
                <td className="py-3 px-2 text-center bg-orange-50 text-orange-700 font-semibold">
                  {row.otros}
                </td>
                <td className="py-3 px-2 text-center bg-green-50 text-green-700 font-semibold">
                  {row.disponible}
                </td>
                <td className="py-3 px-2 text-center bg-yellow-50 text-yellow-700 font-semibold">
                  {row.reserva}
                </td>
                <td className="py-3 px-2 text-center bg-gray-100 font-bold text-gray-800">
                  {row.total}
                </td>
              </tr>)}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <td className="py-3 px-3 text-gray-800">TOTAL</td>
              <td className="py-3 px-2 text-center bg-blue-100 text-blue-800">
                {totales.banrural}
              </td>
              <td className="py-3 px-2 text-center bg-orange-100 text-orange-800">
                {totales.otros}
              </td>
              <td className="py-3 px-2 text-center bg-green-100 text-green-800">
                {totales.disponible}
              </td>
              <td className="py-3 px-2 text-center bg-yellow-100 text-yellow-800">
                {totales.reserva}
              </td>
              <td className="py-3 px-2 text-center bg-gray-200 text-gray-900">
                {totales.total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>;
}