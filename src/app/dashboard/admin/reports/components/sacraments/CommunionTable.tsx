import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Mock data for first communion records
const mockCommunionData = [
  {
    month: "January",
    year: 2025,
    "St. Mary's Cathedral": {
      total: 8,
      ages7to10: 6,
      ages11to14: 2,
      adults: 0,
    },
    "Sacred Heart Parish": { total: 7, ages7to10: 5, ages11to14: 1, adults: 1 },
    "St. Joseph's Church": { total: 5, ages7to10: 4, ages11to14: 1, adults: 0 },
    "Holy Trinity Church": { total: 3, ages7to10: 2, ages11to14: 1, adults: 0 },
    "St. Peter's Parish": { total: 4, ages7to10: 3, ages11to14: 1, adults: 0 },
    "Good Shepherd Church": {
      total: 3,
      ages7to10: 2,
      ages11to14: 1,
      adults: 0,
    },
  },
  {
    month: "February",
    year: 2025,
    "St. Mary's Cathedral": {
      total: 9,
      ages7to10: 7,
      ages11to14: 1,
      adults: 1,
    },
    "Sacred Heart Parish": { total: 6, ages7to10: 4, ages11to14: 2, adults: 0 },
    "St. Joseph's Church": { total: 5, ages7to10: 3, ages11to14: 2, adults: 0 },
    "Holy Trinity Church": { total: 2, ages7to10: 2, ages11to14: 0, adults: 0 },
    "St. Peter's Parish": { total: 5, ages7to10: 3, ages11to14: 2, adults: 0 },
    "Good Shepherd Church": {
      total: 2,
      ages7to10: 2,
      ages11to14: 0,
      adults: 0,
    },
  },
  {
    month: "March",
    year: 2025,
    "St. Mary's Cathedral": {
      total: 12,
      ages7to10: 8,
      ages11to14: 3,
      adults: 1,
    },
    "Sacred Heart Parish": { total: 9, ages7to10: 6, ages11to14: 2, adults: 1 },
    "St. Joseph's Church": { total: 7, ages7to10: 5, ages11to14: 2, adults: 0 },
    "Holy Trinity Church": { total: 4, ages7to10: 3, ages11to14: 1, adults: 0 },
    "St. Peter's Parish": { total: 6, ages7to10: 4, ages11to14: 2, adults: 0 },
    "Good Shepherd Church": {
      total: 4,
      ages7to10: 3,
      ages11to14: 1,
      adults: 0,
    },
  },
];

type CommunionTableProps = {
  branchesToDisplay: string[];
};

export default function CommunionTable({
  branchesToDisplay,
}: CommunionTableProps) {
  // Helper functions to calculate totals
  const calculateMonthTotal = (month: unknown) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateMonthAgeGroupTotal = (
    month: unknown,
    ageGroup: "ages7to10" | "ages11to14" | "adults",
  ) => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (month[branch]?.[ageGroup] || 0);
    }, 0);
  };

  const calculateBranchTotal = (branch: string) => {
    return mockCommunionData.reduce((total, month) => {
      return total + (month[branch]?.total || 0);
    }, 0);
  };

  const calculateBranchAgeGroupTotal = (
    branch: string,
    ageGroup: "ages7to10" | "ages11to14" | "adults",
  ) => {
    return mockCommunionData.reduce((total, month) => {
      return total + (month[branch]?.[ageGroup] || 0);
    }, 0);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            First Communion Statistics
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Records by month and age group
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
                colSpan={4}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {branch}
              </th>
            ))}
            <th
              scope="col"
              colSpan={4}
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
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  7-10
                </th>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  11-14
                </th>
                <th
                  scope="col"
                  className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Adult
                </th>
              </React.Fragment>
            ))}
            <th
              scope="col"
              className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Total
            </th>
            <th
              scope="col"
              className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              7-10
            </th>
            <th
              scope="col"
              className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              11-14
            </th>
            <th
              scope="col"
              className="px-1 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Adult
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {mockCommunionData.map((month, index) => (
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
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.total || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.ages7to10 || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.ages11to14 || 0}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                    {month[branch]?.adults || 0}
                  </td>
                </React.Fragment>
              ))}
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthTotal(month)}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthAgeGroupTotal(month, "ages7to10")}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthAgeGroupTotal(month, "ages11to14")}
              </td>
              <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                {calculateMonthAgeGroupTotal(month, "adults")}
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
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchTotal(branch)}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchAgeGroupTotal(branch, "ages7to10")}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchAgeGroupTotal(branch, "ages11to14")}
                </td>
                <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
                  {calculateBranchAgeGroupTotal(branch, "adults")}
                </td>
              </React.Fragment>
            ))}
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) => total + calculateBranchTotal(branch),
                0,
              )}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) =>
                  total + calculateBranchAgeGroupTotal(branch, "ages7to10"),
                0,
              )}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) =>
                  total + calculateBranchAgeGroupTotal(branch, "ages11to14"),
                0,
              )}
            </td>
            <td className="px-1 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900 dark:text-white">
              {branchesToDisplay.reduce(
                (total, branch) =>
                  total + calculateBranchAgeGroupTotal(branch, "adults"),
                0,
              )}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          First Communion Trends
        </h3>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-sm text-indigo-800 dark:text-indigo-300">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Most first communions occur in the 7-10 age group (
              {Math.round(
                (branchesToDisplay.reduce(
                  (total, branch) =>
                    total + calculateBranchAgeGroupTotal(branch, "ages7to10"),
                  0,
                ) /
                  branchesToDisplay.reduce(
                    (total, branch) => total + calculateBranchTotal(branch),
                    0,
                  )) *
                  100,
              )}
              %)
            </li>
            <li>
              March shows the highest number of first communions, likely due to
              seasonal preparation
            </li>
            <li>
              Adult first communions represent only{" "}
              {Math.round(
                (branchesToDisplay.reduce(
                  (total, branch) =>
                    total + calculateBranchAgeGroupTotal(branch, "adults"),
                  0,
                ) /
                  branchesToDisplay.reduce(
                    (total, branch) => total + calculateBranchTotal(branch),
                    0,
                  )) *
                  100,
              )}
              % of total first communions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
