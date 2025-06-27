import { useState } from 'react';
import { 
  ChevronUpIcon, 
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import SacramentSummaryCards from './sacraments/SacramentSummaryCards';
import BaptismTable from './sacraments/BaptismTable';
import CommunionTable from './sacraments/CommunionTable';
import ConfirmationTable from './sacraments/ConfirmationTable';
import MarriageTable from './sacraments/MarriageTable';

type SacramentalsReportSectionProps = {
  selectedBranches: string[];
  dateRange: { start: string; end: string };
};

// Map of branch IDs to names for reference
const branchIdToName = {
  'branch-001': 'St. Mary\'s Cathedral',
  'branch-002': 'Sacred Heart Parish',
  'branch-003': 'St. Joseph\'s Church',
  'branch-004': 'Holy Trinity Church',
  'branch-005': 'St. Peter\'s Parish',
  'branch-006': 'Good Shepherd Church'
};

export default function SacramentalsReportSection({ 
  selectedBranches, 
  dateRange 
}: SacramentalsReportSectionProps) {
  const [showBaptisms, setShowBaptisms] = useState(true);
  const [showCommunions, setShowCommunions] = useState(false);
  const [showConfirmations, setShowConfirmations] = useState(false);
  const [showMarriages, setShowMarriages] = useState(false);

  // Get branch names from selected IDs
  const selectedBranchNames = selectedBranches.map(id => branchIdToName[id as keyof typeof branchIdToName]);

  // If no branches are selected, show all branches
  const branchesToDisplay = selectedBranchNames.length > 0 ? selectedBranchNames : Object.values(branchIdToName);

  return (
    <div className="space-y-6">
      {/* Summary cards at the top */}
      <SacramentSummaryCards 
        selectedBranches={selectedBranches}
        branchesToDisplay={branchesToDisplay}
      />

      {/* Baptism Records Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Baptism Records</h2>
          <button 
            onClick={() => setShowBaptisms(!showBaptisms)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showBaptisms ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        </div>
        
        {showBaptisms && (
          <BaptismTable 
            branchesToDisplay={branchesToDisplay}
            dateRange={dateRange}
          />
        )}
      </div>

      {/* First Communion Records Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">First Communion Records</h2>
          <button 
            onClick={() => setShowCommunions(!showCommunions)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showCommunions ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        </div>
        
        {showCommunions && (
          <CommunionTable 
            branchesToDisplay={branchesToDisplay}
            dateRange={dateRange}
          />
        )}
      </div>

      {/* Confirmation Records Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Confirmation Records</h2>
          <button 
            onClick={() => setShowConfirmations(!showConfirmations)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showConfirmations ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        </div>
        
        {showConfirmations && (
          <ConfirmationTable 
            branchesToDisplay={branchesToDisplay}
            dateRange={dateRange}
          />
        )}
      </div>

      {/* Marriage Records Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Marriage Records</h2>
          <button 
            onClick={() => setShowMarriages(!showMarriages)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            {showMarriages ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>
        </div>
        
        {showMarriages && (
          <MarriageTable 
            branchesToDisplay={branchesToDisplay}
            dateRange={dateRange}
          />
        )}
      </div>
    </div>
  );
}
