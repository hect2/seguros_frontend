import React from 'react';
import {
  Users,
  UserX,
  PauseCircle,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { DailyEmployeesSummaryResponse } from '@/modules/reports/interfaces/daily-summary-response';

interface DailySummaryCardsProps {
  data: DailyEmployeesSummaryResponse;
}

export function DailySummaryCards({ data }: DailySummaryCardsProps) {
  const cards = [
    {
      title: "Activos",
      value: data.daily_active_employees,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Inactivos",
      value: data.daily_inactive_employees,
      icon: UserX,
      color: "bg-gray-500",
    },
    {
      title: "Suspendidos",
      value: data.daily_suspended_employees,
      icon: PauseCircle,
      color: "bg-red-500",
    },
    {
      title: "Asegurados",
      value: data.daily_insured_employees,
      icon: ShieldCheck,
      color: "bg-blue-500",
    },
    {
      title: "Acreditados",
      value: data.daily_accredited_employees,
      icon: BadgeCheck,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon size={22} className="text-white" />
              </div>
            </div>

            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>

            <p className="text-3xl font-bold text-gray-800">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}