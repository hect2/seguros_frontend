import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { BulkUser } from '../../../utils/bulkUploadHelpers';
interface ColumnMappingStepProps {
  fileColumns: string[];
  previewData: any[];
  onMappingChange: (mapping: Record<string, string>) => void;
  onValidate: () => void;
}
const REQUIRED_FIELDS = [{
  key: 'nombre_completo',
  label: 'Nombre Completo'
}, {
  key: 'dpi',
  label: 'DPI'
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'rol',
  label: 'Rol'
}, {
  key: 'distrito',
  label: 'Distrito'
}, {
  key: 'oficina',
  label: 'Oficina'
}];
const OPTIONAL_FIELDS = [{
  key: 'cargo_administrativo',
  label: 'Cargo Administrativo'
}, {
  key: 'cargo_operativo',
  label: 'Cargo Operativo'
}, {
  key: 'telefono',
  label: 'Teléfono'
}, {
  key: 'sueldo_inicial',
  label: 'Sueldo Inicial'
}, {
  key: 'bonificaciones',
  label: 'Bonificaciones'
}, {
  key: 'estado',
  label: 'Estado'
}];
export function ColumnMappingStep({
  fileColumns,
  previewData,
  onMappingChange,
  onValidate
}: ColumnMappingStepProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  // Auto-detect columns
  useEffect(() => {
    const autoMapping: Record<string, string> = {};
    const allFields = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];
    fileColumns.forEach(col => {
      const normalized = col.toLowerCase().trim();
      const match = allFields.find(field => field.key === normalized || field.label.toLowerCase() === normalized || normalized.includes(field.key));
      if (match) {
        autoMapping[match.key] = col;
      }
    });
    setMapping(autoMapping);
    onMappingChange(autoMapping);
  }, [fileColumns, onMappingChange]);
  const handleMappingChange = (systemField: string, fileColumn: string) => {
    const newMapping = {
      ...mapping,
      [systemField]: fileColumn
    };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };
  const allRequiredMapped = REQUIRED_FIELDS.every(field => mapping[field.key]);
  return <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          Mapea las columnas de tu archivo a los campos del sistema. Los campos
          marcados con <span className="text-red-500">*</span> son obligatorios.
        </p>
      </div>
      {/* Mapping Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Campo del Sistema
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-12">
                  <ArrowRight size={16} className="mx-auto" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Columna del Archivo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {REQUIRED_FIELDS.map(field => <tr key={field.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {field.label}
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ArrowRight size={16} className="text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <select value={mapping[field.key] || ''} onChange={e => handleMappingChange(field.key, e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent ${!mapping[field.key] ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                      <option value="">Seleccionar columna...</option>
                      {fileColumns.map(col => <option key={col} value={col}>
                          {col}
                        </option>)}
                    </select>
                  </td>
                </tr>)}
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-2">
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Campos Opcionales
                  </p>
                </td>
              </tr>
              {OPTIONAL_FIELDS.map(field => <tr key={field.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700">
                      {field.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ArrowRight size={16} className="text-gray-400 mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <select value={mapping[field.key] || ''} onChange={e => handleMappingChange(field.key, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                      <option value="">No mapear</option>
                      {fileColumns.map(col => <option key={col} value={col}>
                          {col}
                        </option>)}
                    </select>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Preview Toggle */}
      <button onClick={() => setShowPreview(!showPreview)} className="flex items-center space-x-2 text-[#cf2e2e] hover:text-[#b52626] font-medium">
        <Eye size={18} />
        <span>{showPreview ? 'Ocultar' : 'Ver'} vista previa de datos</span>
      </button>
      {/* Data Preview */}
      {showPreview && previewData.length > 0 && <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Vista Previa (primeras 10 filas)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                    #
                  </th>
                  {REQUIRED_FIELDS.map(field => <th key={field.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      {field.label}
                    </th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {previewData.slice(0, 10).map((row, idx) => <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                    {REQUIRED_FIELDS.map(field => <td key={field.key} className="px-4 py-3 text-gray-700">
                        {mapping[field.key] ? row[mapping[field.key]] || '-' : '-'}
                      </td>)}
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
      {/* Validation Status */}
      {!allRequiredMapped && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-900">
            ⚠️ Debes mapear todos los campos obligatorios antes de continuar
          </p>
        </div>}
    </div>;
}