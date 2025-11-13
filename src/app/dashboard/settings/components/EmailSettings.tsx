"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  GET_EMAIL_SETTINGS,
  UPDATE_EMAIL_SETTINGS,
  TEST_EMAIL_CONNECTION,
  SEND_TEST_EMAIL,
  type EmailSettings as EmailSettingsType,
  type UpdateEmailSettingsInput,
} from "@/graphql/settings/emailSettings";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

export default function EmailSettings() {
  const { branchId } = useOrganisationBranch();

  const { data, loading, refetch } = useQuery(GET_EMAIL_SETTINGS, {
    variables: { branchId },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_EMAIL_SETTINGS);
  const [testConnection, { loading: testing }] = useMutation(TEST_EMAIL_CONNECTION);
  const [sendTest, { loading: sending }] = useMutation(SEND_TEST_EMAIL);

  const [formData, setFormData] = useState<UpdateEmailSettingsInput>({
    isActive: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    smtpEncryption: "TLS",
    fromEmail: "",
    fromName: "",
    replyToEmail: "",
  });

  const [testEmail, setTestEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data?.emailSettings) {
      const settings: EmailSettingsType = data.emailSettings;
      setFormData({
        isActive: settings.isActive,
        smtpHost: settings.smtpHost || "",
        smtpPort: settings.smtpPort || 587,
        smtpUsername: settings.smtpUsername || "",
        smtpEncryption: settings.smtpEncryption || "TLS",
        fromEmail: settings.fromEmail || "",
        fromName: settings.fromName || "",
        replyToEmail: settings.replyToEmail || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked :
        name === "smtpPort" ? parseInt(value) || 587 :
        value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
        variables: { input: formData, branchId },
      });

      toast.success("Email settings updated successfully!");
      refetch({ branchId });
    } catch (error: any) {
      console.error("Error updating email settings:", error);
      toast.error(error.message || "Failed to update email settings");
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnection({ variables: { branchId } });
      toast.success("Email connection test successful!");
      refetch({ branchId });
    } catch (error: any) {
      console.error("Error testing connection:", error);
      toast.error(error.message || "Email connection test failed");
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }

    try {
      await sendTest({
        variables: { input: { toEmail: testEmail }, branchId },
      });
      toast.success(`Test email sent to ${testEmail}!`);
      setTestEmail("");
    } catch (error: any) {
      console.error("Error sending test email:", error);
      toast.error(error.message || "Failed to send test email");
    }
  };

  if (!branchId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
        <p className="text-sm font-medium">Select a branch to configure email settings.</p>
        <p className="text-xs mt-1">Use the Branch Switcher at the top of the dashboard to choose a branch.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const settings: EmailSettingsType | undefined = data?.emailSettings;
  const lastTestStatus = settings?.testResult;
  const lastTested = settings?.lastTested;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <EnvelopeIcon className="h-7 w-7 text-indigo-600" />
          Email Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure SMTP settings for sending automated emails
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
                ? "Email connection is working"
                : "Email connection failed"}
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
                Enable Email Service
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Turn on to start sending automated emails
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

        {/* SMTP Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            SMTP Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Host *
              </label>
              <input
                type="text"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleChange}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port *
              </label>
              <input
                type="number"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleChange}
                placeholder="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="smtpUsername"
                value={formData.smtpUsername}
                onChange={handleChange}
                placeholder="your-email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="smtpPassword"
                  value={formData.smtpPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Encryption
              </label>
              <select
                name="smtpEncryption"
                value={formData.smtpEncryption}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="NONE">None</option>
                <option value="SSL">SSL</option>
                <option value="TLS">TLS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Sender Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Email *
              </label>
              <input
                type="email"
                name="fromEmail"
                value={formData.fromEmail}
                onChange={handleChange}
                placeholder="noreply@yourchurch.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Name *
              </label>
              <input
                type="text"
                name="fromName"
                value={formData.fromName}
                onChange={handleChange}
                placeholder="Your Church Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reply-To Email
              </label>
              <input
                type="email"
                name="replyToEmail"
                value={formData.replyToEmail}
                onChange={handleChange}
                placeholder="contact@yourchurch.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
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
            disabled={testing || !formData.smtpHost}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>
      </form>

      {/* Send Test Email */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Send Test Email
        </h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="recipient@example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSendTestEmail}
            disabled={sending || !testEmail || !formData.isActive}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {sending ? "Sending..." : "Send Test"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Send a test email to verify your configuration is working correctly
        </p>
      </div>
    </div>
  );
}
