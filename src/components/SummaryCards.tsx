import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TotalsClientResponse } from '@/modules/reports/interfaces/totals-client-response';
import { calculateChange } from '@/utils/calculateChange';

interface BarChartCardProps {
  data: TotalsClientResponse;
}

export function SummaryCards({ data }: BarChartCardProps) {
  const total_change = calculateChange(data.today.totals.grand_total ?? 0, data.yesterday.totals.grand_total ?? 0);
  const total_top_client_change = calculateChange(data.today.totals.total_top_client ?? 0, data.yesterday.totals.total_top_client ?? 0);
  const total_others_change = calculateChange(data.today.totals.total_others ?? 0, data.yesterday.totals.total_others ?? 0);
  const total_available_change = calculateChange(data.today.totals.total_available ?? 0, data.yesterday.totals.total_available ?? 0);

  const cards = [{
    title: 'Total Dispositivos',
    value: total_change.today,
    change: total_change.formatted,
    isPositive: total_change.isPositive,
    color: 'bg-blue-500'
  }, {
    title: data.today.top_client_name ?? '',
    value: total_top_client_change.today,
    change: total_top_client_change.formatted,
    isPositive: total_top_client_change.isPositive,
    color: 'bg-blue-500'
  }, {
    title: 'Otros Clientes',
    value: total_others_change.today,
    change: total_others_change.formatted,
    isPositive: total_others_change.isPositive,
    color: 'bg-orange-500'
  }, {
    title: 'Disponible',
    value: total_available_change.today,
    change: total_available_change.formatted,
    isPositive: total_available_change.isPositive,
    color: 'bg-green-500'
  }];
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    {cards.map((card, index) => <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`${card.color} p-3 rounded-lg`}>
          <div size={24} className="text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${card.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {card.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{card.change}</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">
        {card.title}
      </h3>
      <p className="text-3xl font-bold text-gray-800">{card.value}</p>
    </div>)}
  </div>;
}