import React, { useEffect, useRef } from 'react';
import { X, Eye, Check, ArrowRight, Bell } from 'lucide-react';
import { Notification } from '../../hooks/useNotifications';
import { getRelativeTime } from '../../utils/timeUtils';
import { getCriticalityColor } from '@/utils/criticality';
interface HighSeverityDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onViewDetail: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onViewAll: () => void;
  onSimulateNew?: () => void;
}
export function HighSeverityDropdown({
  isOpen,
  onClose,
  notifications,
  onViewDetail,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  onSimulateNew
}: HighSeverityDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const unreadNotifications = notifications.filter(n => !n.leida);
  return <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      {/* Dropdown/Drawer */}
      <div ref={dropdownRef} className="fixed lg:absolute right-0 top-0 lg:top-full lg:right-0 lg:mt-2 h-full lg:h-auto w-full sm:w-96 lg:w-[400px] bg-white lg:rounded-2xl shadow-2xl z-50 flex flex-col lg:max-h-[calc(100vh-100px)]" role="dialog" aria-modal="true" aria-labelledby="notifications-title">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Bell size={20} className="text-[#dc2626]" />
            <h3 id="notifications-title" className="font-bold text-gray-900">
              {/* Notificaciones (Alta) */}
              Notificaciones
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={onViewAll} className="text-sm text-[#cf2e2e] hover:text-[#b52626] font-medium">
              Ver todas
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1" aria-label="Cerrar notificaciones">
              <X size={20} />
            </button>
          </div>
        </div>
        {/* Demo Button */}
        {/* {onSimulateNew && <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <button onClick={onSimulateNew} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <span className="text-lg">+</span>
              <span>Simular nueva notificación (Demo)</span>
            </button>
          </div>} */}
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell size={32} className="text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Sin notificaciones
              </h4>
              <p className="text-sm text-gray-500">
                No hay notificaciones de criticidad alta en este momento
              </p>
            </div> : <div className="divide-y divide-gray-100">
              {notifications.map(notification => <div key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${!notification.leida ? 'bg-red-50' : 'bg-white'}`}>
                  <div className="flex items-start space-x-3">
                    {/* Unread Indicator */}
                    {!notification.leida && <div className="w-2 h-2 bg-[#dc2626] rounded-full mt-2 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      {/* Title and Badge */}
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                          {notification.titulo}
                        </h4>
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${getCriticalityColor(notification.criticidad_slug)}`}>
                        {notification.criticidad}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="space-y-0.5 mb-2">
                        <p className="text-xs text-gray-600">
                          {notification.distrito}
                        </p>
                        {notification.usuario && <p className="text-xs text-gray-500">
                            Responsable: {notification.usuario}
                          </p>}
                        <p className="text-xs text-gray-400">
                          {getRelativeTime(notification.timestamp)}
                        </p> 
                      </div>
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button onClick={() => onViewDetail(notification)} className="flex items-center space-x-1 px-3 py-1.5 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors text-xs font-medium">
                          <Eye size={14} />
                          <span>Ver detalle</span>
                        </button>
                        {!notification.leida && <button onClick={() => onMarkAsRead(notification.id)} className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium">
                            <Check size={14} />
                            <span>Marcar leída</span>
                          </button>}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>
        {/* Footer */}
        {notifications.length > 0 && <div className="border-t border-gray-200 p-3 flex-shrink-0 space-y-2">
            {unreadNotifications.length > 0 && <button onClick={onMarkAllAsRead} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium">
                <Check size={16} />
                <span>Marcar todas como leídas</span>
              </button>}
            <button onClick={onViewAll} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors text-sm font-medium">
              <span>Ir a Novedades</span>
              <ArrowRight size={16} />
            </button>
          </div>}
      </div>
    </>;
}