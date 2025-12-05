import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';
import { Tracking } from '../../interfaces/employee-response';
import { useFindUser } from '@/utils/useFindUser';

interface ApprovalTrackerProps {
  steps: Tracking[];
}
export function ApprovalTracker({
  steps
}: ApprovalTrackerProps) {
  console.log(`Trackings: ${steps}`)
  const { findUser } = useFindUser();
  const getStepIcon = (status: number) => {
    if (status === 1) {
      return <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={20} className="text-white" />
        </div>;
    }
    if (status === 2) {
      return <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <Clock size={20} className="text-white" />
        </div>;
    }
    return <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <Circle size={20} className="text-gray-500" />
      </div>;
  };
  const getStatusBadge = (status: number) => {
    const badges = {
      1: 'bg-green-100 text-green-700',
      2: 'bg-blue-100 text-blue-700',
      0: 'bg-gray-100 text-gray-600'
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
                  {step.description}
                </p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadge(step.status)}`}>
                  {step.status === 1 ? 'Completo' : (step.status === 2 ? 'En proceso' : 'Pendiente')}
                </span>
              </div>
              {step.responsible && <p className="text-xs text-gray-600">
                  Responsable: {findUser(Number(step.responsible))?.name}
                </p>}
              {step.approval_date && <p className="text-xs text-gray-500">Fecha: {new Date(step.approval_date).toLocaleDateString()}</p>}
              {!step.responsible && step.status === 0 && <p className="text-xs text-gray-400 italic">Sin asignar</p>}
            </div>
          </div>
        </div>)}
    </div>;
}