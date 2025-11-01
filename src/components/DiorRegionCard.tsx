import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
export function DiorRegionCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [{
    name: 'OTR Jalapa',
    value: 45,
    color: '#3b82f6'
  }, {
    name: 'OTR Jutiapa',
    value: 123,
    color: '#f97316'
  }, {
    name: 'OTR El Progreso',
    value: 85,
    color: '#a855f7'
  }];
  const total = 253;
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-wider">
          D I O R
        </h3>
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold">{total}</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" tick={{
          fontSize: 11
        }} />
          <YAxis dataKey="name" type="category" width={120} tick={{
          fontSize: 11
        }} />
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
          <Bar dataKey="value" radius={[0, 8, 8, 0]} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.6} />)}
          </Bar>
        </BarChart>
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