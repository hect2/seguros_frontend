import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { useState } from "react";

interface DashboardFilterProps {
  value: string;
  districtsList: DistrictsListResponse;
  onChange: (value: string) => void;
}

export function DashboardFilter({ 
  value, 
  districtsList,
  onChange 
}: DashboardFilterProps) {

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-xl w-fit mb-4">
      {districtsList.data.map((option) => (
        <button
          key={option.code}
          onClick={() => onChange(option.code)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
            ${
              value === option.code
                ? "bg-white shadow text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          {option.code}
        </button>
      ))}
    </div>
  );
}
