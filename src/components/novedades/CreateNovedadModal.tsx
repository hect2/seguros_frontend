import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
interface CreateNovedadModalProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}
export function CreateNovedadModal({
  onClose,
  onSubmit
}: CreateNovedadModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    oficina: '',
    criticidad: '',
    descripcion: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Crear Nueva Novedad
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={formData.titulo} onChange={e => setFormData({
            ...formData,
            titulo: e.target.value
          })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" placeholder="Ingrese el título de la novedad" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select required value={formData.tipo} onChange={e => setFormData({
              ...formData,
              tipo: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                <option value="">Seleccione un tipo</option>
                <option>Importantes</option>
                <option>Negativas</option>
                <option>Supervisiones</option>
                <option>Permisos</option>
                <option>Faltando</option>
                <option>Servicios Especiales</option>
                <option>Vacaciones</option>
                <option>Rutinas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oficina <span className="text-red-500">*</span>
              </label>
              <select required value={formData.oficina} onChange={e => setFormData({
              ...formData,
              oficina: e.target.value
            })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                <option value="">Seleccione una oficina</option>
                <option>DICE</option>
                <option>DINOR</option>
                <option>DISO</option>
                <option>DINOC</option>
                <option>DIOR</option>
                <option>DISOSUR</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criticidad <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-3">
              {['Alta', 'Media', 'Baja'].map(crit => <button key={crit} type="button" onClick={() => setFormData({
              ...formData,
              criticidad: crit
            })} className={`flex-1 py-2 rounded-lg border transition-all ${formData.criticidad === crit ? crit === 'Alta' ? 'bg-red-100 text-red-700 border-red-300' : crit === 'Media' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                  {crit}
                </button>)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea required value={formData.descripcion} onChange={e => setFormData({
            ...formData,
            descripcion: e.target.value
          })} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent resize-none" placeholder="Describa la novedad en detalle" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjuntos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#cf2e2e] transition-colors cursor-pointer">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-600">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg font-medium hover:bg-[#b52626] transition-colors">
              Crear Novedad
            </button>
          </div>
        </form>
      </div>
    </div>;
}