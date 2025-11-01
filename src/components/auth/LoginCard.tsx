import React, { useState } from 'react';
import { TextField } from './TextField';
import { PasswordField } from './PasswordField';
import { RememberMeCheckbox } from './RememberMeCheckbox';
import { Loader2 } from 'lucide-react';
interface LoginCardProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  onForgotPassword: () => void;
}
export function LoginCard({
  onSubmit,
  onForgotPassword
}: LoginCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Por favor ingresa un correo electrónico válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onSubmit(email, password, rememberMe);
      if (!success) {
        setErrors({
          general: 'Credenciales inválidas. Por favor verifica tu correo y contraseña.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Ocurrió un error. Por favor intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const isFormValid = email && password && password.length >= 6;
  return <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <img src="/logo.png" alt="SigSesa Logo" className="w-24 h-24 object-contain mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Iniciar sesión</h1>
        <p className="text-gray-600 mt-2">Corporación SigSesa</p>
      </div>
      {errors.general && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <TextField label="Correo electrónico" name="email" type="email" value={email} onChange={setEmail} error={errors.email} placeholder="tu@email.com" required />
        <PasswordField label="Contraseña" name="password" value={password} onChange={setPassword} error={errors.password} placeholder="••••••••" required showToggle />
        <div className="flex items-center justify-between">
          <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />
          <button type="button" onClick={onForgotPassword} className="text-sm text-[#cf2e2e] hover:text-[#b52626] font-medium">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full bg-[#cf2e2e] text-white py-3 rounded-lg font-medium hover:bg-[#b52626] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
          {isSubmitting ? <>
              <Loader2 size={20} className="animate-spin" />
              <span>Ingresando...</span>
            </> : <span>Ingresar</span>}
        </button>
      </form>
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-1">
          Credenciales de demostración:
        </p>
        <p className="text-xs text-blue-700">Email: admin@sigsesa.gt</p>
        <p className="text-xs text-blue-700">Contraseña: Demo123*</p>
      </div>
    </div>;
}