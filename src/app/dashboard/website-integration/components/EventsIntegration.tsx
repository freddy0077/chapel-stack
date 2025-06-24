'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type EventCategory = {
  id: string;
  name: string;
  color: string;
  displayed: boolean;
  requiresApproval: boolean;
};

export default function EventsIntegration() {
  const [settings, setSettings] = useState({
    syncEvents: true,
    allowRegistration: true,
    showFullDetails: false,
    enableEmailReminders: true,
    limitPastEvents: true,
    requireApproval: true,
  });

  const [categories, setCategories] = useState<EventCategory[]>([
    { id: '1', name: 'Mass Schedule', color: '#4F46E5', displayed: true, requiresApproval: false },
    { id: '2', name: 'Parish Events', color: '#10B981', displayed: true, requiresApproval: true },
    { id: '3', name: 'Youth Ministry', color: '#F59E0B', displayed: true, requiresApproval: true },
    { id: '4', name: 'Committee Meetings', color: '#EF4444', displayed: false, requiresApproval: true },
    { id: '5', name: 'Small Groups', color: '#8B5CF6', displayed: false, requiresApproval: true },
    { id: '6', name: 'Service Opportunities', color: '#EC4899', displayed: true, requiresApproval: false },
  ]);

  const [pastEventLimit, setPastEventLimit] = useState(30);

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  const toggleCategoryDisplay = (id: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, displayed: !category.displayed }
          : category
      )
    );
  };

  const toggleCategoryApproval = (id: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, requiresApproval: !category.requiresApproval }
          : category
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Events Integration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how events from your Church Management System appear on your website.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              {Object.entries(settings).map(([key, enabled]) => (
                <Switch.Group as="div" className="flex items-center justify-between" key={key}>
                  <div className="flex flex-grow items-center">
                    <Switch.Label as="span" className="flex-grow text-sm">
                      <span className="font-medium text-gray-900">
                        {key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace(/([A-Z])/g, (match) => match.toUpperCase())}
                      </span>
                    </Switch.Label>
                  </div>
                  <Switch
                    checked={enabled}
                    onChange={() => handleToggle(key)}
                    className={classNames(
                      enabled ? 'bg-blue-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        enabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </Switch.Group>
              ))}
            </div>

            {settings.limitPastEvents && (
              <div>
                <label htmlFor="past-event-limit" className="block text-sm font-medium text-gray-700">
                  Past Event Display Limit (Days)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="past-event-limit"
                    id="past-event-limit"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={pastEventLimit}
                    onChange={(e) => setPastEventLimit(Number(e.target.value))}
                    min="0"
                    max="365"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Number of days in the past to display events on your website.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Event Categories</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Configure which event categories are displayed on your website.</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Display on Website
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requires Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="ml-2">{category.color}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => toggleCategoryDisplay(category.id)}
                      className="inline-flex items-center"
                    >
                      {category.displayed ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                      <span className="ml-2">{category.displayed ? 'Yes' : 'No'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => toggleCategoryApproval(category.id)}
                      className="inline-flex items-center"
                    >
                      {category.requiresApproval ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                      <span className="ml-2">{category.requiresApproval ? 'Yes' : 'No'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
