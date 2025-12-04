import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { changePasswordAction } from '@/auth/actions/change-password.action';
import { useAuthStore } from '@/auth/store/auth.store';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const userId = useAuthStore((state) => state.user?.id);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const mutation = useMutation({
    mutationFn: (passwords: { currentPassword: string; newPassword: string, confirmPassword: string, }) => {
        if (!userId) {
            throw new Error('User ID not found');
        }
        return changePasswordAction(userId, passwords.currentPassword, passwords.newPassword, passwords.confirmPassword);
    },
    onSuccess: () => {
        toast.success("Contraseña actualizada correctamente");
        setSuccessMessage('Contraseña actualizada correctamente');
        setTimeout(() => {
            onClose();
        }, 2000);
    },
    onError: (error: any) => {
        const errorMessage = error.message || 'Error al cambiar la contraseña. Intenta nuevamente.';
        setErrors({ general: errorMessage });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      setSuccessMessage('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    if (!newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else {
      const validationErrors = validatePassword(newPassword);
      if (validationErrors.length > 0) {
        newErrors.newPassword = validationErrors.join('. ');
      }
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    mutation.mutate({
        currentPassword,
        newPassword,
        confirmPassword,
    });
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Débil', 'Regular', 'Buena', 'Fuerte'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Cambiar Contraseña
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}
          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{mutation.error?.message || 'Error al cambiar la contraseña. Intenta nuevamente.'}</p>
            </div>
          )}
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent ${errors.newPassword ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
            {newPassword && !errors.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">
                    Seguridad de contraseña
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {strengthLabels[passwordStrength - 1] || 'Muy débil'}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3].map(index => (
                    <div
                      key={index}
                      className={`h-1.5 flex-1 rounded-full ${index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-[#cf2e2e] focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-700 mb-2">
              La contraseña debe cumplir con:
            </p>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Mínimo 8 caracteres</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Al menos una letra mayúscula</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Al menos un número</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Al menos un carácter especial</span>
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="px-6 py-2.5 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b52626] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isLoading ? 'Guardando...' : 'Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}