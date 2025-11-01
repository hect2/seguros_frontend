import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Download, ArrowLeft } from 'lucide-react';
import { ValidationResult, ValidationSummary, generateErrorCSV, downloadCSV } from '../../../utils/bulkUploadHelpers';
interface ValidationReportProps {
  results: ValidationResult[];
  summary: ValidationSummary;
  onBack: () => void;
  onConfirm: () => void;
}
export function ValidationReport({
  results,
  summary,
  onBack,
  onConfirm
}: ValidationReportProps) {
  const handleDownloadErrors = () => {
    const errorCSV = generateErrorCSV(results);
    if (errorCSV) {
      downloadCSV(errorCSV, 'errores_importacion.csv');
    }
  };
  const hasErrors = summary.errors > 0;
  return <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Válidos</p>
              <p className="text-2xl font-bold text-green-900">{summary.ok}</p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 mb-1">Advertencias</p>
              <p className="text-2xl font-bold text-yellow-900">
                {summary.warnings}
              </p>
            </div>
            <AlertTriangle size={32} className="text-yellow-600" />
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Errores</p>
              <p className="text-2xl font-bold text-red-900">
                {summary.errors}
              </p>
            </div>
            <XCircle size={32} className="text-red-600" />
          </div>
        </div>
      </div>
      {/* Actions */}
      {hasErrors && <div className="flex justify-end">
          <button onClick={handleDownloadErrors} className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span>Descargar errores (.csv)</span>
          </button>
        </div>}
      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            Resultados de Validación
          </h3>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Fila
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  DPI
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Mensajes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result, idx) => <tr key={idx} className={`hover:bg-gray-50 ${result.status === 'error' ? 'bg-red-50' : result.status === 'warning' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {result.row}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.status === 'ok' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center space-x-1 w-fit">
                        <CheckCircle size={14} />
                        <span>OK</span>
                      </span>}
                    {result.status === 'warning' && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center space-x-1 w-fit">
                        <AlertTriangle size={14} />
                        <span>Advertencia</span>
                      </span>}
                    {result.status === 'error' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center space-x-1 w-fit">
                        <XCircle size={14} />
                        <span>Error</span>
                      </span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {result.data.nombre_completo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {result.data.dpi}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {result.data.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <ul className="list-disc list-inside space-y-1">
                      {result.messages.map((msg, msgIdx) => <li key={msgIdx}>{msg}</li>)}
                    </ul>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Warning/Error Messages */}
      {hasErrors && <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900 font-medium mb-2">
            ⚠️ Se encontraron {summary.errors} registro(s) con errores
          </p>
          <p className="text-sm text-red-800">
            Los registros con errores no se importarán. Puedes descargar el
            archivo de errores, corregirlos y volver a intentar, o continuar
            importando solo los registros válidos.
          </p>
        </div>}
      {!hasErrors && summary.warnings > 0 && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900 font-medium mb-2">
            ⚠️ Se encontraron {summary.warnings} registro(s) con advertencias
          </p>
          <p className="text-sm text-yellow-800">
            Los registros con advertencias se importarán, pero revisa los
            mensajes para asegurarte de que todo esté correcto.
          </p>
        </div>}
      {!hasErrors && summary.warnings === 0 && <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900 font-medium">
            ✅ Todos los registros son válidos y están listos para importarse
          </p>
        </div>}
    </div>;
}