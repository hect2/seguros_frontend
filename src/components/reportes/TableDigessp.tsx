import React from 'react';
const mockData = [{
  oficina: 'STAFF',
  total: 24,
  vigentes: 0,
  porcentaje: 0.0,
  vencidos: 7,
  sinCertificar: 17
}, {
  oficina: 'ACADEMIA',
  total: 10,
  vigentes: 0,
  porcentaje: 0.0,
  vencidos: 1,
  sinCertificar: 9
}, {
  oficina: 'AREA NORTE',
  total: 228,
  vigentes: 11,
  porcentaje: 4.8,
  vencidos: 60,
  sinCertificar: 157
}, {
  oficina: 'AREA SUR',
  total: 63,
  vigentes: 18,
  porcentaje: 28.6,
  vencidos: 12,
  sinCertificar: 33
}, {
  oficina: 'OTR SALAMÁ',
  total: 62,
  vigentes: 7,
  porcentaje: 11.3,
  vencidos: 15,
  sinCertificar: 40
}, {
  oficina: 'OTR SACATEPÉQUEZ',
  total: 112,
  vigentes: 23,
  porcentaje: 20.5,
  vencidos: 31,
  sinCertificar: 58
}, {
  oficina: 'OTR PETÉN',
  total: 120,
  vigentes: 45,
  porcentaje: 37.5,
  vencidos: 28,
  sinCertificar: 47
}, {
  oficina: 'OTR IZABAL',
  total: 113,
  vigentes: 12,
  porcentaje: 10.6,
  vencidos: 35,
  sinCertificar: 66
}];
const getBadgeColor = (porcentaje: number) => {
  if (porcentaje >= 30) return 'bg-red-100 text-red-700';
  if (porcentaje >= 10) return 'bg-orange-100 text-orange-700';
  return 'bg-green-100 text-green-700';
};
export function TableDigessp() {
  const totales = mockData.reduce((acc, row) => ({
    total: acc.total + row.total,
    vigentes: acc.vigentes + row.vigentes,
    vencidos: acc.vencidos + row.vencidos,
    sinCertificar: acc.sinCertificar + row.sinCertificar
  }), {
    total: 0,
    vigentes: 0,
    vencidos: 0,
    sinCertificar: 0
  });
  const porcentajeTotal = (totales.vigentes / totales.total * 100).toFixed(1);
  return <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        CERTIFICADOS DIGESSP
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-3 font-semibold text-gray-700">
                OFICINA
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">
                TOTAL
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">
                VIGENTES
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">
                %
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">
                VENCIDOS
              </th>
              <th className="text-center py-3 px-2 font-semibold text-gray-700">
                SIN CERT.
              </th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, index) => <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3 font-medium text-gray-800">
                  {row.oficina}
                </td>
                <td className="py-3 px-2 text-center text-gray-700">
                  {row.total}
                </td>
                <td className="py-3 px-2 text-center font-semibold text-gray-800">
                  {row.vigentes}
                </td>
                <td className="py-3 px-2 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(row.porcentaje)}`}>
                    {row.porcentaje.toFixed(1)}%
                  </span>
                </td>
                <td className="py-3 px-2 text-center text-gray-700">
                  {row.vencidos}
                </td>
                <td className="py-3 px-2 text-center text-gray-700">
                  {row.sinCertificar}
                </td>
              </tr>)}
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <td className="py-3 px-3 text-gray-800">TOTAL</td>
              <td className="py-3 px-2 text-center text-gray-800">
                {totales.total}
              </td>
              <td className="py-3 px-2 text-center text-gray-800">
                {totales.vigentes}
              </td>
              <td className="py-3 px-2 text-center">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getBadgeColor(Number(porcentajeTotal))}`}>
                  {porcentajeTotal}%
                </span>
              </td>
              <td className="py-3 px-2 text-center text-gray-800">
                {totales.vencidos}
              </td>
              <td className="py-3 px-2 text-center text-gray-800">
                {totales.sinCertificar}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>;
}