import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, FileText, Info } from 'lucide-react';
import { downloadCSV, generateCSVTemplate } from '@/utils/bulkUploadHelpers';
// import { generateCSVTemplate, downloadCSV } from '../../../utils/bulkUploadHelpers';
interface UploadStepProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onDownloadTemplate: (format: 'csv' | 'xlsx') => void;
}
export function UploadStep({
  onFileSelect,
  selectedFile,
  onDownloadTemplate
}: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      onFileSelect(file);
    }
  }, [onFileSelect]);
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (<div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2 text-sm text-blue-900">
            <p className="font-medium">Formato de archivo</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>El archivo debe estar en formato CSV (UTF-8) o XLSX</li>
              <li>La primera fila debe contener los encabezados de columna</li>
              <li>Descarga la plantilla para ver el formato correcto</li>
              <li>Máximo 1000 registros por archivo</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Template Downloads */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Descargar Plantilla
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => onDownloadTemplate('csv')} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group">
            <div className="flex items-center space-x-3">
              <FileText size={24} className="text-green-600" />
              <div className="text-left">
                <p className="font-medium text-green-900">Plantilla CSV</p>
                <p className="text-xs text-green-700">Recomendado para Excel</p>
              </div>
            </div>
            <Upload size={18} className="text-green-600 group-hover:translate-y-[-2px] transition-transform" />
          </button>
          <button onClick={() => onDownloadTemplate('xlsx')} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors group">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet size={24} className="text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Plantilla XLSX</p>
                <p className="text-xs text-blue-700">Formato Excel nativo</p>
              </div>
            </div>
            <Upload size={18} className="text-blue-600 group-hover:translate-y-[-2px] transition-transform" />
          </button>
        </div>
      </div>
      {/* File Upload */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Subir Archivo</h3>
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-[#cf2e2e] bg-red-50' : 'border-gray-300 hover:border-[#cf2e2e]'}`}>
          <Upload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-[#cf2e2e]' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Haz clic o arrastra el archivo aquí
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Formatos soportados: CSV, XLSX (máx. 5MB)
          </p>
          <input type="file" id="file-upload" accept=".csv,.xlsx" onChange={handleFileInput} className="hidden" />
          <label htmlFor="file-upload" className="inline-block px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg font-medium hover:bg-[#b52626] transition-colors cursor-pointer">
            Seleccionar archivo
          </label>
        </div>
        {selectedFile && <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText size={24} className="text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-green-700">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button onClick={() => onFileSelect(null as any)} className="text-red-600 hover:text-red-800 font-medium text-sm">
              Eliminar
            </button>
          </div>}
      </div>
    </div>)};