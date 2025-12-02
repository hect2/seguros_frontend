import React from 'react';
import { DiceRegionCard } from './DiceRegionCard';
import { DinorRegionCard } from './DinorRegionCard';
import { DisoRegionCard } from './DisoRegionCard';
import { DinocRegionCard } from './DinocRegionCard';
import { DiorRegionCard } from './DiorRegionCard';
import { DisosurRegionCard } from './DisosurRegionCard';
import { DistributionByRegionResponse } from '@/modules/reports/interfaces/distribution-by-region';

interface RegionalDistributionProps {
  data: DistributionByRegionResponse;
}

export function RegionalDistribution({ data }: RegionalDistributionProps) {
  return <div className="mt-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Distribución por Región
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* <DiceRegionCard />
        <DinorRegionCard /> */}
      {data.districts
        .filter(item => item.total >= 1)
        .map((item, index) => (
          <DisoRegionCard
            key={index}  
            data={item}
          />
        ))
      }
    </div>
    {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <DinocRegionCard />
        <DiorRegionCard />
        <DisosurRegionCard />
      </div> */}
  </div>;
}