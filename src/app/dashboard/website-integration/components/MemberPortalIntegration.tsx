"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type MemberFeature = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  requiresApproval: boolean;
};

export default function MemberPortalIntegration() {
  const [settings, setSettings] = useState({
    enableMemberPortal: true,
    useSSO: true,
    requireMFA: true,
    showFamilyMembers: true,
    allowProfileEdits: true,
    requireEmailVerification: true,
    showDonationHistory: false,
    autoApproveRegistrations: false,
  });

  const [features, setFeatures] = useState<MemberFeature[]>([
    {
      id: "1",
      name: "View Giving History",
      description: "Allow members to view their donation history",
      enabled: true,
      requiresApproval: false,
    },
    {
      id: "2",
      name: "Online Donations",
      description: "Allow members to make donations through the portal",
      enabled: true,
      requiresApproval: false,
    },
    {
      id: "3",
      name: "Ministry Registration",
      description: "Allow members to register for ministries",
      enabled: true,
      requiresApproval: true,
    },
    {
      id: "4",
      name: "Event Registration",
      description: "Allow members to register for events",
      enabled: true,
      requiresApproval: false,
    },
    {
      id: "5",
      name: "Prayer Requests",
      description: "Allow members to submit prayer requests",
      enabled: true,
      requiresApproval: true,
    },
    {
      id: "6",
      name: "Directory Access",
      description: "Allow members to view church directory",
      enabled: false,
      requiresApproval: true,
    },
    {
      id: "7",
      name: "Volunteer Signup",
      description: "Allow members to sign up for volunteer opportunities",
      enabled: true,
      requiresApproval: true,
    },
    {
      id: "8",
      name: "Sacramental Records",
      description: "Allow members to view their sacramental records",
      enabled: true,
      requiresApproval: false,
    },
  ]);

  const [portalUrl, setPortalUrl] = useState("https://yourchurch.org/members");
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    });
  };

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature,
      ),
    );
  };

  const toggleApproval = (id: string) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id
          ? { ...feature, requiresApproval: !feature.requiresApproval }
          : feature,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Member Portal Integration
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how your members access church data through your website.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="portal-url"
                className="block text-sm font-medium text-gray-700"
              >
                Member Portal URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="portal-url"
                  id="portal-url"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://yourchurch.org/members"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The URL where members can access their portal.
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

            <div>
              <label
                htmlFor="session-timeout"
                className="block text-sm font-medium text-gray-700"
              >
                Session Timeout (minutes)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="session-timeout"
                  id="session-timeout"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  min="5"
                  max="120"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Members will be automatically logged out after this period of
                inactivity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Security Notice
            </h3>
          </div>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              The member portal has access to sensitive personal information. We
              strongly recommend enabling MFA and requiring email verification
              for all accounts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Member Portal Features
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Configure which features are available in the member portal.</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Feature
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Enabled
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requires Approval
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map((feature) => (
                <tr key={feature.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {feature.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Switch
                      checked={feature.enabled}
                      onChange={() => toggleFeature(feature.id)}
                      className={classNames(
                        feature.enabled ? "bg-blue-600" : "bg-gray-200",
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          feature.enabled ? "translate-x-5" : "translate-x-0",
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        )}
                      />
                    </Switch>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Switch
                      checked={feature.requiresApproval}
                      onChange={() => toggleApproval(feature.id)}
                      className={classNames(
                        feature.requiresApproval
                          ? "bg-blue-600"
                          : "bg-gray-200",
                        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          feature.requiresApproval
                            ? "translate-x-5"
                            : "translate-x-0",
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
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
