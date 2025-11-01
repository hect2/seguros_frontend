import React from 'react';
interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export function RememberMeCheckbox({
  checked,
  onChange
}: RememberMeCheckboxProps) {
  return <div className="flex items-center">
      <input id="remember-me" name="remember-me" type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-4 h-4 text-[#cf2e2e] border-gray-300 rounded focus:ring-[#cf2e2e] focus:ring-2 focus:ring-opacity-20" />
      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
        Recordarme
      </label>
    </div>;
}