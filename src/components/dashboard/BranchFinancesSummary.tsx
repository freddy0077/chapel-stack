import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
);

export function BranchFinancesSummary({ branchName }: { branchName: string }) {
  // Replace with real branch finance data
  const givingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Tithes & Offerings (₵)",
        data: [1200, 1400, 1350, 1500, 1600, 1700],
        backgroundColor: "#2563eb",
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };
  const expensesVsIncomeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [1800, 1900, 2000, 2100, 2200, 2300],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: [1500, 1600, 1700, 1800, 1900, 2000],
        borderColor: "#eab308",
        backgroundColor: "rgba(234,179,8,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Giving (This Month)</span>
          <span className="font-extrabold text-2xl text-blue-800">₵1,700</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Expenses vs Income</span>
          <span className="font-semibold text-blue-700">(Line/Area Chart)</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl h-60 flex items-center justify-center text-blue-400 shadow-inner">
          <Bar
            data={givingData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
            height={220}
          />
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-xl h-60 flex items-center justify-center text-blue-400 shadow-inner">
          <Line
            data={expensesVsIncomeData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: { y: { beginAtZero: true } },
            }}
            height={220}
          />
        </div>
      </div>
    </section>
  );
}
