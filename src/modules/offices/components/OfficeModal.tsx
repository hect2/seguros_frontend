import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { District } from '@/modules/districts/interfaces/district.interface';
import { Office } from '../interfaces/office.interface';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';

interface OfficeModalProps {
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  oficina: Office | null;
  districts: DistrictsListResponse;
  presetDistrictId?: number;
  onSubmit: (office: Partial<Office>) => void;
}

export function OfficeModal({
  mode,
  isOpen,
  onClose,
  oficina,
  districts,
  presetDistrictId,
  onSubmit
}: OfficeModalProps) {

  console.log(`OfficeModal - districts : ${districts}`)
  const [formData, setFormData] = useState<Partial<Office>>({
    code: '',
    name: '',
    direction: '',
    district_id: presetDistrictId ?? undefined,
    status: 1,
  });

  useEffect(() => {
    if (mode === 'edit' && oficina) {
      setFormData({
        ...oficina,
        district_id: oficina.district_id,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        direction: '',
        district_id: presetDistrictId ?? undefined,
        status: 1,
      });
    }
  }, [mode, oficina, presetDistrictId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      alert('Código y nombre son obligatorios');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {mode === 'create' ? 'Crear Oficina' : 'Editar Oficina'}
        </h2>

        {/* FORM */}
        <div className="space-y-4">
          
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              name="code"
              value={formData.code ?? ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Ej: OF-001"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name ?? ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Nombre de la oficina"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direction"
              value={formData.direction ?? ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Dirección física"
            />
          </div>

          {/* Distrito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distrito
            </label>
            <select
              name="district_id"
              value={formData.district_id ?? ''}
              onChange={handleChange}
              // disabled={!!presetDistrictId}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un distrito</option>
              {districts.data?.map(d => (
                <option key={d.id} value={d.id}>
                  {d.code}
                </option>
              ))}
            </select>
            {/* {presetDistrictId && (
              <p className="text-xs text-gray-500 mt-1">Este distrito está predefinido.</p>
            )} */}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-red-500"
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {mode === 'create' ? 'Crear' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}
