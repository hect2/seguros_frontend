import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
export function SummaryCards() {
  const cards = [{
    title: 'Total Dispositivos',
    value: '1,991',
    change: '+5.2%',
    isPositive: true,
    color: 'bg-blue-500'
  }, {
    title: 'Banrural',
    value: '1,239',
    change: '+2.1%',
    isPositive: true,
    color: 'bg-blue-500'
  }, {
    title: 'Otros Clientes',
    value: '540',
    change: '-1.3%',
    isPositive: false,
    color: 'bg-orange-500'
  }, {
    title: 'Disponible',
    value: '81',
    change: '+8.7%',
    isPositive: true,
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