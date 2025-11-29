import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Oficina, mockDistritos, mockUsuarios } from '../../../utils/mockData';
interface OfficeModalProps {
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  oficina: Oficina | null;
  presetDistrictId?: string;
  onSubmit: (data: Partial<Oficina>) => void;
}
export function OfficeModal({
  mode,
  isOpen,
  onClose,
  oficina,
  presetDistrictId,
  onSubmit
}: OfficeModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    distrito: presetDistrictId || '',
    direccion: '',
    telefono: '',
    usuarioAsignado: '',
    estado: 'Activo' as 'Activo' | 'Inactivo',
    observaciones: ''
  });
  useEffect(() => {
    if (oficina && mode === 'edit') {
      setFormData({
        nombre: oficina.nombre,
        codigo: oficina.codigo,
        distrito: oficina.distrito,
        direccion: oficina.direccion || '',
        telefono: oficina.telefono || '',
        usuarioAsignado: oficina.usuarioAsignado || '',
        estado: oficina.estado,
        observaciones: oficina.observaciones || ''
      });
    } else {
      setFormData({
        nombre: '',
        codigo: '',
        distrito: presetDistrictId || '',
        direccion: '',
        telefono: '',
        usuarioAsignado: '',
        estado: 'Activo',
        observaciones: ''
      });
    }
  }, [oficina, mode, isOpen, presetDistrictId]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Crear Nueva Oficina' : 'Editar Oficina'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Oficina *
            </label>
            <input type="text" required value={formData.nombre} onChange={e => setFormData({
            ...formData,
            nombre: e.target.value
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Ej: OTR COBÁN" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distrito *
            </label>
            <select required value={formData.distrito} onChange={e => setFormData({
            ...formData,
            distrito: e.target.value
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
              <option value="">Seleccionar distrito</option>
              {mockDistritos.filter(d => d.estado === 'Activo').map(distrito => <option key={distrito.id} value={distrito.codigo}>
                    {distrito.nombre}
                  </option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario Asignado (Opcional)
            </label>
            <select value={formData.usuarioAsignado} onChange={e => setFormData({
            ...formData,
            usuarioAsignado: e.target.value
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
              <option value="">Sin asignar</option>
              {mockUsuarios.map(usuario => <option key={usuario.id} value={usuario.nombre}>
                  {usuario.nombre} ({usuario.cargo})
                </option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código (Opcional)
            </label>
            <input type="text" value={formData.codigo} onChange={e => setFormData({
            ...formData,
            codigo: e.target.value
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Ej: COBAN" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección (Opcional)
            </label>
            <input type="text" value={formData.direccion} onChange={e => setFormData({
            ...formData,
            direccion: e.target.value
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Dirección de la oficina" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono (Opcional)
            </label>
            <input type="tel" value={formData.telefono} onChange={e => setFormData({
            ...formData,
            telefono: e.target.value
          })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="+502 2222-1111" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({
              ...formData,
              estado: 'Activo'
            })} className={`py-2.5 rounded-lg font-medium transition-colors ${formData.estado === 'Activo' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Activo
              </button>
              <button type="button" onClick={() => setFormData({
              ...formData,
              estado: 'Inactivo'
            })} className={`py-2.5 rounded-lg font-medium transition-colors ${formData.estado === 'Inactivo' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Inactivo
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (Opcional)
            </label>
            <textarea value={formData.observaciones} onChange={e => setFormData({
            ...formData,
            observaciones: e.target.value
          })} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent resize-none" placeholder="Notas adicionales sobre la oficina..." />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
              {mode === 'create' ? 'Crear Oficina' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>;
}