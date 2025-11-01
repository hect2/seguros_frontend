import React, { useEffect, useState, useRef } from 'react';
import { User, Key, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
interface UserMenuProps {
  user: {
    nombre: string;
    email: string;
    telefono?: string;
    rol: string;
    avatarUrl?: string | null;
  };
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
}
export function UserMenu({
  user,
  onEditProfile,
  onChangePassword,
  onLogout
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const getInitials = (nombre: string) => {
    const words = nombre.split(' ');
    return (words[0]?.[0] || '') + (words[1]?.[0] || '');
  };
  const getRoleBadge = (rol: string) => {
    const badges: Record<string, string> = {
      'Super Admin': 'bg-purple-100 text-purple-700',
      Admin: 'bg-blue-100 text-blue-700',
      Supervisor: 'bg-green-100 text-green-700',
      Operador: 'bg-gray-100 text-gray-700'
    };
    return badges[rol] || 'bg-gray-100 text-gray-700';
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleEditProfile = () => {
    setIsOpen(false);
    if (onEditProfile) {
      onEditProfile();
    } else {
      navigate('/perfil');
    }
  };
  const handleChangePassword = () => {
    setIsOpen(false);
    if (onChangePassword) {
      onChangePassword();
    }
  };
  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/login');
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };
  const handleMenuItemKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
  return <div className="relative">
      <button ref={buttonRef} onClick={handleToggle} onKeyDown={handleKeyDown} aria-haspopup="menu" aria-expanded={isOpen} aria-controls="user-menu" className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-[#cf2e2e] focus-visible:outline-none">
        <div className="w-8 h-8 bg-[#cf2e2e] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {user.avatarUrl ? <img src={user.avatarUrl} alt={user.nombre} className="w-full h-full rounded-full object-cover" /> : getInitials(user.nombre)}
        </div>
        <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[150px] truncate">
          Hola, {user.nombre.split(' ')[0]}
        </span>
        <ChevronDown size={16} className={`hidden lg:block text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div ref={menuRef} id="user-menu" role="menu" aria-orientation="vertical" className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* User Info Header */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="relative group">
                <div className="w-16 h-16 bg-[#cf2e2e] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt={user.nombre} className="w-full h-full rounded-full object-cover" /> : getInitials(user.nombre)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base truncate">
                  {user.nombre}
                </h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${getRoleBadge(user.rol)}`}>
                  {user.rol}
                </span>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.telefono && <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="truncate">{user.telefono}</span>
                    </div>}
                </div>
              </div>
            </div>
          </div>
          {/* Menu Items */}
          <div className="py-2">
            <button role="menuitem" onClick={handleEditProfile} onKeyDown={e => handleMenuItemKeyDown(e, handleEditProfile)} className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left focus-visible:bg-gray-100 focus-visible:outline-none">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Editar Perfil
                </p>
                <p className="text-xs text-gray-500">
                  Actualiza tu información personal
                </p>
              </div>
            </button>
            <button role="menuitem" onClick={handleChangePassword} onKeyDown={e => handleMenuItemKeyDown(e, handleChangePassword)} className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors text-left focus-visible:bg-gray-100 focus-visible:outline-none">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Key size={18} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Cambiar Contraseña
                </p>
                <p className="text-xs text-gray-500">
                  Actualiza tu contraseña de acceso
                </p>
              </div>
            </button>
          </div>
          {/* Logout */}
          <div className="border-t border-gray-200 py-2">
            <button role="menuitem" onClick={handleLogout} onKeyDown={e => handleMenuItemKeyDown(e, handleLogout)} className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-red-50 transition-colors text-left focus-visible:bg-red-50 focus-visible:outline-none">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <LogOut size={18} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">
                  Cerrar Sesión
                </p>
                <p className="text-xs text-red-500">
                  Salir de tu cuenta de forma segura
                </p>
              </div>
            </button>
          </div>
        </div>}
    </div>;
}