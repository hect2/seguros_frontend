import React, { useEffect, useState } from 'react';
import { X, Upload } from 'lucide-react';
interface CreateUserModalProps {
  onClose: () => void;
}
type TabType = 'datos-personales' | 'organizacion' | 'documentos' | 'compensacion' | 'tracking';
export function CreateUserModal({
  onClose
}: CreateUserModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('datos-personales');
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    dpi: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    oficina: '',
    distrito: '',
    cargoAdministrativo: '',
    cargoOperativo: '',
    sueldoInicial: '',
    bonificaciones: ''
  });
  const tabs = [{
    id: 'datos-personales',
    label: 'Datos Personales'
  }, {
    id: 'organizacion',
    label: 'Organización'
  }, {
    id: 'documentos',
    label: 'Documentos'
  }, {
    id: 'compensacion',
    label: 'Compensación'
  }, {
    id: 'tracking',
    label: 'Tracking'
  }];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Crear Nuevo Usuario
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-6 overflow-x-auto">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`py-3 px-1 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-[#cf2e2e] border-b-2 border-[#cf2e2e]' : 'text-gray-600 hover:text-gray-800'}`}>
                {tab.label}
              </button>)}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'datos-personales' && <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número DPI <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="dpi" value={formData.dpi} onChange={handleInputChange} maxLength={13} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} placeholder="dd/mm/aaaa" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto del DPI
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#cf2e2e] transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Haz clic o arrastra el archivo aquí
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>}
          {activeTab === 'organizacion' && <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oficina <span className="text-red-500">*</span>
                  </label>
                  <select name="oficina" value={formData.oficina} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                    <option value="">Seleccionar oficina</option>
                    <option value="AREA NORTE">AREA NORTE</option>
                    <option value="AREA SUR">AREA SUR</option>
                    <option value="OTR SALAMÁ">OTR SALAMÁ</option>
                    <option value="OTR SACATEPÉQUEZ">OTR SACATEPÉQUEZ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distrito <span className="text-red-500">*</span>
                  </label>
                  <select name="distrito" value={formData.distrito} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                    <option value="">Seleccionar distrito</option>
                    <option value="DICE">DICE</option>
                    <option value="DINOR">DINOR</option>
                    <option value="DISO">DISO</option>
                    <option value="DINOC">DINOC</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo Administrativo <span className="text-red-500">*</span>
                  </label>
                  <select name="cargoAdministrativo" value={formData.cargoAdministrativo} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                    <option value="">Seleccionar cargo</option>
                    <option value="DIRECTOR DISTRITO">DIRECTOR DISTRITO</option>
                    <option value="JEFE DE ÁREA">JEFE DE ÁREA</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="COORDINADOR">COORDINADOR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo Operativo
                  </label>
                  <select name="cargoOperativo" value={formData.cargoOperativo} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                    <option value="">Seleccionar cargo</option>
                    <option value="DIRECTOR DISTRITO">DIRECTOR DISTRITO</option>
                    <option value="JEFE DE ÁREA">JEFE DE ÁREA</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                    <option value="COORDINADOR">COORDINADOR</option>
                  </select>
                </div>
              </div>
            </div>}
          {activeTab === 'documentos' && <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antecedentes Penales
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#cf2e2e] transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Subir documento</p>
                </div>
                <input type="date" placeholder="Fecha de emisión" className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antecedentes Policiacos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#cf2e2e] transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Subir documento</p>
                </div>
                <input type="date" placeholder="Fecha de emisión" className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones de documentos
                </label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent resize-none" placeholder="Notas adicionales sobre los documentos..." />
              </div>
            </div>}
          {activeTab === 'compensacion' && <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sueldo inicial (GTQ) <span className="text-red-500">*</span>
                </label>
                <input type="number" name="sueldoInicial" value={formData.sueldoInicial} onChange={handleInputChange} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonificaciones (GTQ)
                </label>
                <input type="number" name="bonificaciones" value={formData.bonificaciones} onChange={handleInputChange} min="0" step="0.01" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              {formData.sueldoInicial && <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Total Mensual</p>
                  <p className="text-2xl font-bold text-[#cf2e2e]">
                    Q{' '}
                    {(parseFloat(formData.sueldoInicial || '0') + parseFloat(formData.bonificaciones || '0')).toFixed(2)}
                  </p>
                </div>}
            </div>}
          {activeTab === 'tracking' && <div className="text-center py-8">
              <p className="text-gray-600">
                El tracking de aprobación se activará después de crear el
                usuario
              </p>
            </div>}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <div className="flex space-x-3">
            <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Guardar Borrador
            </button>
            <button className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors">
              Enviar a Revisión
            </button>
          </div>
        </div>
      </div>
    </div>;
}