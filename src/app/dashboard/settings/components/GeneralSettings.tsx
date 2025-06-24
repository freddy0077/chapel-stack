'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useSettings, useUpdateSetting, useCreateBranchSetting } from '@/graphql/hooks/useSettings';

export default function GeneralSettings() {
  // Get global settings (no branchId)
  const { data, loading, refetch } = useSettings();
  const [updateSetting] = useUpdateSetting();
  const [createSetting] = useCreateBranchSetting();

  // Local state for settings fields
  const [language, setLanguage] = useState('english');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load settings from API
  useEffect(() => {
    if (data?.settings) {
      for (const setting of data.settings) {
        if (setting.key === 'language') setLanguage(setting.value);
        if (setting.key === 'timezone') setTimezone(setting.value);
        if (setting.key === 'dateFormat') setDateFormat(setting.value);
        if (setting.key === 'timeFormat') setTimeFormat(setting.value);
        if (setting.key === 'darkMode') setDarkMode(setting.value === 'true');
        if (setting.key === 'highContrast') setHighContrast(setting.value === 'true');
        if (setting.key === 'autoSave') setAutoSave(setting.value === 'true');
      }
    }
  }, [data]);

  // Save settings to API
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = [
        { key: 'language', value: language },
        { key: 'timezone', value: timezone },
        { key: 'dateFormat', value: dateFormat },
        { key: 'timeFormat', value: timeFormat },
        { key: 'darkMode', value: String(darkMode) },
        { key: 'highContrast', value: String(highContrast) },
        { key: 'autoSave', value: String(autoSave) },
      ];
      // Find setting ids from loaded data
      const settingsMap = {};
      if (data?.settings) {
        for (const s of data.settings) settingsMap[s.key] = s.id;
      }
      // Update or create each setting
      await Promise.all(
        updates.map(u => {
          if (settingsMap[u.key]) {
            return updateSetting({
              variables: {
                id: settingsMap[u.key],
                input: { key: u.key, value: u.value }
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
    } catch (e) {
      // Optionally show error
    }
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure general application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-indigo-100 bg-white/70 shadow-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-200 backdrop-blur placeholder:text-indigo-300 text-indigo-900 font-medium transition-all duration-150"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="portuguese">Portuguese</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-indigo-100 bg-white/70 shadow-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-200 backdrop-blur placeholder:text-indigo-300 text-indigo-900 font-medium transition-all duration-150"
          >
            {Intl.supportedValuesOf
              ? Intl.supportedValuesOf('timeZone').map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))
              : [
                  'Pacific/Midway','Pacific/Honolulu','America/Juneau','America/Los_Angeles','America/Tijuana','America/Denver','America/Phoenix','America/Chihuahua','America/Mazatlan','America/Chicago','America/Regina','America/Mexico_City','America/Monterrey','America/Guatemala','America/New_York','America/Indiana/Indianapolis','America/Bogota','America/Lima','America/Halifax','America/Caracas','America/La_Paz','America/Santiago','America/St_Johns','America/Sao_Paulo','America/Argentina/Buenos_Aires','America/Guyana','America/Godthab','Atlantic/South_Georgia','Atlantic/Azores','Atlantic/Cape_Verde','Europe/Dublin','Europe/Lisbon','Europe/London','Africa/Casablanca','Africa/Monrovia','Etc/UTC','Europe/Belgrade','Europe/Bratislava','Europe/Budapest','Europe/Ljubljana','Europe/Prague','Europe/Sarajevo','Europe/Skopje','Europe/Warsaw','Europe/Zagreb','Europe/Brussels','Europe/Copenhagen','Europe/Madrid','Europe/Paris','Europe/Amsterdam','Europe/Berlin','Europe/Rome','Europe/Stockholm','Europe/Vienna','Europe/Bucharest','Europe/Helsinki','Europe/Kiev','Europe/Riga','Europe/Sofia','Europe/Tallinn','Europe/Vilnius','Europe/Athens','Europe/Istanbul','Europe/Minsk','Asia/Jerusalem','Africa/Cairo','Africa/Harare','Africa/Johannesburg','Europe/Moscow','Asia/Kuwait','Asia/Riyadh','Africa/Nairobi','Asia/Baghdad','Asia/Tehran','Asia/Muscat','Asia/Baku','Asia/Tbilisi','Asia/Yerevan','Asia/Kabul','Asia/Yekaterinburg','Asia/Karachi','Asia/Tashkent','Asia/Kolkata','Asia/Kathmandu','Asia/Dhaka','Asia/Colombo','Asia/Almaty','Asia/Novosibirsk','Asia/Rangoon','Asia/Bangkok','Asia/Jakarta','Asia/Krasnoyarsk','Asia/Shanghai','Asia/Chongqing','Asia/Hong_Kong','Asia/Urumqi','Asia/Kuala_Lumpur','Asia/Singapore','Asia/Taipei','Australia/Perth','Asia/Irkutsk','Asia/Ulaanbaatar','Asia/Seoul','Asia/Tokyo','Asia/Yakutsk','Australia/Darwin','Australia/Adelaide','Australia/Sydney','Australia/Brisbane','Australia/Hobart','Asia/Vladivostok','Pacific/Guam','Asia/Magadan','Pacific/Port_Moresby','Pacific/Noumea','Pacific/Fiji','Asia/Kamchatka','Pacific/Majuro','Pacific/Auckland','Pacific/Tongatapu'
                ].map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
            Date Format
          </label>
          <select
            id="date-format"
            name="dateFormat"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-indigo-100 bg-white/70 shadow-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-200 backdrop-blur placeholder:text-indigo-300 text-indigo-900 font-medium transition-all duration-150"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="MMMM D, YYYY">MMMM D, YYYY</option>
            <option value="D MMMM YYYY">D MMMM YYYY</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="time-format" className="block text-sm font-medium text-gray-700">
            Time Format
          </label>
          <select
            id="time-format"
            name="timeFormat"
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-indigo-100 bg-white/70 shadow-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-200 backdrop-blur placeholder:text-indigo-300 text-indigo-900 font-medium transition-all duration-150"
          >
            <option value="12-hour">12-hour (1:30 PM)</option>
            <option value="24-hour">24-hour (13:30)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h4 className="text-sm font-medium text-gray-900">Display Preferences</h4>
        
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-medium text-gray-700">Dark Mode</h5>
            <p className="text-xs text-gray-500">Enable dark theme for the application</p>
          </div>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${darkMode ? 'bg-indigo-500/80 shadow-lg' : 'bg-gray-200/60'} relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 border border-indigo-100`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-200 ${darkMode ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-medium text-gray-700">High Contrast</h5>
            <p className="text-xs text-gray-500">Increase contrast for better readability</p>
          </div>
          <Switch
            checked={highContrast}
            onChange={setHighContrast}
            className={`${highContrast ? 'bg-indigo-500/80 shadow-lg' : 'bg-gray-200/60'} relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 border border-indigo-100`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-200 ${highContrast ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </Switch>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-medium text-gray-700">Auto-Save</h5>
            <p className="text-xs text-gray-500">Automatically save changes as you make them</p>
          </div>
          <Switch
            checked={autoSave}
            onChange={setAutoSave}
            className={`${autoSave ? 'bg-indigo-500/80 shadow-lg' : 'bg-gray-200/60'} relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 border border-indigo-100`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-200 ${autoSave ? 'translate-x-7' : 'translate-x-1'}`}
            />
          </Switch>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-sm text-green-600">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Settings saved successfully
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          style={{ backgroundColor: '#6366f1', color: '#fff', border: '1px solid #6366f1' }}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
