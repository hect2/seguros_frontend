import React from 'react';
interface TextFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}
export function TextField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required = false,
  placeholder
}: TextFieldProps) {
  return <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-[#cf2e2e] ml-1">*</span>}
      </label>
      <input id={name} name={name} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} className={`w-full px-4 py-3 rounded-lg border transition-colors ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#cf2e2e] focus:ring-[#cf2e2e]'} focus:outline-none focus:ring-2 focus:ring-opacity-20`} />
      {error && <p id={`${name}-error`} className="text-sm text-red-600">
          {error}
        </p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>;
}