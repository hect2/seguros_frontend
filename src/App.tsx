import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { SummaryCards } from './components/SummaryCards';
import { PieChartCard } from './components/PieChartCard';
import { BarChartCard } from './components/BarChartCard';
import { RegionalDistribution } from './components/RegionalDistribution';
export function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-64`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 lg:p-8">
          <SummaryCards />
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Visión Global
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChartCard />
              <BarChartCard />
            </div>
          </div>
          <RegionalDistribution />
        </main>
      </div>
    </div>;
}