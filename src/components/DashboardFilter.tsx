import { useState } from "react";

export type FilterType = "day" | "week" | "fifteen" | "all";

interface DashboardFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
}

export function DashboardFilter({ value, onChange }: DashboardFilterProps) {
  const options: { label: string; value: FilterType }[] = [
    { label: "Día", value: "day" },
    { label: "Semana", value: "week" },
    { label: "15 días", value: "fifteen" },
    { label: "Todos", value: "all" },
  ];

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit mb-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              value === option.value
                ? "bg-white shadow text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
