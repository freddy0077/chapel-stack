'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { CloudArrowUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type MediaCategory = {
  id: string;
  name: string;
  shared: boolean;
  requiresApproval: boolean;
};

export default function MediaIntegration() {
  const [settings, setSettings] = useState({
    enableMediaSharing: true,
    allowDownloads: true,
    showAttribution: true,
    enableLightbox: true,
    optimizeImages: true,
    enableWatermark: false,
    requireMediaApproval: true,
    syncAutomatically: true,
  });

  const [mediaCategories, setMediaCategories] = useState<MediaCategory[]>([
    { id: '1', name: 'Parish Events', shared: true, requiresApproval: true },
    { id: '2', name: 'Liturgical Celebrations', shared: true, requiresApproval: false },
    { id: '3', name: 'Ministry Activities', shared: true, requiresApproval: true },
    { id: '4', name: 'Staff Photos', shared: true, requiresApproval: false },
    { id: '5', name: 'Property & Facilities', shared: true, requiresApproval: false },
    { id: '6', name: 'Internal Documents', shared: false, requiresApproval: true },
    { id: '7', name: 'Youth Activities', shared: true, requiresApproval: true },
  ]);

  const [watermarkText, setWatermarkText] = useState('© St. Mary\'s Catholic Church');
  const [galleryUrl, setGalleryUrl] = useState('https://yourchurch.org/gallery');
  const [maxFileSize, setMaxFileSize] = useState(10);

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  const toggleCategorySharing = (id: string) => {
    setMediaCategories(
      mediaCategories.map((category) =>
        category.id === id
          ? { ...category, shared: !category.shared }
          : category
      )
    );
  };

  const toggleCategoryApproval = (id: string) => {
    setMediaCategories(
      mediaCategories.map((category) =>
        category.id === id
          ? { ...category, requiresApproval: !category.requiresApproval }
          : category
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Media Integration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how media files are shared with your church website.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="gallery-url" className="block text-sm font-medium text-gray-700">
                Gallery URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="gallery-url"
                  id="gallery-url"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://yourchurch.org/gallery"
                  value={galleryUrl}
                  onChange={(e) => setGalleryUrl(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The URL where your public media gallery is displayed.
              </p>
            </div>

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

            {settings.enableWatermark && (
              <div>
                <label htmlFor="watermark-text" className="block text-sm font-medium text-gray-700">
                  Watermark Text
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="watermark-text"
                    id="watermark-text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Text to display as watermark on shared images.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="max-file-size" className="block text-sm font-medium text-gray-700">
                Maximum File Size (MB)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="max-file-size"
                  id="max-file-size"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(Number(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Maximum file size allowed for media uploads.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Media Categories</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Configure which media categories are shared with your website.</p>
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
                  Shared with Website
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requires Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mediaCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Switch
                      checked={category.shared}
                      onChange={() => toggleCategorySharing(category.id)}
                      className={classNames(
                        category.shared ? 'bg-blue-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          category.shared ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Switch
                      checked={category.requiresApproval}
                      onChange={() => toggleCategoryApproval(category.id)}
                      className={classNames(
                        category.requiresApproval ? 'bg-blue-600' : 'bg-gray-200',
                        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          category.requiresApproval ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                        )}
                      />
                    </Switch>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <CloudArrowUpIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-base font-semibold leading-6 text-gray-900">Upload Widget</h3>
          </div>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Use this HTML code to embed an upload widget on your website that allows visitors to submit photos directly to your media library.
            </p>
          </div>
          <div className="mt-5">
            <textarea
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={`<script src="https://yourchurch.org/media/upload-widget.js" data-gallery="community" data-approval="required"></script>`}
              readOnly
            />
          </div>
          
          <div className="mt-4 flex items-start">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  All uploaded media from visitors will require approval before being published if you enable the upload widget.
                </p>
              </div>
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
