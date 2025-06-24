import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Mock data for confirmation records
const mockConfirmationData = [
  { 
    month: 'January', 
    year: 2025,
    'St. Mary\'s Cathedral': { total: 7, youth: 6, adults: 1 },
    'Sacred Heart Parish': { total: 5, youth: 4, adults: 1 },
    'St. Joseph\'s Church': { total: 4, youth: 4, adults: 0 },
    'Holy Trinity Church': { total: 3, youth: 2, adults: 1 },
    'St. Peter\'s Parish': { total: 4, youth: 3, adults: 1 },
    'Good Shepherd Church': { total: 2, youth: 2, adults: 0 }
  },
  { 
    month: 'February', 
    year: 2025,
    'St. Mary\'s Cathedral': { total: 8, youth: 7, adults: 1 },
    'Sacred Heart Parish': { total: 6, youth: 5, adults: 1 },
    'St. Joseph\'s Church': { total: 5, youth: 4, adults: 1 },
    'Holy Trinity Church': { total: 3, youth: 3, adults: 0 },
    'St. Peter\'s Parish': { total: 4, youth: 3, adults: 1 },
    'Good Shepherd Church': { total: 3, youth: 3, adults: 0 }
  },
  { 
    month: 'March', 
    year: 2025,
    'St. Mary\'s Cathedral': { total: 10, youth: 8, adults: 2 },
    'Sacred Heart Parish': { total: 8, youth: 7, adults: 1 },
    'St. Joseph\'s Church': { total: 6, youth: 5, adults: 1 },
    'Holy Trinity Church': { total: 4, youth: 3, adults: 1 },
    'St. Peter\'s Parish': { total: 5, youth: 4, adults: 1 },
    'Good Shepherd Church': { total: 3, youth: 3, adults: 0 }
  }
];

// Most popular confirmation names
const popularNames = [
  { name: 'Michael', count: 24 },
  { name: 'Francis', count: 18 },
  { name: 'Teresa', count: 17 },
  { name: 'Catherine', count: 15 },
  { name: 'Anthony', count: 13 }
];

type ConfirmationTableProps = {
  branchesToDisplay: string[];
  dateRange: { start: string; end: string };
};

export default function ConfirmationTable({
  branchesToDisplay,
  dateRange
}: ConfirmationTableProps) {
  
  // Helper functions to calculate totals
  const calculateMonthTotal = (month: any) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateMonthGroupTotal = (month: any, group: 'youth' | 'adults') => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.[group] || 0);
    }, 0);
  };

  const calculateBranchTotal = (branch: string) => {
    return mockConfirmationData.reduce((total, month) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateBranchGroupTotal = (branch: string, group: 'youth' | 'adults') => {
    return mockConfirmationData.reduce((total, month) => {
      return total + (month[branch]?.[group] || 0);
    }, 0);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmation Statistics</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Records by month and age group</p>
        </div>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
          Export Data
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-750">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Month
            </th>
            {branchesToDisplay.map(branch => (
              <th key={branch} scope="col" colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {branch}
              </th>
            ))}
            <th scope="col" colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-750">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              &nbsp;
            </th>
            {branchesToDisplay.map(branch => (
              <React.Fragment key={`header-${branch}`}>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Youth
                </th>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Adult
                </th>
              </React.Fragment>
            ))}
            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Youth
            </th>
            <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Adult
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {mockConfirmationData.map((month, index) => (
            <tr key={`${month.month}-${month.year}`} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {month.month} {month.year}
              </td>
              {branchesToDisplay.map(branch => (
                <React.Fragment key={`data-${month.month}-${branch}`}>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.total || 0}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.youth || 0}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.adults || 0}
                  </td>
                </React.Fragment>
              ))}
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTotal(month)}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthGroupTotal(month, 'youth')}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthGroupTotal(month, 'adults')}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 dark:bg-gray-750">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              Total
            </td>
            {branchesToDisplay.map(branch => (
              <React.Fragment key={`total-${branch}`}>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTotal(branch)}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchGroupTotal(branch, 'youth')}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchGroupTotal(branch, 'adults')}
                </td>
              </React.Fragment>
            ))}
            <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchTotal(branch), 0)}
            </td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchGroupTotal(branch, 'youth'), 0)}
            </td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchGroupTotal(branch, 'adults'), 0)}
            </td>
          </tr>
        </tfoot>
      </table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmation Trends</h3>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-300">
            <ul className="list-disc pl-5 space-y-1">
              <li>Youth confirmations account for {Math.round((branchesToDisplay.reduce((total, branch) => total + calculateBranchGroupTotal(branch, 'youth'), 0) / branchesToDisplay.reduce((total, branch) => total + calculateBranchTotal(branch), 0)) * 100)}% of all confirmations</li>
              <li>March shows the highest number of confirmations</li>
              <li>St. Mary's Cathedral has conducted the most confirmation ceremonies</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popular Confirmation Names</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {popularNames.map((nameData, index) => (
                  <tr key={nameData.name} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{nameData.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">{nameData.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
