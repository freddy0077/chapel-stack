import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ChevronUpIcon, 
  ChevronDownIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

// Mock attendance data for demo purposes
const mockAttendanceData = {
  weekly: [
    { date: '2025-03-02', 'St. Mary\'s Cathedral': 452, 'Sacred Heart Parish': 328, 'St. Joseph\'s Church': 276, 'Holy Trinity Church': 189, 'St. Peter\'s Parish': 224, 'Good Shepherd Church': 165 },
    { date: '2025-03-09', 'St. Mary\'s Cathedral': 468, 'Sacred Heart Parish': 342, 'St. Joseph\'s Church': 289, 'Holy Trinity Church': 201, 'St. Peter\'s Parish': 231, 'Good Shepherd Church': 172 },
    { date: '2025-03-16', 'St. Mary\'s Cathedral': 487, 'Sacred Heart Parish': 355, 'St. Joseph\'s Church': 294, 'Holy Trinity Church': 210, 'St. Peter\'s Parish': 240, 'Good Shepherd Church': 169 },
    { date: '2025-03-23', 'St. Mary\'s Cathedral': 502, 'Sacred Heart Parish': 367, 'St. Joseph\'s Church': 301, 'Holy Trinity Church': 218, 'St. Peter\'s Parish': 247, 'Good Shepherd Church': 178 },
    { date: '2025-03-30', 'St. Mary\'s Cathedral': 516, 'Sacred Heart Parish': 371, 'St. Joseph\'s Church': 308, 'Holy Trinity Church': 225, 'St. Peter\'s Parish': 252, 'Good Shepherd Church': 185 },
    { date: '2025-04-06', 'St. Mary\'s Cathedral': 531, 'Sacred Heart Parish': 386, 'St. Joseph\'s Church': 314, 'Holy Trinity Church': 232, 'St. Peter\'s Parish': 259, 'Good Shepherd Church': 192 }
  ],
  monthly: [
    { month: 'January', year: 2025, total: 9250, 'St. Mary\'s Cathedral': 2150, 'Sacred Heart Parish': 1850, 'St. Joseph\'s Church': 1520, 'Holy Trinity Church': 1230, 'St. Peter\'s Parish': 1420, 'Good Shepherd Church': 1080 },
    { month: 'February', year: 2025, total: 9540, 'St. Mary\'s Cathedral': 2220, 'Sacred Heart Parish': 1910, 'St. Joseph\'s Church': 1570, 'Holy Trinity Church': 1260, 'St. Peter\'s Parish': 1460, 'Good Shepherd Church': 1120 },
    { month: 'March', year: 2025, total: 10280, 'St. Mary\'s Cathedral': 2390, 'Sacred Heart Parish': 2050, 'St. Joseph\'s Church': 1680, 'Holy Trinity Church': 1350, 'St. Peter\'s Parish': 1570, 'Good Shepherd Church': 1240 }
  ],
  byService: [
    { service: 'Sunday Morning', 'St. Mary\'s Cathedral': 320, 'Sacred Heart Parish': 245, 'St. Joseph\'s Church': 192, 'Holy Trinity Church': 146, 'St. Peter\'s Parish': 178, 'Good Shepherd Church': 128 },
    { service: 'Sunday Evening', 'St. Mary\'s Cathedral': 215, 'Sacred Heart Parish': 162, 'St. Joseph\'s Church': 132, 'Holy Trinity Church': 98, 'St. Peter\'s Parish': 115, 'Good Shepherd Church': 82 },
    { service: 'Weekday', 'St. Mary\'s Cathedral': 76, 'Sacred Heart Parish': 54, 'St. Joseph\'s Church': 42, 'Holy Trinity Church': 31, 'St. Peter\'s Parish': 38, 'Good Shepherd Church': 28 }
  ]
};

// Branch colors for consistent chart styling
const branchColors = {
  'St. Mary\'s Cathedral': '#4F46E5', // indigo-600
  'Sacred Heart Parish': '#0891B2', // cyan-600
  'St. Joseph\'s Church': '#059669', // emerald-600
  'Holy Trinity Church': '#D97706', // amber-600
  'St. Peter\'s Parish': '#DC2626', // red-600
  'Good Shepherd Church': '#7C3AED' // violet-600
};

type AttendanceReportSectionProps = {
  selectedBranches: string[];
  dateRange: { start: string; end: string };
};

// Map of branch IDs to names
const branchIdToName = {
  'branch-001': 'St. Mary\'s Cathedral',
  'branch-002': 'Sacred Heart Parish',
  'branch-003': 'St. Joseph\'s Church',
  'branch-004': 'Holy Trinity Church',
  'branch-005': 'St. Peter\'s Parish',
  'branch-006': 'Good Shepherd Church'
};

export default function AttendanceReportSection({ 
  selectedBranches, 
  dateRange 
}: AttendanceReportSectionProps) {
  const [showWeekly, setShowWeekly] = useState(true);
  const [showMonthly, setShowMonthly] = useState(true);
  const [showServiceType, setShowServiceType] = useState(true);

  // Get branch names from selected IDs
  const selectedBranchNames = selectedBranches.map(id => branchIdToName[id as keyof typeof branchIdToName]);

  // Filter data based on selected branches
  const filteredWeeklyData = mockAttendanceData.weekly.map(weekData => {
    const filteredData = { date: weekData.date };
    Object.keys(weekData).forEach(key => {
      if (key === 'date' || selectedBranchNames.includes(key) || selectedBranchNames.length === 0) {
        filteredData[key] = weekData[key];
      }
    });
    return filteredData;
  });

  const filteredMonthlyData = mockAttendanceData.monthly.map(monthData => {
    const filteredData = { month: monthData.month, year: monthData.year, total: monthData.total };
    Object.keys(monthData).forEach(key => {
      if (['month', 'year', 'total'].includes(key) || selectedBranchNames.includes(key) || selectedBranchNames.length === 0) {
        filteredData[key] = monthData[key];
      }
    });
    return filteredData;
  });

  const filteredServiceData = mockAttendanceData.byService.map(serviceData => {
    const filteredData = { service: serviceData.service };
    Object.keys(serviceData).forEach(key => {
      if (key === 'service' || selectedBranchNames.includes(key) || selectedBranchNames.length === 0) {
        filteredData[key] = serviceData[key];
      }
    });
    return filteredData;
  });

  // Calculate totals and averages
  const calculateTotalAttendance = () => {
    let total = 0;
    mockAttendanceData.weekly.forEach(week => {
      selectedBranchNames.forEach(branch => {
        if (week[branch]) {
          total += week[branch];
        }
      });
    });
    return total;
  };

  const calculateAverageWeeklyAttendance = () => {
    if (mockAttendanceData.weekly.length === 0) return 0;
    return Math.round(calculateTotalAttendance() / mockAttendanceData.weekly.length);
  };

  const getPercentageChange = () => {
    if (mockAttendanceData.weekly.length < 2) return 0;
    
    const firstWeek = mockAttendanceData.weekly[0];
    const lastWeek = mockAttendanceData.weekly[mockAttendanceData.weekly.length - 1];
    
    let firstTotal = 0;
    let lastTotal = 0;
    
    selectedBranchNames.forEach(branch => {
      if (firstWeek[branch]) firstTotal += firstWeek[branch];
      if (lastWeek[branch]) lastTotal += lastWeek[branch];
    });
    
    if (firstTotal === 0) return 0;
    return Math.round(((lastTotal - firstTotal) / firstTotal) * 100);
  };

  // If no branches are selected, show all branches
  const branchesToDisplay = selectedBranchNames.length > 0 ? selectedBranchNames : Object.values(branchIdToName);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-indigo-100 dark:bg-indigo-900/30">
              <ChartBarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Attendance</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{calculateTotalAttendance().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
              <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Weekly Attendance</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{calculateAverageWeeklyAttendance().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30">
              <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Branches Included</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{branchesToDisplay.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className={`rounded-full p-3 ${getPercentageChange() >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <ChartBarIcon className={`h-6 w-6 ${getPercentageChange() >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Trend</h2>
              <p className={`mt-1 text-2xl font-semibold ${getPercentageChange() >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {getPercentageChange() >= 0 ? '+' : ''}{getPercentageChange()}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Attendance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Weekly Attendance</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowWeekly(!showWeekly)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showWeekly ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {showWeekly && (
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  {branchesToDisplay.map(branch => (
                    <th key={branch} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {branch}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredWeeklyData.map((week, index) => (
                  <tr key={week.date} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    {branchesToDisplay.map(branch => (
                      <td key={`${week.date}-${branch}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {week[branch] || 0}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {branchesToDisplay.reduce((total, branch) => total + (week[branch] || 0), 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly Attendance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Attendance</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowMonthly(!showMonthly)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showMonthly ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {showMonthly && (
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Month
                  </th>
                  {branchesToDisplay.map(branch => (
                    <th key={branch} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {branch}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMonthlyData.map((month, index) => (
                  <tr key={`${month.month}-${month.year}`} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {month.month} {month.year}
                    </td>
                    {branchesToDisplay.map(branch => (
                      <td key={`${month.month}-${month.year}-${branch}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {month[branch] || 0}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {month.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Service Type Attendance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Attendance by Service Type</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowServiceType(!showServiceType)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showServiceType ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {showServiceType && (
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service Type
                  </th>
                  {branchesToDisplay.map(branch => (
                    <th key={branch} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {branch}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServiceData.map((service, index) => (
                  <tr key={service.service} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {service.service}
                    </td>
                    {branchesToDisplay.map(branch => (
                      <td key={`${service.service}-${branch}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {service[branch] || 0}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {branchesToDisplay.reduce((total, branch) => total + (service[branch] || 0), 0)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 dark:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Total All Services
                  </td>
                  {branchesToDisplay.map(branch => (
                    <td key={`total-${branch}`} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {filteredServiceData.reduce((total, service) => total + (service[branch] || 0), 0)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredServiceData.reduce((total, service) => 
                      total + branchesToDisplay.reduce((branchTotal, branch) => branchTotal + (service[branch] || 0), 0)
                    , 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
