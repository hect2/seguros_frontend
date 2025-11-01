import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  showToggle?: boolean;
}
export function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  showToggle = true
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-[#cf2e2e] ml-1">*</span>}
      </label>
      <div className="relative">
        <input id={name} name={name} type={showPassword ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className={`w-full px-4 py-3 rounded-lg border transition-colors pr-12 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#cf2e2e] focus:ring-[#cf2e2e]'} focus:outline-none focus:ring-2 focus:ring-opacity-20`} />
        {showToggle && <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>}
      </div>
      {error && <p id={`${name}-error`} className="text-sm text-red-600">
          {error}
        </p>}
    </div>;
}