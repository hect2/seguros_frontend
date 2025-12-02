import { useReportsTotalsClient } from '@/modules/reports/hooks/useReportsTotalsClient';
import { TotalsClientResponse } from '@/modules/reports/interfaces/totals-client-response';
import { generateUniqueColor } from '@/utils/get_unique_color';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartCardProps {
  data: TotalsClientResponse;
}

export function BarChartCard({ data }: BarChartCardProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.totals.grand_total;

  const officesWithColor = [{
    name: data.top_client_name,
    value: data.totals.total_top_client,
    color: '#3b82f6',
    label: data.top_client_name,
  }, {
    name: 'Otros Clientes',
    value: data.totals.total_others,
    color: '#f97316',
    label: 'Otros Clientes'
  }, {
    name: 'Disponible',
    value: data.totals.total_available,
    color: '#10b981',
    label: 'Disponible'
  }, {
    name: 'Reserva',
    value: data.totals.total_reserve,
    color: '#eab308',
    label: 'Reserva'
  }];
  // const data = TotalsClientData.offices;

  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-gray-800">Totales por Cliente</h3>
      <div className="bg-[#cf2e2e] text-white px-4 py-2 rounded-full text-sm font-semibold">
        Total: {total.toLocaleString()}
      </div>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={officesWithColor} layout="vertical" margin={{
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
          {officesWithColor.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.6} style={{
            transition: 'opacity 0.3s'
          }} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <div className="grid grid-cols-2 gap-4 mt-6">
      {officesWithColor.map((item, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{
            backgroundColor: item.color
          }} />
          <span className="text-sm text-gray-700 font-medium">
            {item.name}
          </span>
        </div>
        <span className="text-lg font-bold text-gray-800">
          {item.value}
        </span>
      </div>)}
    </div>
  </div>;
}