import { useState } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Mock branch data for demo purposes
const mockBranches = [
  { id: 'branch-001', name: 'St. Mary\'s Cathedral' },
  { id: 'branch-002', name: 'Sacred Heart Parish' },
  { id: 'branch-003', name: 'St. Joseph\'s Church' },
  { id: 'branch-004', name: 'Holy Trinity Church' },
  { id: 'branch-005', name: 'St. Peter\'s Parish' },
  { id: 'branch-006', name: 'Good Shepherd Church' },
];

type ReportFiltersProps = {
  selectedBranches: string[];
  setSelectedBranches: (branches: string[]) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  activeReportType: string;
  onReportTypeChange: (reportType: string) => void;
};

export default function ReportFilters({
  selectedBranches,
  setSelectedBranches,
  dateRange,
  setDateRange,
  activeReportType,
  onReportTypeChange
}: ReportFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Toggle branch selection
  const toggleBranchSelection = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter(id => id !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  // Select or deselect all branches
  const toggleAllBranches = () => {
    if (selectedBranches.length === mockBranches.length) {
      setSelectedBranches([]);
    } else {
      setSelectedBranches(mockBranches.map(branch => branch.id));
    }
  };

  // Handle date changes
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setDateRange({
      ...dateRange,
      [field]: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Report type selector */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onReportTypeChange('attendance')}
          className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium ${
            activeReportType === 'attendance'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Attendance
        </button>
        <button
          onClick={() => onReportTypeChange('membership')}
          className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium ${
            activeReportType === 'membership'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <UserGroupIcon className="h-5 w-5 mr-2" />
          Membership
        </button>
        <button
          onClick={() => onReportTypeChange('sacramentals')}
          className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium ${
            activeReportType === 'sacramentals'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <BookOpenIcon className="h-5 w-5 mr-2" />
          Sacramentals
        </button>
      </div>

      {/* Filters toggle */}
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex space-x-3">
          <button
            onClick={toggleAllBranches}
            className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {selectedBranches.length === mockBranches.length ? 'Deselect All' : 'Select All Branches'}
          </button>
          <button
            className="inline-flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            onClick={() => {
              setSelectedBranches([]);
              setDateRange({ start: '', end: '' });
            }}
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Expandable filter options */}
      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Branch selection */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Branches</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mockBranches.map(branch => (
                  <div key={branch.id} className="flex items-center">
                    <input
                      id={`branch-${branch.id}`}
                      name={`branch-${branch.id}`}
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => toggleBranchSelection(branch.id)}
                    />
                    <label
                      htmlFor={`branch-${branch.id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {branch.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date range selection */}
            <div className="col-span-1">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Range</h3>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-xs text-gray-500 dark:text-gray-400"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={dateRange.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-xs text-gray-500 dark:text-gray-400"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={dateRange.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
