'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type APIEndpoint = {
  name: string;
  endpoint: string;
  method: string;
  enabled: boolean;
  description: string;
};

export default function APISettings() {
  const [apiKey, setApiKey] = useState('cms_api_8a72b9c32e5f4d19a6e7bfd1ecfb2e47');
  const [regenerating, setRegenerating] = useState(false);
  const [apiRateLimit, setApiRateLimit] = useState(100);
  
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    { 
      name: 'Public Events', 
      endpoint: '/api/public/events', 
      method: 'GET', 
      enabled: true,
      description: 'Retrieve public events for display on your website calendar'
    },
    { 
      name: 'Sermons', 
      endpoint: '/api/public/sermons', 
      method: 'GET', 
      enabled: true,
      description: 'Access sermon archives for your website media section'
    },
    { 
      name: 'Mass Times', 
      endpoint: '/api/public/mass-times', 
      method: 'GET', 
      enabled: true,
      description: 'Get current mass and service schedule information'
    },
    { 
      name: 'Staff Directory', 
      endpoint: '/api/public/staff', 
      method: 'GET', 
      enabled: false,
      description: 'Retrieve staff directory information for your website team page'
    },
    { 
      name: 'Ministry Groups', 
      endpoint: '/api/public/ministries', 
      method: 'GET', 
      enabled: true,
      description: 'Access information about active ministries and groups'
    },
    { 
      name: 'Donation Integration', 
      endpoint: '/api/public/donate', 
      method: 'POST', 
      enabled: false,
      description: 'Process donations from your website through the CMS'
    },
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const regenerateApiKey = () => {
    setRegenerating(true);
    // Simulate API call
    setTimeout(() => {
      setApiKey(`cms_api_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`);
      setRegenerating(false);
    }, 1000);
  };

  const toggleEndpoint = (index: number) => {
    const newEndpoints = [...endpoints];
    newEndpoints[index].enabled = !newEndpoints[index].enabled;
    setEndpoints(newEndpoints);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">API Access Management</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure API access for your website integration
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">API Key</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Use this API key to authenticate requests from your website to the CMS API.</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ClipboardDocumentIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Copy
              </button>
            </div>
            <button
              type="button"
              onClick={regenerateApiKey}
              disabled={regenerating}
              className="mt-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {regenerating ? 'Regenerating...' : 'Regenerate API Key'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Rate Limiting</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Set the maximum number of API requests allowed per minute.</p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="rate-limit" className="sr-only">
                Rate Limit
              </label>
              <input
                type="number"
                name="rate-limit"
                id="rate-limit"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={apiRateLimit}
                onChange={(e) => setApiRateLimit(Number(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
            <span className="mt-3 inline-flex items-center text-sm text-gray-500 sm:ml-4 sm:mt-0">
              requests per minute
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Available API Endpoints</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Enable or disable API endpoints for your website integration.</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {endpoints.map((endpoint, index) => (
              <li key={endpoint.name}>
                <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <p className="ml-2 text-sm font-medium text-gray-900">{endpoint.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{endpoint.endpoint}</p>
                    <p className="text-xs text-gray-500 mt-1">{endpoint.description}</p>
                  </div>
                  <Switch
                    checked={endpoint.enabled}
                    onChange={() => toggleEndpoint(index)}
                    className={classNames(
                      endpoint.enabled ? 'bg-blue-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        endpoint.enabled ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </div>
              </li>
            ))}
          </ul>
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
