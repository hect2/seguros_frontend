import React from 'react';
import {
  Users,
  UserX,
  PauseCircle,
  ShieldCheck,
  BadgeCheck,
  FileCheck,
  Clock,
  Hourglass,
  UserCog,
  BookOpen,
  Search,
  ClipboardCheck,
  ClipboardList,
  ClipboardEdit,
} from "lucide-react";
import { DailyEmployeesSummaryResponse } from '@/modules/reports/interfaces/daily-summary-response';

interface DailySummaryCardsProps {
  data: DailyEmployeesSummaryResponse;
}

export function DailySummaryCards({ data }: DailySummaryCardsProps) {
  const cards = [
    {
      title: "Activos del día",
      value: data.daily_active_employees,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Inactivos del día",
      value: data.daily_inactive_employees,
      icon: UserX,
      color: "bg-gray-500",
    },
    {
      title: "Suspendidos del día",
      value: data.daily_suspended_employees,
      icon: PauseCircle,
      color: "bg-red-500",
    },
    {
      title: "Asegurados del día",
      value: data.daily_insured_employees,
      icon: ShieldCheck,
      color: "bg-blue-500",
    },
    {
      title: "Acreditados del día",
      value: data.daily_accredited_employees,
      icon: BadgeCheck,
      color: "bg-purple-500",
    },
    {
      title: "Validación de Cuenta",
      value: data.daily_account_validation_employees,
      icon: FileCheck,
      color: "bg-indigo-500",
    },
    {
      title: "En Aprobación",
      value: data.daily_approval_employees,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Pendientes",
      value: data.daily_pending_employees,
      icon: Hourglass,
      color: "bg-orange-500",
    },
    {
      title: "Guardias Temporales",
      value: data.daily_temporary_guard_employees,
      icon: UserCog,
      color: "bg-teal-500",
    },
    {
      title: "En Entrenamiento",
      value: data.daily_training_employees,
      icon: BookOpen,
      color: "bg-cyan-500",
    },
    {
      title: "En Revisión",
      value: data.daily_under_review_employees,
      icon: Search,
      color: "bg-amber-500",
    },
    {
      title: "Revisión IAO",
      value: data.daily_under_review_iao_employees,
      icon: ClipboardCheck,
      color: "bg-rose-500",
    },
    {
      title: "Revisión LIC",
      value: data.daily_under_review_lic_employees,
      icon: ClipboardList,
      color: "bg-pink-500",
    },
    {
      title: "Revisión TH",
      value: data.daily_under_review_th_employees,
      icon: ClipboardEdit,
      color: "bg-fuchsia-500",
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