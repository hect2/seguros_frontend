import React, { useState } from 'react';
import { FileDown, FileSpreadsheet, FileText, Printer } from 'lucide-react';
interface ExportBarProps {
  onPNCDownload: () => void;
}
export function ExportBar({
  onPNCDownload
}: ExportBarProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const handleExport = async (type: string) => {
    setLoading(type);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(null);
    alert(`Exportando a ${type.toUpperCase()}...`);
  };
  return <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
      <button onClick={onPNCDownload} className="bg-[#cf2e2e] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#b52626] transition-colors flex items-center space-x-2 shadow-md">
        <FileDown size={18} />
        <span>Descargar reporte PNC</span>
      </button>
      <button onClick={() => handleExport('csv')} disabled={loading === 'csv'} className="bg-white text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-300 disabled:opacity-50">
        {loading === 'csv' ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <FileText size={18} />}
        <span>CSV</span>
      </button>
      <button onClick={() => handleExport('xlsx')} disabled={loading === 'xlsx'} className="bg-white text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-300 disabled:opacity-50">
        {loading === 'xlsx' ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <FileSpreadsheet size={18} />}
        <span>XLSX</span>
      </button>
      <button onClick={() => handleExport('pdf')} disabled={loading === 'pdf'} className="bg-white text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-300 disabled:opacity-50">
        {loading === 'pdf' ? <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <FileText size={18} />}
        <span>PDF</span>
      </button>
      <button onClick={() => window.print()} className="bg-white text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 border border-gray-300">
        <Printer size={18} />
        <span>Imprimir</span>
      </button>
    </div>;
}