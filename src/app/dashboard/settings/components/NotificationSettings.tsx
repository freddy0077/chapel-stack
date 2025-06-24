'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useSettings, useUpdateSetting, useCreateBranchSetting } from '@/graphql/hooks/useSettings';

type NotificationChannel = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
};

type NotificationCategory = {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
};

export default function NotificationSettings() {
  // Use global settings for notification preferences
  const { data, loading, refetch } = useSettings();
  const [updateSetting] = useUpdateSetting();
  const [createSetting] = useCreateBranchSetting();

  const [channels, setChannels] = useState<NotificationChannel[]>([
    { id: 'email', name: 'Email', description: 'Receive email notifications', enabled: true },
    { id: 'sms', name: 'SMS', description: 'Receive text messages', enabled: true },
    { id: 'push', name: 'Push Notifications', description: 'Receive push notifications on your devices', enabled: true },
    { id: 'inApp', name: 'In-App Notifications', description: 'Receive notifications within the application', enabled: true },
  ]);

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'system',
      name: 'System Notifications',
      description: 'Important system updates and maintenance',
      channels: { email: true, sms: true, push: true, inApp: true },
    },
    {
      id: 'security',
      name: 'Security Alerts',
      description: 'Login attempts and security notifications',
      channels: { email: true, sms: true, push: true, inApp: true },
    },
    {
      id: 'events',
      name: 'Events & Calendar',
      description: 'Event reminders and calendar updates',
      channels: { email: true, sms: false, push: true, inApp: true },
    },
    {
      id: 'attendance',
      name: 'Attendance',
      description: 'Check-in confirmations and attendance reports',
      channels: { email: true, sms: false, push: false, inApp: true },
    },
    {
      id: 'ministry',
      name: 'Ministry Updates',
      description: 'Updates from your ministries and small groups',
      channels: { email: true, sms: false, push: true, inApp: true },
    },
    {
      id: 'finances',
      name: 'Financial Updates',
      description: 'Donation receipts and financial reports',
      channels: { email: true, sms: false, push: false, inApp: true },
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load notification settings from API (keys: notif_channel_email, notif_channel_sms, etc)
  useEffect(() => {
    if (data?.settings) {
      setChannels((prev) =>
        prev.map((channel) => {
          const setting = data.settings.find((s) => s.key === `notif_channel_${channel.id}`);
          return setting ? { ...channel, enabled: setting.value === 'true' } : channel;
        })
      );
      setCategories((prev) =>
        prev.map((category) => {
          const updatedChannels = { ...category.channels };
          for (const ch of Object.keys(updatedChannels)) {
            const setting = data.settings.find((s) => s.key === `notif_cat_${category.id}_${ch}`);
            if (setting) updatedChannels[ch] = setting.value === 'true';
          }
          return { ...category, channels: updatedChannels };
        })
      );
    }
  }, [data]);

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const toggleCategoryChannel = (categoryId: string, channelId: keyof NotificationCategory['channels']) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              channels: {
                ...category.channels,
                [channelId]: !category.channels[channelId],
              },
            }
          : category
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsMap = {};
      if (data?.settings) {
        for (const s of data.settings) settingsMap[s.key] = s.id;
      }
      const updates = [
        ...channels.map((ch) => ({ key: `notif_channel_${ch.id}`, value: String(ch.enabled) })),
        ...categories.flatMap((cat) =>
          Object.entries(cat.channels).map(([ch, enabled]) => ({ key: `notif_cat_${cat.id}_${ch}`, value: String(enabled) }))
        ),
      ];
      // Only trigger mutations for settings that have changed
      const changedUpdates = updates.filter((u) => {
        const currentSetting = data?.settings?.find((s) => s.key === u.key);
        return !currentSetting || String(currentSetting.value) !== String(u.value);
      });
      await Promise.all(
        changedUpdates.map((u) => {
          if (settingsMap[u.key]) {
            return updateSetting({
              variables: {
                id: settingsMap[u.key],
                input: { key: u.key, value: u.value },
              },
            });
          } else {
            return createSetting({
              variables: {
                input: { key: u.key, value: u.value },
              },
            });
          }
        })
      );
      setSaveSuccess(true);
      refetch();
    } catch (e) {}
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how and when you receive notifications
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Notification Channels</h4>
          <p className="mt-1 text-xs text-gray-500">
            Enable or disable notification delivery methods
          </p>
          <div className="mt-4 space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-700">{channel.name}</h5>
                  <p className="text-xs text-gray-500">{channel.description}</p>
                </div>
                <Switch
                  checked={channel.enabled}
                  onChange={() => toggleChannel(channel.id)}
                  className={`${channel.enabled ? 'bg-green-500/80 shadow-lg' : 'bg-gray-200/60'} relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 border border-green-100`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-200 ${channel.enabled ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </Switch>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <h4 className="text-sm font-medium text-gray-900">Notification Categories</h4>
          <p className="mt-1 text-xs text-gray-500">
            Choose which types of notifications you want to receive and through which channels
          </p>
          <div className="mt-4 divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="py-4">
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-gray-700">{category.name}</h5>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-4">
                  {channels.map((channel) => (
                    <div key={`${category.id}-${channel.id}`} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={category.channels[channel.id as keyof NotificationCategory['channels']]}
                        onChange={() => toggleCategoryChannel(category.id, channel.id as keyof NotificationCategory['channels'])}
                        className="rounded border-gray-300 text-primary-600 shadow focus:ring-2 focus:ring-primary-200 transition-all duration-150 bg-white/80 backdrop-blur"
                      />
                      <span className="ml-2 text-xs text-gray-700">{channel.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-sm text-green-600">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Notification settings saved successfully
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 border-2 border-white/80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </div>
  );
}
