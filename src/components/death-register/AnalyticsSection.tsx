'use client';

import React from 'react';
import { Card, Title, Grid, AreaChart, DonutChart } from '@tremor/react';
import { DeathRegister } from '../../types/deathRegister';

interface AnalyticsSectionProps {
  deathRegisters: DeathRegister[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  deathRegisters,
}) => {
  // Chart data for analytics
  const monthlyDeathsData = React.useMemo(() => {
    if (!deathRegisters) return [];
    
    const monthlyData: { [key: string]: number } = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, i).toLocaleDateString('en-US', { month: 'short' });
      monthlyData[month] = 0;
    }
    
    // Count deaths by month for current year
    deathRegisters
      .filter(record => new Date(record.dateOfDeath).getFullYear() === currentYear)
      .forEach(record => {
        const month = new Date(record.dateOfDeath).toLocaleDateString('en-US', { month: 'short' });
        monthlyData[month]++;
      });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      Deaths: count,
    }));
  }, [deathRegisters]);

  const ageDistributionData = React.useMemo(() => {
    if (!deathRegisters) return [];
    
    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '66-80': 0,
      '80+': 0,
    };
    
    deathRegisters.forEach(record => {
      if (record.ageAtDeath !== null && record.ageAtDeath !== undefined) {
        const age = record.ageAtDeath;
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 35) ageGroups['19-35']++;
        else if (age <= 50) ageGroups['36-50']++;
        else if (age <= 65) ageGroups['51-65']++;
        else if (age <= 80) ageGroups['66-80']++;
        else ageGroups['80+']++;
      }
    });
    
    return Object.entries(ageGroups).map(([ageGroup, count]) => ({
      name: ageGroup,
      value: count,
    }));
  }, [deathRegisters]);

  return (
    <div className="space-y-6">
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        <Card>
          <Title>Monthly Deaths Trend ({new Date().getFullYear()})</Title>
          <AreaChart
            className="h-72 mt-4"
            data={monthlyDeathsData}
            index="month"
            categories={["Deaths"]}
            colors={["blue"]}
            yAxisWidth={30}
          />
        </Card>
        
        <Card>
          <Title>Age Distribution</Title>
          <DonutChart
            className="h-72 mt-4"
            data={ageDistributionData}
            category="value"
            index="name"
            colors={["blue", "cyan", "indigo", "violet", "purple", "fuchsia"]}
          />
        </Card>
      </Grid>
    </div>
  );
};
