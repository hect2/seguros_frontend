import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
export function DisosurRegionCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [{
    name: 'OTR Retalhuleu',
    value: 84,
    color: '#3b82f6'
  }, {
    name: 'OTR Suchitepéquez',
    value: 93,
    color: '#f97316'
  }, {
    name: 'OAS Coatepeque',
    value: 67,
    color: '#10b981'
  }];
  const total = 244;
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 tracking-wider">
          D I S O S U R
        </h3>
        <p className="text-sm text-gray-600">
          Total: <span className="font-semibold">{total}</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            {data.map((entry, index) => <Cell key={`inner-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.6} />)}
          </Pie>
          <Pie data={data} cx="50%" cy="50%" innerRadius={65} outerRadius={80} dataKey="value" onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            {data.map((entry, index) => <Cell key={`outer-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 0.7 : 0.4} />)}
          </Pie>
          <Tooltip content={({
          active,
          payload
        }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            return <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{data.name}</p>
                    <p className="text-sm text-gray-600">{data.value}</p>
                  </div>;
          }
          return null;
        }} />
        </PieChart>
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