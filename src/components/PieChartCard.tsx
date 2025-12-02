import { GlobalDistributionByRegionResponse } from '@/modules/reports/interfaces/global-distribution-by-region';
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CustomFullScreenLoading } from './custom/CustomFullScreenLoading';
import { generateUniqueColor } from '@/utils/get_unique_color';

interface PieChartCardProps {
  data: GlobalDistributionByRegionResponse;
}

export function PieChartCard({ data }: PieChartCardProps) {
  const total = data?.totals ?? 0;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  // ✅ GENERAR COLORES SOLO UNA VEZ
  const districtsWithColor = React.useMemo(() => {
    if (!data?.districts) return [];

    const usedColors: string[] = [];

    return data.districts.map((entry) => ({
      ...entry,
      value: entry.total, // 🔥 Recharts espera "value"
      color: generateUniqueColor(usedColors),
    }));
  }, [data?.districts]);

  if (!data) return <CustomFullScreenLoading />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Distribución Global por Región
      </h3>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={districtsWithColor}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {districtsWithColor.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                style={{ transition: "opacity 0.3s" }}
              />
            ))}
          </Pie>

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0];
                const percentage = (
                  ((dataPoint.value as number) / total) *
                  100
                ).toFixed(0);

                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{dataPoint.name}</p>
                    <p className="text-sm text-gray-600">
                      {dataPoint.value} ({percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs text-gray-500 font-medium"
          >
            TOTAL
          </text>

          <text
            x="50%"
            y="50%"
            dy={20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-2xl font-bold"
            fill="#1f2937"
          >
            {total}
          </text>
        </PieChart>
      </ResponsiveContainer>

      {/* 🔥 LISTADO DE LEYENDA */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {districtsWithColor.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700 font-medium">{item.code}</span>
            <span className="text-sm text-gray-500 ml-auto">
              {item.total.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
