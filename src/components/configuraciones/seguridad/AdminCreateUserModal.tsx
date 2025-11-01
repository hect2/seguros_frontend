import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, RefreshCw } from 'lucide-react';
interface AdminCreateUserModalProps {
  onClose: () => void;
}
type TabType = 'identidad' | 'rol-permisos' | 'asignacion-territorial' | 'seguridad' | 'observaciones';
const distritos = ['DINOC', 'ADMINISTRATIVO', 'DICE', 'DINOR', 'DIOR', 'DISO', 'DISO SUR', 'STAFF', 'ACADEMIA'];
const rolePermissions = {
  'Super Admin': 'Acceso completo al sistema. Puede crear, editar y eliminar usuarios, configurar distritos y oficinas, y acceder a todos los reportes.',
  Admin: 'Puede gestionar usuarios (excepto Super Admins), configurar asignaciones territoriales y acceder a reportes.',
  Supervisor: 'Puede ver y editar información de usuarios de su distrito, acceder a reportes limitados.',
  Operador: 'Acceso de solo lectura a la información de su distrito.'
};
export function AdminCreateUserModal({
  onClose
}: AdminCreateUserModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identidad');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDistritos, setSelectedDistritos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    dpi: '',
    telefono: '',
    estado: 'Activo',
    rol: '',
    password: '',
    forcePasswordChange: true,
    observaciones: ''
  });
  const tabs = [{
    id: 'identidad',
    label: 'Identidad'
  }, {
    id: 'rol-permisos',
    label: 'Rol y Permisos'
  }, {
    id: 'asignacion-territorial',
    label: 'Asignación Territorial'
  }, {
    id: 'seguridad',
    label: 'Seguridad'
  }, {
    id: 'observaciones',
    label: 'Observaciones'
  }];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  const handleDistritoToggle = (distrito: string) => {
    setSelectedDistritos(prev => {
      if (prev.includes(distrito)) {
        return prev.filter(d => d !== distrito);
      }
      return [...prev, distrito];
    });
  };
  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({
      ...formData,
      password
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
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
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
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`py-3 px-1 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'text-[#cf2e2e] border-b-2 border-[#cf2e2e]' : 'text-gray-600 hover:text-gray-800'}`}>
                {tab.label}
              </button>)}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'identidad' && <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número DPI <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="dpi" value={formData.dpi} onChange={handleInputChange} maxLength={13} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
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
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select name="estado" value={formData.estado} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En revisión">En revisión</option>
                  </select>
                </div>
              </div>
            </div>}
          {activeTab === 'rol-permisos' && <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select name="rol" value={formData.rol} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent">
                  <option value="">Seleccionar rol</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Operador">Operador</option>
                </select>
              </div>
              {formData.rol && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Permisos del rol seleccionado:
                  </p>
                  <p className="text-sm text-blue-800">
                    {rolePermissions[formData.rol as keyof typeof rolePermissions]}
                  </p>
                </div>}
            </div>}
          {activeTab === 'asignacion-territorial' && <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Distrito <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {distritos.map(distrito => <button key={distrito} onClick={() => handleDistritoToggle(distrito)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDistritos.includes(distrito) ? 'bg-[#cf2e2e] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {distrito}
                  </button>)}
              </div>
            </div>}
          {activeTab === 'seguridad' && <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2.5 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent" />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button type="button" onClick={generatePassword} className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <RefreshCw size={14} />
                      <span>Generar</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <input type="checkbox" id="forcePasswordChange" name="forcePasswordChange" checked={formData.forcePasswordChange} onChange={handleInputChange} className="w-4 h-4 mt-0.5 text-[#cf2e2e] border-gray-300 rounded focus:ring-[#cf2e2e]" />
                <label htmlFor="forcePasswordChange" className="text-sm text-gray-700">
                  Forzar cambio de contraseña en el primer inicio de sesión
                </label>
              </div>
            </div>}
          {activeTab === 'observaciones' && <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleInputChange} rows={10} placeholder="Notas adicionales sobre este usuario..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent resize-none" />
            </div>}
        </div>
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
            Cancelar
          </button>
          <button className="px-8 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium">
            Crear Usuario
          </button>
        </div>
      </div>
    </div>;
}