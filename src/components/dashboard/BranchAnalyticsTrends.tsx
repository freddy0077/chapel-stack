import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface MemberMonthlyTrend {
  month: number;
  year: number;
  totalMembers: number;
  newMembers: number;
}

interface FinanceMonthlyTrend {
  month: number;
  year: number;
  contributions: number;
  expenses: number;
  netIncome: number;
}

interface AttendanceMonthlyTrend {
  month: number;
  year: number;
  totalAttendance: number;
  uniqueAttendees: number;
}

interface SacramentBreakdown {
  type: string;
  count: number;
}

interface SacramentMonthlyTrend {
  month: number;
  count: number;
}

interface BranchAnalyticsTrendsProps {
  memberTrends: MemberMonthlyTrend[];
  financeTrends: FinanceMonthlyTrend[];
  attendanceTrends: AttendanceMonthlyTrend[];
  sacramentBreakdown: SacramentBreakdown[];
  sacramentTrends: SacramentMonthlyTrend[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function BranchAnalyticsTrends({
  memberTrends,
  financeTrends,
  attendanceTrends,
  sacramentBreakdown,
  sacramentTrends,
}: BranchAnalyticsTrendsProps) {
  // Format data for charts
  const formattedMemberTrends = memberTrends.map(trend => ({
    ...trend,
    monthName: monthNames[trend.month - 1],
    label: `${monthNames[trend.month - 1]} ${trend.year}`,
  }));

  const formattedFinanceTrends = financeTrends.map(trend => ({
    ...trend,
    monthName: monthNames[trend.month - 1],
    label: `${monthNames[trend.month - 1]} ${trend.year}`,
    contributionsK: Math.round(trend.contributions / 1000),
    expensesK: Math.round(trend.expenses / 1000),
    netIncomeK: Math.round(trend.netIncome / 1000),
  }));

  const formattedAttendanceTrends = attendanceTrends.map(trend => ({
    ...trend,
    monthName: monthNames[trend.month - 1],
    label: `${monthNames[trend.month - 1]} ${trend.year}`,
  }));

  const formattedSacramentTrends = sacramentTrends.map(trend => ({
    ...trend,
    monthName: monthNames[trend.month - 1],
  }));

  return (
    <div className="space-y-8">
      {/* Member Growth Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📈 Member Growth Trends (12 Months)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedMemberTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="monthName" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalMembers" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Total Members"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="newMembers" 
                stroke="#10B981" 
                strokeWidth={2}
                name="New Members"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          💰 Financial Trends (12 Months) - in thousands
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedFinanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="monthName" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [`${value}k`, name]}
              />
              <Legend />
              <Bar 
                dataKey="contributionsK" 
                fill="#10B981" 
                name="Contributions"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="expensesK" 
                fill="#EF4444" 
                name="Expenses"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="netIncomeK" 
                fill="#3B82F6" 
                name="Net Income"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Trends */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          👥 Attendance Trends (12 Months)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedAttendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="monthName" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalAttendance" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Total Attendance"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="uniqueAttendees" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Unique Attendees"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sacrament Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sacrament Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            ⛪ Sacrament Breakdown
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sacramentBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count, percent }) => 
                    `${type}: ${count} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {sacramentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sacrament Monthly Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📊 Monthly Sacrament Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedSacramentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="monthName" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#EC4899" 
                  name="Sacraments"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
