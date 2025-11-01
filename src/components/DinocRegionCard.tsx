import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
export function DinocRegionCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [{
    name: 'OTR Cobán',
    value: 190,
    fullMark: 200,
    color: '#3b82f6'
  }, {
    name: 'OTR Salamá',
    value: 62,
    fullMark: 200,
    color: '#f97316'
  }, {
    name: 'OTR Quiché',
    value: 131,
    fullMark: 200,
    color: '#10b981'
  }];
  const total = 383;
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-wider">
          D I N O C
        </h3>
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold">{total}</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="name" tick={{
          fontSize: 11
        }} />
          <PolarRadiusAxis angle={90} domain={[0, 200]} tick={{
          fontSize: 10
        }} />
          <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
          <Tooltip content={({
          active,
          payload
        }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            return <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">
                      {data.payload.name}
                    </p>
                    <p className="text-sm text-gray-600">{data.value}</p>
                  </div>;
          }
          return null;
        }} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-4">
        {data.map((item, index) => <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
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