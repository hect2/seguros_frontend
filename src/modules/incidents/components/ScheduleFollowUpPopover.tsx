import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { Incident } from '../interfaces/incident';

interface ScheduleFollowUpPopoverProps {
  onSchedule: (date: string) => void;
  incident: Incident
}

export function ScheduleFollowUpPopover({ onSchedule, incident }: ScheduleFollowUpPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSchedule = () => {
    if (date) {
      onSchedule(date);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Calendar size={16} />
        <span>Programar seguimiento</span>
      </button>
      <span
  className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
  title={new Date(incident.follow_date).toLocaleString()} // muestra fecha y hora completa al pasar el mouse
>
  {new Date(incident.follow_date).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}
</span>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 space-y-3">
          <p className="text-sm font-medium">Seleccionar fecha</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleSchedule}
            className="w-full bg-[#cf2e2e] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#b52626]"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}
