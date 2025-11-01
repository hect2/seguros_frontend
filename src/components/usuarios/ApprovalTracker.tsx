import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';
interface Step {
  id: number;
  label: string;
  status: 'Completo' | 'En proceso' | 'Pendiente';
  responsable: string | null;
  fecha: string | null;
}
interface ApprovalTrackerProps {
  steps: Step[];
}
export function ApprovalTracker({
  steps
}: ApprovalTrackerProps) {
  const getStepIcon = (status: string) => {
    if (status === 'Completo') {
      return <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={20} className="text-white" />
        </div>;
    }
    if (status === 'En proceso') {
      return <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <Clock size={20} className="text-white" />
        </div>;
    }
    return <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <Circle size={20} className="text-gray-500" />
      </div>;
  };
  const getStatusBadge = (status: string) => {
    const badges = {
      Completo: 'bg-green-100 text-green-700',
      'En proceso': 'bg-blue-100 text-blue-700',
      Pendiente: 'bg-gray-100 text-gray-600'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-600';
  };
  return <div className="space-y-1">
      {steps.map((step, index) => <div key={step.id}>
          <div className="flex items-start space-x-3">
            <div className="flex flex-col items-center">
              {getStepIcon(step.status)}
              {index < steps.length - 1 && <div className="w-0.5 h-12 bg-gray-200 my-1" />}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-900">
                  {step.label}
                </p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(step.status)}`}>
                  {step.status}
                </span>
              </div>
              {step.responsable && <p className="text-xs text-gray-600">
                  Responsable: {step.responsable}
                </p>}
              {step.fecha && <p className="text-xs text-gray-500">Fecha: {step.fecha}</p>}
              {!step.responsable && step.status === 'Pendiente' && <p className="text-xs text-gray-400 italic">Sin asignar</p>}
            </div>
          </div>
        </div>)}
    </div>;
}