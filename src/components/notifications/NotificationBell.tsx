import React, { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications, Notification } from '../../hooks/useNotifications';
import { HighSeverityDropdown } from './HighSeverityDropdown';
interface NotificationBellProps {
  onViewDetail: (notification: Notification) => void;
  onViewAll: () => void;
}
export function NotificationBell({
  onViewDetail,
  onViewAll
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    simulateNewNotification
  } = useNotifications('Alta');
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleViewDetail = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    onViewDetail(notification);
  };
  const handleViewAll = () => {
    setIsOpen(false);
    onViewAll();
  };
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  const handleSimulateNew = () => {
    simulateNewNotification();
  };
  return <div className="relative">
      <button ref={buttonRef} onClick={handleToggle} aria-label="Notificaciones de alta criticidad" aria-haspopup="menu" aria-expanded={isOpen} className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#cf2e2e] focus-visible:outline-none">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc2626] text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>}
      </button>
      <HighSeverityDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} notifications={notifications} onViewDetail={handleViewDetail} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onViewAll={handleViewAll} onSimulateNew={handleSimulateNew} />
    </div>;
}