import React from 'react';
import { CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
interface ImportSummaryProps {
  created: number;
  updated: number;
  skipped: number;
  duration: number;
  onFinish: () => void;
}
export function ImportSummary({
  created,
  updated,
  skipped,
  duration,
  onFinish
}: ImportSummaryProps) {
  const total = created + updated + skipped;
  return <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Importación Completada
        </h2>
        <p className="text-gray-600">
          La importación de usuarios se ha completado exitosamente
        </p>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-600 uppercase">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
          <p className="text-sm text-gray-600 mt-1">Registros procesados</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} className="text-green-600" />
            <span className="text-xs font-medium text-green-700 uppercase">
              Creados
            </span>
          </div>
          <p className="text-3xl font-bold text-green-900">{created}</p>
          <p className="text-sm text-green-700 mt-1">Usuarios nuevos</p>
        </div>
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle size={24} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700 uppercase">
              Actualizados
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-900">{updated}</p>
          <p className="text-sm text-blue-700 mt-1">Usuarios existentes</p>
        </div> */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock size={24} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase">
              Duración
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-900">{duration}s</p>
          <p className="text-sm text-blue-600 mt-1">Tiempo de proceso</p>
        </div>
      </div>
      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Detalles de la Importación
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Usuarios creados</span>
            <span className="text-sm font-semibold text-green-600">
              {created}
            </span>
          </div>
          {/* <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Usuarios actualizados</span>
            <span className="text-sm font-semibold text-blue-600">
              {updated}
            </span>
          </div> */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Registros omitidos</span>
            <span className="text-sm font-semibold text-gray-600">
              {skipped}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700 font-medium">
              Total procesado
            </span>
            <span className="text-sm font-bold text-gray-900">{total}</span>
          </div>
        </div>
      </div>
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-900">
          ✅ Los usuarios han sido importados correctamente y ya están
          disponibles en el sistema. Puedes verlos en el listado de usuarios.
        </p>
      </div>
      {/* Finish Button */}
      <div className="flex justify-center">
        <button onClick={onFinish} className="px-8 py-3 bg-[#cf2e2e] text-white rounded-lg font-medium hover:bg-[#b52626] transition-colors text-lg">
          Ir al Listado de Usuarios
        </button>
      </div>
    </div>;
}