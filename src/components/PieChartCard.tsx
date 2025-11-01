import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
export function PieChartCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [{
    name: 'DICE',
    value: 483,
    color: '#3b82f6'
  }, {
    name: 'DINOR',
    value: 430,
    color: '#f97316'
  }, {
    name: 'DISO',
    value: 333,
    color: '#a855f7'
  }, {
    name: 'DIC',
    value: 253,
    color: '#10b981'
  }, {
    name: 'DINOC',
    value: 390,
    color: '#eab308'
  }, {
    name: 'DISO SUR',
    value: 244,
    color: '#ef4444'
  }, {
    name: 'STAFF',
    value: 24,
    color: '#06b6d4'
  }, {
    name: 'ACADEMIA',
    value: 10,
    color: '#ec4899'
  }, {
    name: "SEMIS'D",
    value: 9,
    color: '#84cc16'
  }];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Distribución Global por Región
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value" onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.6} style={{
            transition: 'opacity 0.3s'
          }} />)}
          </Pie>
          <Tooltip content={({
          active,
          payload
        }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value as number) / total * 100).toFixed(0);
            return <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{data.name}</p>
                    <p className="text-sm text-gray-600">
                      {data.value} ({percentage}%)
                    </p>
                  </div>;
          }
          return null;
        }} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xs text-gray-500 font-medium">
            TOTAL
          </text>
          <text x="50%" y="50%" dy={20} textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold" fill="#1f2937">
            {total.toLocaleString()}
          </text>
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((item, index) => <div key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            <div className="w-3 h-3 rounded-full" style={{
          backgroundColor: item.color
        }} />
            <span className="text-sm text-gray-700 font-medium">
              {item.name}
            </span>
            <span className="text-sm text-gray-500 ml-auto">{item.value}</span>
          </div>)}
      </div>
    </div>;
}