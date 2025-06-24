"use client";

import { useState } from 'react';
import { ChartData } from '@/hooks/useDashboardData';
import dynamic from 'next/dynamic';

// Dynamically import chart components to avoid SSR issues
const DynamicBarChart = dynamic(
  () => import('@/components/charts/BarChart'),
  { ssr: false }
);

const DynamicLineChart = dynamic(
  () => import('@/components/charts/LineChart'),
  { ssr: false }
);

const DynamicPieChart = dynamic(
  () => import('@/components/charts/PieChart'),
  { ssr: false }
);

interface ChartContainerProps {
  chart: ChartData;
}

export default function ChartContainer({ chart }: ChartContainerProps) {
  const [expanded, setExpanded] = useState(false);

  // Function to render the appropriate chart type
  const renderChart = () => {
    switch (chart.chartType.toLowerCase()) {
      case 'bar':
      case 'column':
        return <DynamicBarChart data={chart.data} config={chart.config} />;
      case 'line':
      case 'area':
        return <DynamicLineChart data={chart.data} config={chart.config} />;
      case 'pie':
      case 'donut':
        return <DynamicPieChart data={chart.data} config={chart.config} />;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Chart type not supported: {chart.chartType}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">{chart.title}</h3>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        {chart.description && (
          <p className="text-sm text-gray-500 mt-1">{chart.description}</p>
        )}
      </div>

      <div className={`${expanded ? 'h-96' : 'h-64'} transition-all duration-300 w-full`}>
        {renderChart()}
      </div>
    </div>
  );
}
