import { useState } from 'react';
import { 
  UserGroupIcon,
  UserPlusIcon,
  UserMinusIcon,
  ChevronUpIcon, 
  ChevronDownIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

// Mock membership data for demo purposes
const mockMembershipData = {
  totals: [
    { branch: 'St. Mary\'s Cathedral', total: 1250, active: 1082, inactive: 168, newMembers: 87, departed: 35 },
    { branch: 'Sacred Heart Parish', total: 980, active: 876, inactive: 104, newMembers: 65, departed: 28 },
    { branch: 'St. Joseph\'s Church', total: 725, active: 652, inactive: 73, newMembers: 48, departed: 21 },
    { branch: 'Holy Trinity Church', total: 540, active: 475, inactive: 65, newMembers: 36, departed: 19 },
    { branch: 'St. Peter\'s Parish', total: 620, active: 558, inactive: 62, newMembers: 41, departed: 23 },
    { branch: 'Good Shepherd Church', total: 485, active: 422, inactive: 63, newMembers: 32, departed: 18 }
  ],
  demographics: [
    { branch: 'St. Mary\'s Cathedral', under18: 285, age18to35: 365, age36to55: 390, over55: 210 },
    { branch: 'Sacred Heart Parish', under18: 230, age18to35: 285, age36to55: 305, over55: 160 },
    { branch: 'St. Joseph\'s Church', under18: 165, age18to35: 215, age36to55: 225, over55: 120 },
    { branch: 'Holy Trinity Church', under18: 125, age18to35: 160, age36to55: 165, over55: 90 },
    { branch: 'St. Peter\'s Parish', under18: 140, age18to35: 180, age36to55: 195, over55: 105 },
    { branch: 'Good Shepherd Church', under18: 110, age18to35: 145, age36to55: 150, over55: 80 }
  ],
  growth: [
    { month: 'January', year: 2025, 'St. Mary\'s Cathedral': 28, 'Sacred Heart Parish': 21, 'St. Joseph\'s Church': 16, 'Holy Trinity Church': 12, 'St. Peter\'s Parish': 14, 'Good Shepherd Church': 10 },
    { month: 'February', year: 2025, 'St. Mary\'s Cathedral': 31, 'Sacred Heart Parish': 23, 'St. Joseph\'s Church': 17, 'Holy Trinity Church': 13, 'St. Peter\'s Parish': 15, 'Good Shepherd Church': 11 },
    { month: 'March', year: 2025, 'St. Mary\'s Cathedral': 34, 'Sacred Heart Parish': 25, 'St. Joseph\'s Church': 19, 'Holy Trinity Church': 14, 'St. Peter\'s Parish': 16, 'Good Shepherd Church': 12 }
  ]
};

type MembershipReportSectionProps = {
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

export default function MembershipReportSection({ 
  selectedBranches, 
  dateRange 
}: MembershipReportSectionProps) {
  const [showTotals, setShowTotals] = useState(true);
  const [showDemographics, setShowDemographics] = useState(true);
  const [showGrowth, setShowGrowth] = useState(true);

  // Get branch names from selected IDs
  const selectedBranchNames = selectedBranches.map(id => branchIdToName[id as keyof typeof branchIdToName]);

  // Filter data based on selected branches
  const filteredTotalsData = mockMembershipData.totals.filter(item => 
    selectedBranchNames.includes(item.branch) || selectedBranchNames.length === 0
  );
  
  const filteredDemographicsData = mockMembershipData.demographics.filter(item => 
    selectedBranchNames.includes(item.branch) || selectedBranchNames.length === 0
  );

  const filteredGrowthData = mockMembershipData.growth.map(monthData => {
    const filteredData = { month: monthData.month, year: monthData.year };
    Object.keys(monthData).forEach(key => {
      if (['month', 'year'].includes(key) || selectedBranchNames.includes(key) || selectedBranchNames.length === 0) {
        filteredData[key] = monthData[key];
      }
    });
    return filteredData;
  });

  // Calculate totals
  const calculateTotalMembers = () => {
    return filteredTotalsData.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateActiveMembers = () => {
    return filteredTotalsData.reduce((sum, item) => sum + item.active, 0);
  };

  const calculateNewMembers = () => {
    return filteredTotalsData.reduce((sum, item) => sum + item.newMembers, 0);
  };

  const calculateDepartedMembers = () => {
    return filteredTotalsData.reduce((sum, item) => sum + item.departed, 0);
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
              <UserGroupIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{calculateTotalMembers().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
              <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Members</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{calculateActiveMembers().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30">
              <UserPlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">New Members (YTD)</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{calculateNewMembers()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-amber-100 dark:bg-amber-900/30">
              <UserMinusIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Departed (YTD)</h2>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{calculateDepartedMembers()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Totals Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Membership Totals</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowTotals(!showTotals)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showTotals ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {showTotals && (
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Inactive
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    New (YTD)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Departed (YTD)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Net Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTotalsData.map((branch, index) => (
                  <tr key={branch.branch} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {branch.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.active.toLocaleString()} ({Math.round((branch.active / branch.total) * 100)}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.inactive.toLocaleString()} ({Math.round((branch.inactive / branch.total) * 100)}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.newMembers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {branch.departed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`${branch.newMembers - branch.departed > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {branch.newMembers - branch.departed > 0 ? '+' : ''}{branch.newMembers - branch.departed}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-50 dark:bg-gray-750 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Total All Branches
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredTotalsData.reduce((sum, branch) => sum + branch.total, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredTotalsData.reduce((sum, branch) => sum + branch.active, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredTotalsData.reduce((sum, branch) => sum + branch.inactive, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredTotalsData.reduce((sum, branch) => sum + branch.newMembers, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredTotalsData.reduce((sum, branch) => sum + branch.departed, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`${filteredTotalsData.reduce((sum, branch) => sum + (branch.newMembers - branch.departed), 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {filteredTotalsData.reduce((sum, branch) => sum + (branch.newMembers - branch.departed), 0) > 0 ? '+' : ''}
                      {filteredTotalsData.reduce((sum, branch) => sum + (branch.newMembers - branch.departed), 0)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Demographics Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Membership Demographics</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowDemographics(!showDemographics)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showDemographics ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {showDemographics && (
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Under 18
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    18-35
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    36-55
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Over 55
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDemographicsData.map((branch, index) => {
                  const total = branch.under18 + branch.age18to35 + branch.age36to55 + branch.over55;
                  return (
                    <tr key={branch.branch} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {branch.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {branch.under18} ({Math.round((branch.under18 / total) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {branch.age18to35} ({Math.round((branch.age18to35 / total) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {branch.age36to55} ({Math.round((branch.age36to55 / total) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {branch.over55} ({Math.round((branch.over55 / total) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {total}
                      </td>
                    </tr>
                  );
                })}
                {/* Totals row */}
                <tr className="bg-gray-50 dark:bg-gray-750 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Total All Branches
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredDemographicsData.reduce((sum, branch) => sum + branch.under18, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredDemographicsData.reduce((sum, branch) => sum + branch.age18to35, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredDemographicsData.reduce((sum, branch) => sum + branch.age36to55, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredDemographicsData.reduce((sum, branch) => sum + branch.over55, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredDemographicsData.reduce((sum, branch) => 
                      sum + branch.under18 + branch.age18to35 + branch.age36to55 + branch.over55, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly Growth Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Growth</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowGrowth(!showGrowth)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showGrowth ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {showGrowth && (
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
                {filteredGrowthData.map((month, index) => (
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
                      {branchesToDisplay.reduce((total, branch) => total + (month[branch] || 0), 0)}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-50 dark:bg-gray-750 font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Total
                  </td>
                  {branchesToDisplay.map(branch => (
                    <td key={`total-${branch}`} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {filteredGrowthData.reduce((total, month) => total + (month[branch] || 0), 0)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {filteredGrowthData.reduce((total, month) => 
                      total + branchesToDisplay.reduce((branchTotal, branch) => branchTotal + (month[branch] || 0), 0)
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
