import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Distrito } from '../../utils/mockData';
interface DistrictModalProps {
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  distrito: Distrito | null;
  onSubmit: (data: Partial<Distrito>) => void;
}
export function DistrictModal({
  mode,
  isOpen,
  onClose,
  distrito,
  onSubmit
}: DistrictModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });
  useEffect(() => {
    if (distrito && mode === 'edit') {
      setFormData({
        nombre: distrito.nombre,
        codigo: distrito.codigo,
        descripcion: distrito.descripcion || '',
        estado: distrito.estado
      });
    } else {
      setFormData({
        nombre: '',
        codigo: '',
        descripcion: '',
        estado: 'Activo'
      });
    }
  }, [distrito, mode, isOpen]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Crear Nuevo Distrito' : 'Editar Distrito'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código del Distrito *
              </label>
              <input type="text" required value={formData.codigo} onChange={e => setFormData({
              ...formData,
              codigo: e.target.value
            })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Ej: DINOC" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Distrito *
              </label>
              <input type="text" required value={formData.nombre} onChange={e => setFormData({
              ...formData,
              nombre: e.target.value
            })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Ej: Distrito Norte Central" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea value={formData.descripcion} onChange={e => setFormData({
            ...formData,
            descripcion: e.target.value
          })} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Descripción del distrito..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select value={formData.estado} onChange={e => setFormData({
            ...formData,
            estado: e.target.value as 'Activo' | 'Inactivo'
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
              {mode === 'create' ? 'Crear Distrito' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>;
}