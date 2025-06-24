"use client";

interface CommunicationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function CommunicationTabs({ activeTab, setActiveTab }: CommunicationTabsProps) {
  const tabs = [
    { name: 'Messages', value: 'messages' },
    { name: 'Announcements', value: 'announcements' },
    { name: 'Prayer Requests', value: 'prayer-requests' },
  ];

  return (
    <div className="mt-6">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.value}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.value);
                }}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                  ${activeTab === tab.value
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
                `}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
