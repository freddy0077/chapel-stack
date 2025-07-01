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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

interface FinancesSummaryProps {
  totalContributions?: number;
  topBranches?: { name: string; amount: number }[];
  expensesVsIncome?: { labels: string[]; income: number[]; expenses: number[] };
  pendingApprovals?: number;
}

export function FinancesSummary({
  totalContributions,
  topBranches,
  expensesVsIncome,
  pendingApprovals,
}: FinancesSummaryProps) {
  const topBranchesData = {
    labels: topBranches?.map((b) => b.name) ?? ["Accra Central", "Kumasi", "Tema", "Cape Coast", "Takoradi"],
    datasets: [
      {
        label: "Giving (₵)",
        data: topBranches?.map((b) => b.amount) ?? [12000, 10500, 9000, 8700, 8000],
        backgroundColor: [
          "#2563eb",
          "#eab308",
          "#38bdf8",
          "#a3a3a3",
          "#facc15"
        ],
        borderRadius: 8,
        barThickness: 28
      }
    ]
  };

  const expensesVsIncomeData = {
    labels: expensesVsIncome?.labels ?? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: expensesVsIncome?.income ?? [8000, 9000, 10000, 9500, 11000, 12000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Expenses",
        data: expensesVsIncome?.expenses ?? [6000, 7000, 8000, 7500, 9000, 9500],
        borderColor: "#eab308",
        backgroundColor: "rgba(234,179,8,0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col"><span className="text-gray-500 text-sm">Tithes & Offerings (This Month)</span><span className="font-extrabold text-2xl text-blue-800">₵{totalContributions?.toLocaleString() ?? "0"}</span></div>
        <div className="flex flex-col"><span className="text-gray-500 text-sm">Top 5 Giving Branches</span><span className="font-semibold text-blue-700">(Bar Chart)</span></div>
        <div className="flex flex-col"><span className="text-gray-500 text-sm">Expenses vs Income</span><span className="font-semibold text-blue-700">(Line/Area Chart)</span></div>
        <div className="flex flex-col"><span className="text-gray-500 text-sm">Pending Approvals</span><span className="font-bold text-xl text-yellow-600">{pendingApprovals ?? 7}</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl h-60 flex items-center justify-center text-blue-400 shadow-inner">
          <Line
            data={expensesVsIncomeData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: { y: { beginAtZero: true } }
            }}
            height={220}
          />
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-xl h-60 flex items-center justify-center text-blue-400 shadow-inner">
          <Bar
            data={topBranchesData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
            height={220}
          />
        </div>
      </div>
    </section>
  );
}
