import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Download, Eye } from 'lucide-react';
import { ValidationResult, ValidationSummary } from '@/utils/bulkUploadHelpers';

interface ValidationReportProps {
  results: ValidationResult[];
  summary: ValidationSummary;
  onBack: () => void;
  onConfirm: () => void;
  isImporting: boolean;
}

const statusIcons = {
  ok: <CheckCircle size={14} />,
  warning: <AlertTriangle size={14} />,
  error: <XCircle size={14} />,
};

const statusColors = {
  ok: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

function ResultRow({ result }: { result: ValidationResult }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className={`hover:bg-gray-50 ${result.status === 'error' ? 'bg-red-50' : result.status === 'warning' ? 'bg-yellow-50' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.row}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-3 py-1 ${statusColors[result.status]} rounded-full text-xs font-medium flex items-center space-x-1 w-fit`}>
            {statusIcons[result.status]}
            <span>{result.status.charAt(0).toUpperCase() + result.status.slice(1)}</span>
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{result.data.nombre_completo}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.data.dpi}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{result.data.email}</td>
        <td className="px-6 py-4 text-sm text-gray-700">
          <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline flex items-center space-x-1">
            <Eye size={16} />
            <span>Ver</span>
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            {result.created && (
                <span className={`px-3 py-1 ${result.created.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-full text-xs font-medium`}>
                    {result.created.success ? 'Success' : 'Failed'}
                </span>
            )}
        </td>
      </tr>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Mensajes de Validación - Fila {result.row}</h3>
            <ul className="list-disc list-inside space-y-2">
              {result.messages.map((msg, index) => (
                <li key={index} className="text-gray-700">{msg}</li>
              ))}
            </ul>
            {result.created && (
                <div className='mt-4'>
                    <h4 className="text-md font-bold text-gray-900 mb-2">Resultado de la importación</h4>
                    <p className={result.created.success ? 'text-green-700' : 'text-red-700'}>{result.created.message}</p>
                </div>
            )}
            <div className="mt-6 text-right">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ValidationReport({ results, summary, onBack, onConfirm, isImporting }: ValidationReportProps) {
    const hasErrors = summary.errors > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Summary Cards */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Válidos</p>
          <p className="text-2xl font-bold text-green-900">{summary.ok}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 mb-1">Advertencias</p>
          <p className="text-2xl font-bold text-yellow-900">{summary.warnings}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 mb-1">Errores</p>
          <p className="text-2xl font-bold text-red-900">{summary.errors}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Resultados de Validación</h3>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fila</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">DPI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mensajes</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Importado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result, idx) => (
                <ResultRow key={idx} result={result} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-900">
          <p>Los registros con errores no se importarán. Puede continuar para importar solo los registros válidos.</p>
        </div>
      )}
    </div>
  );
}