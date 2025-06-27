'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type SermonCategory = {
  id: string;
  name: string;
  displayed: boolean;
};

export default function SermonIntegration() {
  const [settings, setSettings] = useState({
    enableSermonArchive: true,
    showSermonSeries: true,
    allowAudioDownload: true,
    allowVideoDownload: false,
    enableComments: false,
    requireApproval: true,
    enableSubscription: true,
    showSpeakerBio: true,
  });

  const [sermonCategories, setSermonCategories] = useState<SermonCategory[]>([
    { id: '1', name: 'Sunday Homilies', displayed: true },
    { id: '2', name: 'Special Liturgies', displayed: true },
    { id: '3', name: 'Retreat Talks', displayed: true },
    { id: '4', name: 'Formation Series', displayed: false },
    { id: '5', name: 'Guest Speakers', displayed: true },
  ]);

  const [embedCode, setEmbedCode] = useState(
    `<iframe src="https://yourchurch.org/sermons/embed" width="100%" height="600" frameborder="0"></iframe>`
  );

  const [newCategory, setNewCategory] = useState('');

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  const toggleCategoryDisplay = (id: string) => {
    setSermonCategories(
      sermonCategories.map((category) =>
        category.id === id
          ? { ...category, displayed: !category.displayed }
          : category
      )
    );
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setSermonCategories([
        ...sermonCategories,
        {
          id: Date.now().toString(),
          name: newCategory.trim(),
          displayed: true,
        },
      ]);
      setNewCategory('');
    }
  };

  const removeCategory = (id: string) => {
    setSermonCategories(sermonCategories.filter((category) => category.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Sermon Integration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how sermon archives are shared with your church website.
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
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Embed Code</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Use this code to embed the sermon player on your website.</p>
          </div>
          <div className="mt-5">
            <textarea
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Sermon Categories</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Configure which sermon categories are displayed on your website.</p>
          </div>
          <div className="mt-5">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="New category name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>

            <div className="mt-4">
              <ul className="divide-y divide-gray-200">
                {sermonCategories.map((category) => (
                  <li key={category.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.displayed}
                        onChange={() => toggleCategoryDisplay(category.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => removeCategory(category.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
