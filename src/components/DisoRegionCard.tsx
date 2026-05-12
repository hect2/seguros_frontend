import { District } from '@/modules/reports/interfaces/distribution-by-region';
import { generateUniqueColor } from '@/utils/get_unique_color';
import React, { useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface DisoRegionCardProps {
  key: number;
  data: District;
}

export function DisoRegionCard({ data }: DisoRegionCardProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const officesWithColor = React.useMemo(() => {
    if (!data?.offices) return [];

    const usedColors: string[] = [];
 
    return data.offices.map((entry) => ({
      name: entry.code,
      shortName: entry.code,
      value: Number(entry.total),
      color: generateUniqueColor(usedColors),
    }));
  }, [data?.offices]);

  // console.log('_______________________');
  // console.log('officesWithColor');
  // console.log(officesWithColor);

  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-800 tracking-wider">
        {data.code}
      </h3>
      <p className="text-sm text-gray-600">
        Total: <span className="font-semibold">{data.total}</span>
      </p>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={officesWithColor}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {officesWithColor.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="none"
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
              className="transition-all duration-300 outline-none"
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const info = payload[0];
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="font-semibold text-gray-800">{info.payload.name}</p>
                  <p className="text-sm text-gray-600">Total: {info.value}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="space-y-2 mt-4">
        {officesWithColor.map((item, index) => <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{
            backgroundColor: item.color
          }} />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {item.value}
            </span>
          </div>)}
      </div>
  </div>;
}