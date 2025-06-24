import React from 'react';
import { ArrowDownTrayIcon, HeartIcon } from '@heroicons/react/24/outline';

// Mock data for marriage records
const mockMarriageData = [
  { 
    month: 'January', 
    year: 2025,
    'St. Mary\'s Cathedral': { total: 3, firstTime: 2, convalidation: 1, withMass: 2, withoutMass: 1 },
    'Sacred Heart Parish': { total: 2, firstTime: 2, convalidation: 0, withMass: 1, withoutMass: 1 },
    'St. Joseph\'s Church': { total: 2, firstTime: 1, convalidation: 1, withMass: 2, withoutMass: 0 },
    'Holy Trinity Church': { total: 1, firstTime: 1, convalidation: 0, withMass: 1, withoutMass: 0 },
    'St. Peter\'s Parish': { total: 2, firstTime: 1, convalidation: 1, withMass: 1, withoutMass: 1 },
    'Good Shepherd Church': { total: 1, firstTime: 1, convalidation: 0, withMass: 1, withoutMass: 0 }
  },
  { 
    month: 'February', 
    year: 2025,
    'St. Mary\'s Cathedral': { total: 4, firstTime: 3, convalidation: 1, withMass: 3, withoutMass: 1 },
    'Sacred Heart Parish': { total: 3, firstTime: 2, convalidation: 1, withMass: 2, withoutMass: 1 },
    'St. Joseph\'s Church': { total: 2, firstTime: 2, convalidation: 0, withMass: 1, withoutMass: 1 },
    'Holy Trinity Church': { total: 1, firstTime: 1, convalidation: 0, withMass: 1, withoutMass: 0 },
    'St. Peter\'s Parish': { total: 1, firstTime: 1, convalidation: 0, withMass: 0, withoutMass: 1 },
    'Good Shepherd Church': { total: 1, firstTime: 0, convalidation: 1, withMass: 1, withoutMass: 0 }
  },
  { 
    month: 'March', 
    year: 2025,
    'St. Mary\'s Cathedral': { total: 5, firstTime: 4, convalidation: 1, withMass: 4, withoutMass: 1 },
    'Sacred Heart Parish': { total: 3, firstTime: 2, convalidation: 1, withMass: 2, withoutMass: 1 },
    'St. Joseph\'s Church': { total: 2, firstTime: 1, convalidation: 1, withMass: 2, withoutMass: 0 },
    'Holy Trinity Church': { total: 2, firstTime: 2, convalidation: 0, withMass: 1, withoutMass: 1 },
    'St. Peter\'s Parish': { total: 2, firstTime: 1, convalidation: 1, withMass: 2, withoutMass: 0 },
    'Good Shepherd Church': { total: 1, firstTime: 1, convalidation: 0, withMass: 1, withoutMass: 0 }
  }
];

// Upcoming anniversary data
const upcomingAnniversaries = [
  { couple: 'Robert & Maria Smith', branch: 'St. Mary\'s Cathedral', date: '2020-04-15', years: 5 },
  { couple: 'James & Elizabeth Johnson', branch: 'St. Mary\'s Cathedral', date: '2015-05-10', years: 10 },
  { couple: 'Michael & Catherine Brown', branch: 'Sacred Heart Parish', date: '2015-05-23', years: 10 },
  { couple: 'David & Jennifer Wilson', branch: 'St. Joseph\'s Church', date: '2000-06-12', years: 25 },
  { couple: 'Thomas & Susan Davis', branch: 'Holy Trinity Church', date: '2020-04-30', years: 5 },
  { couple: 'William & Patricia Martinez', branch: 'St. Peter\'s Parish', date: '1975-05-18', years: 50 }
];

type MarriageTableProps = {
  branchesToDisplay: string[];
  dateRange: { start: string; end: string };
};

export default function MarriageTable({
  branchesToDisplay,
  dateRange
}: MarriageTableProps) {
  
  // Helper functions to calculate totals
  const calculateMonthTotal = (month: any) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateMonthTypeTotal = (month: any, type: 'firstTime' | 'convalidation' | 'withMass' | 'withoutMass') => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.[type] || 0);
    }, 0);
  };

  const calculateBranchTotal = (branch: string) => {
    return mockMarriageData.reduce((total, month) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateBranchTypeTotal = (branch: string, type: 'firstTime' | 'convalidation' | 'withMass' | 'withoutMass') => {
    return mockMarriageData.reduce((total, month) => {
      return total + (month[branch]?.[type] || 0);
    }, 0);
  };

  // Filter anniversaries by selected branches
  const filteredAnniversaries = upcomingAnniversaries.filter(anniversary => 
    branchesToDisplay.includes(anniversary.branch) || branchesToDisplay.length === 0
  );

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Marriage Statistics</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Records by month and marriage type</p>
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
              <th key={branch} scope="col" colSpan={5} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {branch}
              </th>
            ))}
            <th scope="col" colSpan={5} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-750">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              &nbsp;
            </th>
            {branchesToDisplay.map(branch => (
              <React.Fragment key={`header-${branch}`}>
                <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  First
                </th>
                <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Conv
                </th>
                <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mass
                </th>
                <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  No Mass
                </th>
              </React.Fragment>
            ))}
            <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              First
            </th>
            <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Conv
            </th>
            <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Mass
            </th>
            <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              No Mass
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {mockMarriageData.map((month, index) => (
            <tr key={`${month.month}-${month.year}`} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {month.month} {month.year}
              </td>
              {branchesToDisplay.map(branch => (
                <React.Fragment key={`data-${month.month}-${branch}`}>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.total || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.firstTime || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.convalidation || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.withMass || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.withoutMass || 0}
                  </td>
                </React.Fragment>
              ))}
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTotal(month)}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTypeTotal(month, 'firstTime')}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTypeTotal(month, 'convalidation')}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTypeTotal(month, 'withMass')}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTypeTotal(month, 'withoutMass')}
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
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTotal(branch)}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTypeTotal(branch, 'firstTime')}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTypeTotal(branch, 'convalidation')}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTypeTotal(branch, 'withMass')}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTypeTotal(branch, 'withoutMass')}
                </td>
              </React.Fragment>
            ))}
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchTotal(branch), 0)}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchTypeTotal(branch, 'firstTime'), 0)}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchTypeTotal(branch, 'convalidation'), 0)}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchTypeTotal(branch, 'withMass'), 0)}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce((total, branch) => total + calculateBranchTypeTotal(branch, 'withoutMass'), 0)}
            </td>
          </tr>
        </tfoot>
      </table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Marriage Trends</h3>
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 text-sm text-pink-800 dark:text-pink-300">
            <ul className="list-disc pl-5 space-y-1">
              <li>First-time marriages account for {Math.round((branchesToDisplay.reduce((total, branch) => total + calculateBranchTypeTotal(branch, 'firstTime'), 0) / branchesToDisplay.reduce((total, branch) => total + calculateBranchTotal(branch), 0)) * 100)}% of all marriages</li>
              <li>Marriages with Mass represent {Math.round((branchesToDisplay.reduce((total, branch) => total + calculateBranchTypeTotal(branch, 'withMass'), 0) / branchesToDisplay.reduce((total, branch) => total + calculateBranchTotal(branch), 0)) * 100)}% of ceremonies</li>
              <li>Marriage ceremonies increase by about 25% from January to March</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="inline-flex items-center">
              <HeartIcon className="h-4 w-4 mr-1 text-pink-500" />
              Upcoming Significant Anniversaries
            </span>
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Couple</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Years</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAnniversaries.length > 0 ? (
                  filteredAnniversaries.map((anniversary, index) => (
                    <tr key={`${anniversary.couple}-${anniversary.date}`} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{anniversary.couple}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{anniversary.branch}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Date(anniversary.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${anniversary.years === 5 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 
                           anniversary.years === 10 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                           anniversary.years === 25 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                           'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'}`}
                        >
                          {anniversary.years}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No upcoming anniversaries for the selected branches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
