import React, { useState } from 'react';
import { Menu, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from './UserMenu';
import { ChangePasswordModal } from './ChangePasswordModal';
import { NotificationBell } from './notifications/NotificationBell';
import { DetalleNovedadModal } from './novedades/DetalleNovedadModal';
import { Notification } from '../hooks/useNotifications';
interface DashboardHeaderProps {
  onMenuClick: () => void;
}
export function DashboardHeader({
  onMenuClick
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const mockUser = {
    nombre: 'Administrador Sistema',
    email: 'admin@sigsesa.gt',
    telefono: '+502 5555-0000',
    rol: 'Super Admin',
    avatarUrl: null
  };
  const handleEditProfile = () => {
    navigate('/perfil');
  };
  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handlePasswordSubmit = async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<boolean> => {
    console.log('Changing password:', passwords);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (passwords.currentPassword === 'Demo123*') {
      return true;
    }
    return false;
  };
  const handleViewNotificationDetail = (notification: Notification) => {
    const novedadMock = {
      id: notification.id,
      fecha: new Date(notification.timestamp).toLocaleString('es-ES'),
      tipo: notification.tipo || 'Importantes',
      descripcion: notification.descripcion || notification.titulo,
      oficina: notification.oficina,
      usuario: notification.usuario,
      criticidad: notification.criticidad,
      estado: notification.estado || 'En Seguimiento'
    };
    setSelectedNotification(novedadMock as any);
  };
  const handleViewAllNotifications = () => {
    navigate('/novedades?criticidad=Alta');
  };
  return <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-800">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Resumen General del Dispositivo
              </h1>
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                <Calendar size={16} />
                <span>19/10/2025 - 20/10/2025</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <NotificationBell onViewDetail={handleViewNotificationDetail} onViewAll={handleViewAllNotifications} />
            <UserMenu user={mockUser} onEditProfile={handleEditProfile} onChangePassword={handleChangePassword} onLogout={handleLogout} />
          </div>
        </div>
      </header>
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} onSubmit={handlePasswordSubmit} />
      {selectedNotification && <DetalleNovedadModal novedad={selectedNotification} onClose={() => setSelectedNotification(null)} />}
    </>;
}