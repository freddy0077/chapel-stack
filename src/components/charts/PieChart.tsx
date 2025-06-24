"use client";

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

import type { ChartData, ChartDataset, ChartOptions } from 'chart.js';

interface PieChartProps {
  data: ChartData<'pie' | 'doughnut', number[], string>;
  config?: ChartOptions<'pie' | 'doughnut'>;
}

const PieChart: React.FC<PieChartProps> = ({ data, config = {} }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Create new chart
    // Deep clone data and datasets to avoid frozen Apollo objects
    const safeData = {
      ...data,
      labels: Array.isArray(data.labels) ? [...data.labels] : data.labels,
      datasets: Array.isArray(data.datasets)
        ? data.datasets.map((ds: ChartDataset<'pie' | 'doughnut', number[]>) => ({ ...ds }))
        : data.datasets,
    };
    const chartType = config?.type === 'doughnut' ? 'doughnut' : 'pie';
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: safeData,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                // Defensive: dataset may contain nulls or non-numbers
                const dataset = context.chart.data.datasets[0];
                const total = Array.isArray(dataset.data)
                  ? dataset.data.reduce((a: number, b: number) => {
                      const aNum = typeof a === 'number' ? a : 0;
                      const bNum = typeof b === 'number' ? b : 0;
                      return aNum + bNum;
                    }, 0)
                  : 0;
                const parsed = typeof context.parsed === 'number' ? context.parsed : 0;
                const percentage = typeof total === 'number' && total > 0 ? Math.round((parsed * 100) / total) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        ...config
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, config]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
