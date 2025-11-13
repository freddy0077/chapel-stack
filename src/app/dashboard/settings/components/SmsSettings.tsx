"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  GET_SMS_SETTINGS,
  UPDATE_SMS_SETTINGS,
  TEST_SMS_CONNECTION,
  SEND_TEST_SMS,
  type SmsSettings as SmsSettingsType,
  type UpdateSmsSettingsInput,
} from "@/graphql/settings/smsSettings";

export default function SmsSettings() {
  const { data, loading, refetch } = useQuery(GET_SMS_SETTINGS);
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_SMS_SETTINGS);
  const [testConnection, { loading: testing }] = useMutation(TEST_SMS_CONNECTION);
  const [sendTest, { loading: sending }] = useMutation(SEND_TEST_SMS);

  const [formData, setFormData] = useState<UpdateSmsSettingsInput>({
    isActive: false,
    provider: "TWILIO",
    apiKey: "",
    apiSecret: "",
    senderId: "",
    webhookUrl: "",
  });

  const [testPhone, setTestPhone] = useState("");
  const [showApiSecret, setShowApiSecret] = useState(false);

  useEffect(() => {
    if (data?.smsSettings) {
      const settings: SmsSettingsType = data.smsSettings;
      setFormData({
        isActive: settings.isActive,
        provider: settings.provider || "TWILIO",
        senderId: settings.senderId || "",
        webhookUrl: settings.webhookUrl || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
        variables: { input: formData },
      });

      toast.success("SMS settings updated successfully!");
      refetch();
    } catch (error: any) {
      console.error("Error updating SMS settings:", error);
      toast.error(error.message || "Failed to update SMS settings");
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnection();
      toast.success("SMS connection test successful!");
      refetch();
    } catch (error: any) {
      console.error("Error testing connection:", error);
      toast.error(error.message || "SMS connection test failed");
    }
  };

  const handleSendTestSms = async () => {
    if (!testPhone) {
      toast.error("Please enter a test phone number");
      return;
    }

    try {
      await sendTest({
        variables: { input: { phoneNumber: testPhone } },
      });
      toast.success(`Test SMS sent to ${testPhone}!`);
      setTestPhone("");
    } catch (error: any) {
      console.error("Error sending test SMS:", error);
      toast.error(error.message || "Failed to send test SMS");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const settings: SmsSettingsType | undefined = data?.smsSettings;
  const lastTestStatus = settings?.testResult;
  const lastTested = settings?.lastTested;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DevicePhoneMobileIcon className="h-7 w-7 text-indigo-600" />
          SMS Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure SMS provider for sending automated text messages
        </p>
      </div>

      {/* Status Banner */}
      {lastTestStatus && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            lastTestStatus === "SUCCESS"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {lastTestStatus === "SUCCESS" ? (
            <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                lastTestStatus === "SUCCESS" ? "text-green-800" : "text-red-800"
              }`}
            >
              {lastTestStatus === "SUCCESS"
                ? "SMS connection is working"
                : "SMS connection failed"}
            </p>
            {lastTested && (
              <p
                className={`text-xs mt-1 ${
                  lastTestStatus === "SUCCESS" ? "text-green-600" : "text-red-600"
                }`}
              >
                Last tested: {new Date(lastTested).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Active Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-900">
                Enable SMS Service
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Turn on to start sending automated SMS messages
              </p>
            </div>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </label>
        </div>

        {/* Provider Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Provider Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Provider *
              </label>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="TWILIO">Twilio</option>
                <option value="NEXMO">Nexmo (Vonage)</option>
                <option value="AFRICAS_TALKING">Africa's Talking</option>
                <option value="MESSAGEBIRD">MessageBird</option>
                <option value="CUSTOM">Custom Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key / Account SID *
              </label>
              <input
                type="text"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="Enter your API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Secret / Auth Token *
              </label>
              <div className="relative">
                <input
                  type={showApiSecret ? "text" : "password"}
                  name="apiSecret"
                  value={formData.apiSecret}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiSecret(!showApiSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showApiSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sender ID / Phone Number *
              </label>
              <input
                type="text"
                name="senderId"
                value={formData.senderId}
                onChange={handleChange}
                placeholder="+1234567890 or YourChurch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Phone number or alphanumeric sender ID
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL (Optional)
              </label>
              <input
                type="url"
                name="webhookUrl"
                value={formData.webhookUrl}
                onChange={handleChange}
                placeholder="https://yourchurch.com/webhooks/sms"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                For delivery status callbacks
              </p>
            </div>
          </div>
        </div>

        {/* Provider-Specific Help */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            📘 Provider Setup Guide
          </h4>
          <div className="text-xs text-blue-800 space-y-1">
            {formData.provider === "TWILIO" && (
              <>
                <p>• Get your Account SID and Auth Token from Twilio Console</p>
                <p>• Use your Twilio phone number as Sender ID</p>
                <p>• Visit: console.twilio.com</p>
              </>
            )}
            {formData.provider === "AFRICAS_TALKING" && (
              <>
                <p>• Get your API Key from Africa's Talking Dashboard</p>
                <p>• Use your approved sender ID or shortcode</p>
                <p>• Visit: account.africastalking.com</p>
              </>
            )}
            {formData.provider === "NEXMO" && (
              <>
                <p>• Get your API Key and Secret from Vonage Dashboard</p>
                <p>• Use your virtual number or alphanumeric sender ID</p>
                <p>• Visit: dashboard.nexmo.com</p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {updating ? "Saving..." : "Save Settings"}
          </button>

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !formData.provider}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </form>

      {/* Send Test SMS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Send Test SMS
        </h3>
        <div className="flex gap-3">
          <input
            type="tel"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            placeholder="+1234567890"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendTestSms}
            disabled={sending || !testPhone || !formData.isActive}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {sending ? "Sending..." : "Send Test"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Send a test SMS to verify your configuration is working correctly
        </p>
      </div>
    </div>
  );
}
