import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Mock data for baptism records
const mockBaptismData = [
  {
    month: "January",
    year: 2025,
    "St. Mary's Cathedral": { total: 12, children: 9, adults: 3 },
    "Sacred Heart Parish": { total: 8, children: 6, adults: 2 },
    "St. Joseph's Church": { total: 6, children: 5, adults: 1 },
    "Holy Trinity Church": { total: 4, children: 3, adults: 1 },
    "St. Peter's Parish": { total: 5, children: 4, adults: 1 },
    "Good Shepherd Church": { total: 3, children: 2, adults: 1 },
  },
  {
    month: "February",
    year: 2025,
    "St. Mary's Cathedral": { total: 10, children: 8, adults: 2 },
    "Sacred Heart Parish": { total: 7, children: 5, adults: 2 },
    "St. Joseph's Church": { total: 5, children: 4, adults: 1 },
    "Holy Trinity Church": { total: 3, children: 2, adults: 1 },
    "St. Peter's Parish": { total: 6, children: 5, adults: 1 },
    "Good Shepherd Church": { total: 4, children: 3, adults: 1 },
  },
  {
    month: "March",
    year: 2025,
    "St. Mary's Cathedral": { total: 14, children: 11, adults: 3 },
    "Sacred Heart Parish": { total: 10, children: 8, adults: 2 },
    "St. Joseph's Church": { total: 8, children: 7, adults: 1 },
    "Holy Trinity Church": { total: 5, children: 4, adults: 1 },
    "St. Peter's Parish": { total: 7, children: 6, adults: 1 },
    "Good Shepherd Church": { total: 5, children: 4, adults: 1 },
  },
];

type BaptismTableProps = {
  branchesToDisplay: string[];
};

export default function BaptismTable({ branchesToDisplay }: BaptismTableProps) {
  // Calculate totals for the table footer
  const calculateTotalBaptisms = (branch: string) => {
    return mockBaptismData.reduce((total, month) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateTotalChildBaptisms = (branch: string) => {
    return mockBaptismData.reduce((total, month) => {
      return total + (month[branch]?.children || 0);
    }, 0);
  };

  const calculateTotalAdultBaptisms = (branch: string) => {
    return mockBaptismData.reduce((total, month) => {
      return total + (month[branch]?.adults || 0);
    }, 0);
  };

  const calculateMonthTotal = (month: (typeof mockBaptismData)[0]) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateMonthChildrenTotal = (month: (typeof mockBaptismData)[0]) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.children || 0);
    }, 0);
  };

  const calculateMonthAdultsTotal = (month: (typeof mockBaptismData)[0]) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.adults || 0);
    }, 0);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Monthly Statistics
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Baptism records by month and age group
          </p>
        </div>
        <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
          Export Data
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-750">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Month
            </th>
            {branchesToDisplay.map((branch) => (
              <th
                key={branch}
                scope="col"
                colSpan={3}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {branch}
              </th>
            ))}
            <th
              scope="col"
              colSpan={3}
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-750">
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              &nbsp;
            </th>
            {branchesToDisplay.map((branch) => (
              <React.Fragment key={`header-${branch}`}>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Children
                </th>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Adults
                </th>
              </React.Fragment>
            ))}
            <th
              scope="col"
              className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Total
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Children
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Adults
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {mockBaptismData.map((month, index) => (
            <tr
              key={`${month.month}-${month.year}`}
              className={
                index % 2 === 0
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-750"
              }
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {month.month} {month.year}
              </td>
              {branchesToDisplay.map((branch) => (
                <React.Fragment key={`data-${month.month}-${branch}`}>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.total || 0}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.children || 0}
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
                {calculateMonthChildrenTotal(month)}
              </td>
              <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthAdultsTotal(month)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 dark:bg-gray-750">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              Total
            </td>
            {branchesToDisplay.map((branch) => (
              <React.Fragment key={`total-${branch}`}>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateTotalBaptisms(branch)}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateTotalChildBaptisms(branch)}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateTotalAdultBaptisms(branch)}
                </td>
              </React.Fragment>
            ))}
            <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) => total + calculateTotalBaptisms(branch),
                0,
              )}
            </td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) => total + calculateTotalChildBaptisms(branch),
                0,
              )}
            </td>
            <td className="px-2 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) => total + calculateTotalAdultBaptisms(branch),
                0,
              )}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Insights
        </h3>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Child baptisms account for{" "}
              {Math.round(
                (branchesToDisplay.reduce(
                  (total, branch) =>
                    total + calculateTotalChildBaptisms(branch),
                  0,
                ) /
                  branchesToDisplay.reduce(
                    (total, branch) => total + calculateTotalBaptisms(branch),
                    0,
                  )) *
                  100,
              )}
              % of all baptisms
            </li>
            <li>
              March has the highest number of baptisms across all branches
            </li>
            <li>
              St. Mary\'s Cathedral has conducted the most baptisms this quarter
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
