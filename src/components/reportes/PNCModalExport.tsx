import React, { useState } from 'react';
import { X, FileDown } from 'lucide-react';
interface PNCModalExportProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    oficina: string;
    fechaInicio: string;
    fechaFin: string;
    tipo: string;
  };
}
export function PNCModalExport({
  isOpen,
  onClose,
  filters
}: PNCModalExportProps) {
  const [formato, setFormato] = useState<'pdf' | 'xlsx'>('pdf');
  const [responsable, setResponsable] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleGenerate = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert(`Generando reporte PNC en formato ${formato.toUpperCase()}...\nResponsable: ${responsable || 'No especificado'}`);
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#cf2e2e] rounded-lg flex items-center justify-center">
              <FileDown className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Descargar Reporte PNC
              </h2>
              <p className="text-sm text-gray-600">
                Reporte consolidado para la Policía Nacional Civil
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Información del Reporte
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Resumen por Oficina</li>
              <li>• Certificados DIGESSP</li>
              <li>• Totales por Cliente</li>
              <li>• Formato institucional con logo y encabezado</li>
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Exportación
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setFormato('pdf')} className={`p-4 rounded-lg border-2 transition-all ${formato === 'pdf' ? 'border-[#cf2e2e] bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <FileDown className={`mx-auto mb-2 ${formato === 'pdf' ? 'text-[#cf2e2e]' : 'text-gray-600'}`} size={24} />
                <p className={`font-medium ${formato === 'pdf' ? 'text-[#cf2e2e]' : 'text-gray-700'}`}>
                  PDF
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formato A4 horizontal
                </p>
              </button>
              <button onClick={() => setFormato('xlsx')} className={`p-4 rounded-lg border-2 transition-all ${formato === 'xlsx' ? 'border-[#cf2e2e] bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}>
                <FileDown className={`mx-auto mb-2 ${formato === 'xlsx' ? 'text-[#cf2e2e]' : 'text-gray-600'}`} size={24} />
                <p className={`font-medium ${formato === 'xlsx' ? 'text-[#cf2e2e]' : 'text-gray-700'}`}>
                  XLSX
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Hoja de cálculo Excel
                </p>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Fechas
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={filters.fechaInicio} readOnly className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50" />
              <input type="date" value={filters.fechaFin} readOnly className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable / Firma (Opcional)
            </label>
            <input type="text" value={responsable} onChange={e => setResponsable(e.target.value)} placeholder="Nombre del responsable del reporte" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
          </div>
        </div>
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end space-x-3">
          <button onClick={onClose} disabled={loading} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={handleGenerate} disabled={loading} className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2 disabled:opacity-50">
            {loading ? <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generando...</span>
              </> : <>
                <FileDown size={18} />
                <span>Generar Reporte</span>
              </>}
          </button>
        </div>
      </div>
    </div>;
}