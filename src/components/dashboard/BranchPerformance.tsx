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

export function BranchPerformance({ branchName }: { branchName: string }) {
  // Replace with real branch attendance/growth data
  const attendanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: `Attendance at ${branchName}`,
        data: [280, 300, 295, 310, 320, 330],
        backgroundColor: "#2563eb",
        borderRadius: 8,
        barThickness: 32
      }
    ]
  };
  const growthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: `Financial Growth at ${branchName} (₵)`,
        data: [200, 250, 300, 350, 400, 450],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <h2 className="font-semibold text-xl mb-6 text-blue-800">{branchName} Branch Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl h-60 flex items-center justify-center text-blue-400 shadow-inner">
          <Bar
            data={attendanceData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
            height={220}
          />
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-xl h-60 flex items-center justify-center text-blue-400 shadow-inner">
          <Line
            data={growthData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: "top" } },
              scales: { y: { beginAtZero: true } }
            }}
            height={220}
          />
        </div>
      </div>
    </section>
  );
}
