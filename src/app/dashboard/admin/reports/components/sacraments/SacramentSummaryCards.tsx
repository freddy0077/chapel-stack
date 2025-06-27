import {
  BookOpenIcon,
  CakeIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Mock data for sacrament totals
const mockSacramentData = {
  baptisms: {
    'St. Mary\'s Cathedral': 135,
    'Sacred Heart Parish': 98,
    'St. Joseph\'s Church': 72,
    'Holy Trinity Church': 51,
    'St. Peter\'s Parish': 68,
    'Good Shepherd Church': 44
  },
  firstCommunions: {
    'St. Mary\'s Cathedral': 105,
    'Sacred Heart Parish': 82,
    'St. Joseph\'s Church': 63,
    'Holy Trinity Church': 42,
    'St. Peter\'s Parish': 54,
    'Good Shepherd Church': 38
  },
  confirmations: {
    'St. Mary\'s Cathedral': 93,
    'Sacred Heart Parish': 72,
    'St. Joseph\'s Church': 54,
    'Holy Trinity Church': 36,
    'St. Peter\'s Parish': 48,
    'Good Shepherd Church': 31
  },
  marriages: {
    'St. Mary\'s Cathedral': 42,
    'Sacred Heart Parish': 31,
    'St. Joseph\'s Church': 24,
    'Holy Trinity Church': 16,
    'St. Peter\'s Parish': 19,
    'Good Shepherd Church': 12
  },
  anniversaries: {
    'St. Mary\'s Cathedral': 28,
    'Sacred Heart Parish': 22,
    'St. Joseph\'s Church': 18,
    'Holy Trinity Church': 11,
    'St. Peter\'s Parish': 16,
    'Good Shepherd Church': 9
  }
};

type SacramentSummaryCardsProps = {
  branchesToDisplay: string[];
};

export default function SacramentSummaryCards({
  branchesToDisplay
}: SacramentSummaryCardsProps) {
  
  // Calculate totals for each sacrament type
  const calculateBaptismTotal = () => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (mockSacramentData.baptisms[branch] || 0);
    }, 0);
  };

  const calculateCommunionTotal = () => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (mockSacramentData.firstCommunions[branch] || 0);
    }, 0);
  };

  const calculateConfirmationTotal = () => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (mockSacramentData.confirmations[branch] || 0);
    }, 0);
  };

  const calculateMarriageTotal = () => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (mockSacramentData.marriages[branch] || 0);
    }, 0);
  };

  const calculateAnniversaryTotal = () => {
    return branchesToDisplay.reduce((total, branch) => {
      return total + (mockSacramentData.anniversaries[branch] || 0);
    }, 0);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
            <BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Baptisms</h2>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{calculateBaptismTotal()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="rounded-full p-2 bg-indigo-100 dark:bg-indigo-900/30">
            <SparklesIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">First Communions</h2>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{calculateCommunionTotal()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30">
            <BookOpenIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Confirmations</h2>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{calculateConfirmationTotal()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="rounded-full p-2 bg-pink-100 dark:bg-pink-900/30">
            <HeartIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Marriages</h2>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{calculateMarriageTotal()}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30">
            <CakeIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400">Anniversaries</h2>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{calculateAnniversaryTotal()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
