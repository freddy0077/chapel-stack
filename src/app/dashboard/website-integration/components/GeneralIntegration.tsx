"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function GeneralIntegration() {
  const [settings, setSettings] = useState({
    enableIntegration: true,
    allowPublicAccess: true,
    syncChangesAutomatically: false,
    enableSSOWithWebsite: true,
    enableAnalytics: true,
    enableDebugMode: false,
  });

  const [webhookUrl, setWebhookUrl] = useState(
    "https://yourchurch.org/api/cms-webhook",
  );
  const [websiteUrl, setWebsiteUrl] = useState("https://yourchurch.org");

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Website Integration Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how your Church Management System integrates with your
          public website.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="website-url"
                className="block text-sm font-medium text-gray-700"
              >
                Website URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="website-url"
                  id="website-url"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://yourchurch.org"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The URL of your church website that will connect to this system.
              </p>
            </div>

            <div>
              <label
                htmlFor="webhook-url"
                className="block text-sm font-medium text-gray-700"
              >
                Webhook URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="webhook-url"
                  id="webhook-url"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://yourchurch.org/api/cms-webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The webhook endpoint on your website that will receive updates
                from this system.
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(settings).map(([key, enabled]) => (
                <Switch.Group
                  as="div"
                  className="flex items-center justify-between"
                  key={key}
                >
                  <div className="flex flex-grow items-center">
                    <Switch.Label as="span" className="flex-grow text-sm">
                      <span className="font-medium text-gray-900">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace(/([A-Z])/g, (match) => match.toUpperCase())}
                      </span>
                    </Switch.Label>
                  </div>
                  <Switch
                    checked={enabled}
                    onChange={() => handleToggle(key)}
                    className={classNames(
                      enabled ? "bg-blue-600" : "bg-gray-200",
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        enabled ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      )}
                    />
                  </Switch>
                </Switch.Group>
              ))}
            </div>

            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon
                    className="h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Integration Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Enabling website integration allows your public website to
                      access certain data from your Church Management System.
                      Please ensure your website is properly secured before
                      enabling public access.
                    </p>
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
        </div>
      </div>
    </div>
  );
}
