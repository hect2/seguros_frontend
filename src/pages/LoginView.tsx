import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from '../components/auth/LoginCard';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';
import { useAuth } from '../contexts/AuthContext';
export function LoginView() {
  const navigate = useNavigate();
  const {
    login
  } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    const success = await login(email, password, rememberMe);
    if (success) {
      navigate('/tablero');
    }
    return success;
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <LoginCard onSubmit={handleLogin} onForgotPassword={() => setShowForgotPassword(true)} />
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>© 2025 Corporación SigSesa. Todos los derechos reservados.</p>
        <p className="mt-1">
          <a href="#" className="hover:text-[#cf2e2e] transition-colors">
            Términos de servicio
          </a>
          {' · '}
          <a href="#" className="hover:text-[#cf2e2e] transition-colors">
            Política de privacidad
          </a>
        </p>
      </footer>
      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </div>;
}