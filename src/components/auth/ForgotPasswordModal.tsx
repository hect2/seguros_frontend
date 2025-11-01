import React, { useState } from 'react';
import { X } from 'lucide-react';
interface ForgotPasswordModalProps {
  onClose: () => void;
}
export function ForgotPasswordModal({
  onClose
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('El correo electrónico es requerido');
      return;
    }
    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Cerrar">
          <X size={24} />
        </button>
        {!isSuccess ? <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-600 mb-6">
              Ingresa tu correo electrónico y te enviaremos instrucciones para
              restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input id="forgot-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className={`w-full px-4 py-3 rounded-lg border transition-colors ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#cf2e2e]'} focus:outline-none focus:ring-2 focus:ring-opacity-20`} />
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#cf2e2e] text-white py-3 rounded-lg font-medium hover:bg-[#b52626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </form>
          </> : <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¡Correo enviado!
            </h3>
            <p className="text-gray-600 mb-6">
              Revisa tu bandeja de entrada. Te hemos enviado instrucciones para
              restablecer tu contraseña.
            </p>
            <button onClick={onClose} className="bg-[#cf2e2e] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b52626] transition-colors">
              Cerrar
            </button>
          </div>}
      </div>
    </div>;
}