import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Menu, X, Bell, ChevronDown, ChevronRight } from 'lucide-react';
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}
export function Sidebar({
  isOpen,
  onToggle
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfiguracionesOpen, setIsConfiguracionesOpen] = useState(location.pathname.startsWith('/configuraciones'));
  const menuItems = [{
    name: 'Tablero',
    icon: LayoutDashboard,
    path: '/tablero'
  }, {
    name: 'Novedades',
    icon: Bell,
    path: '/novedades'
  }, {
    name: 'Base de datos',
    icon: Users,
    path: '/usuarios'
  }, {
    name: 'Reportes',
    icon: FileText,
    path: '/reportes'
  }];
  const configuracionesSubmenu = [{
    name: 'Asignación Territorial',
    path: '/configuraciones/asignacion-territorial'
  }, {
    name: 'Seguridad',
    children: [{
      name: 'Administración de Usuarios',
      path: '/configuraciones/seguridad/administracion-usuarios'
    }]
  }];
  return <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={onToggle} />}
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo section */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="SigSesa Logo" className="w-12 h-12 object-contain" />
              <span className="text-xl font-bold text-gray-800">SigSesa</span>
            </div>
            <button onClick={onToggle} className="lg:hidden text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>
          {/* Menu items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return <li key={item.name}>
                    <button onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-[#cf2e2e] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>;
            })}
              {/* Configuraciones with submenu */}
              <li>
                <button onClick={() => setIsConfiguracionesOpen(!isConfiguracionesOpen)} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${location.pathname.startsWith('/configuraciones') ? 'bg-[#cf2e2e] text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <div className="flex items-center space-x-3">
                    <Settings size={20} />
                    <span className="font-medium">Configuraciones</span>
                  </div>
                  {isConfiguracionesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {/* Submenu */}
                {isConfiguracionesOpen && <ul className="mt-2 ml-4 space-y-1">
                    {configuracionesSubmenu.map(subItem => {
                  if (subItem.children) {
                    const isSecurityActive = location.pathname.startsWith('/configuraciones/seguridad');
                    return <li key={subItem.name}>
                            <div className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                              {subItem.name}
                            </div>
                            <ul className="ml-4 space-y-1">
                              {subItem.children.map(child => {
                          const isChildActive = location.pathname === child.path;
                          return <li key={child.name}>
                                    <button onClick={() => {
                              navigate(child.path);
                              if (window.innerWidth < 1024) {
                                onToggle();
                              }
                            }} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${isChildActive ? 'bg-red-50 text-[#cf2e2e] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                                      {child.name}
                                    </button>
                                  </li>;
                        })}
                            </ul>
                          </li>;
                  }
                  const isSubActive = location.pathname.startsWith(subItem.path);
                  return <li key={subItem.name}>
                          <button onClick={() => {
                      navigate(subItem.path);
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${isSubActive ? 'bg-red-50 text-[#cf2e2e] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                            {subItem.name}
                          </button>
                        </li>;
                })}
                  </ul>}
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>;
}