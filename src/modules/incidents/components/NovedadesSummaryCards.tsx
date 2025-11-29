import React from 'react';
import { Info, Clock, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { IncidentReports } from '@/modules/incidents/interfaces/incidents-reports.response';


interface Props {
  data: IncidentReports | undefined
}

export function NovedadesSummaryCards({ data } : Props) {

  // Colors By Critical Slug
  const colorBySlug: Record<string, string> = {
    high: '#ef4444',
    medium: '#f97316',
    low: '#10b981'
  };

  // Map Critical Data
  const criticalityData = data?.data.critical.map((item) => ({
    name: item.critical,
    value: item.total,
    color: colorBySlug[item.slug] || '#6b7280' // default gray if missing
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    
      {/* Total Period */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Info className="text-blue-600" size={24} />
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">Total del Período</h3>
        <p className="text-3xl font-bold text-gray-800">{data?.data.total}</p>
      </div>

      {/* Total In Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Clock className="text-orange-600" size={24} />
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{data?.data.in_progress.status}</h3>
        <p className="text-3xl font-bold text-gray-800">{data?.data.in_progress.total}</p>
      </div>

      {/* Total Resolved */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{data?.data.resolved.status}</h3>
        <p className="text-3xl font-bold text-gray-800">{data?.data.resolved.total}</p>
      </div>

      {/* Total Criticals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-600 text-sm font-medium mb-3">
          Por Criticidad
        </h3>

        {/* Chart Pie */}
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie data={criticalityData} cx="50%" cy="50%" outerRadius={50} dataKey="value">
              {criticalityData?.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Total By Criticals */}
        <div className="space-y-1 mt-2">
          {criticalityData?.map((item, index) => <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{
              backgroundColor: item.color
            }} />
                <span className="text-xs text-gray-700">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {item.value}
              </span>
            </div>)}
        </div>
      </div>
    </div>
  );
}