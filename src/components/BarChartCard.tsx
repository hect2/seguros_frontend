import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
export function BarChartCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [{
    name: 'Banrural',
    value: 1239,
    color: '#3b82f6',
    label: 'Banrural'
  }, {
    name: 'Otros Clientes',
    value: 540,
    color: '#f97316',
    label: 'Otros Clientes'
  }, {
    name: 'Disponible',
    value: 81,
    color: '#10b981',
    label: 'Disponible'
  }, {
    name: 'Reserva',
    value: 131,
    color: '#eab308',
    label: 'Reserva'
  }];
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Totales por Cliente</h3>
        <div className="bg-[#cf2e2e] text-white px-4 py-2 rounded-full text-sm font-semibold">
          Total: {total.toLocaleString()}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
          <Tooltip content={({
          active,
          payload
        }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value as number) / total * 100).toFixed(1);
            return <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">
                      {data.payload.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {data.value} dispositivos ({percentage}%)
                    </p>
                  </div>;
          }
          return null;
        }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.6} style={{
            transition: 'opacity 0.3s'
          }} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{
            backgroundColor: item.color
          }} />
              <span className="text-sm text-gray-700 font-medium">
                {item.label}
              </span>
            </div>
            <span className="text-lg font-bold text-gray-800">
              {item.value}
            </span>
          </div>)}
      </div>
    </div>;
}