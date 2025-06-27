"use client";

import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { ChartData, ChartOptions } from 'chart.js';

interface BarChartProps {
  data: ChartData;
  options?: ChartOptions;
}

const BarChart: React.FC<BarChartProps> = ({ data, options = {} }) => {
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
        ? data.datasets.map((ds: unknown) => ({ ...ds }))
        : data.datasets,
    };
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: safeData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        ...options
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
