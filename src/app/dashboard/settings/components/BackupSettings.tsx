"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  CircleStackIcon,
  ClockIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import {
  GET_BACKUP_SETTINGS,
  GET_BACKUPS,
  UPDATE_BACKUP_SETTINGS,
  CREATE_BACKUP,
  DELETE_BACKUP,
  type BackupSettings as BackupSettingsType,
  type Backup,
  type UpdateBackupSettingsInput,
} from "@/graphql/settings/backupSettings";

export default function BackupSettings() {
  const { data: settingsData, loading: settingsLoading, refetch: refetchSettings } = useQuery(GET_BACKUP_SETTINGS);
  const { data: backupsData, loading: backupsLoading, refetch: refetchBackups } = useQuery(GET_BACKUPS, {
    variables: { limit: 10 },
  });
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_BACKUP_SETTINGS);
  const [createBackup, { loading: creating }] = useMutation(CREATE_BACKUP);
  const [deleteBackup, { loading: deleting }] = useMutation(DELETE_BACKUP);

  const [formData, setFormData] = useState<UpdateBackupSettingsInput>({
    autoBackup: false,
    frequency: "DAILY",
    time: "02:00",
    storageType: "LOCAL",
    retentionDays: 30,
    maxBackups: 10,
    encryptBackups: true,
    notifyOnSuccess: true,
    notifyOnFailure: true,
    notificationEmails: [],
  });

  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    if (settingsData?.backupSettings) {
      const settings: BackupSettingsType = settingsData.backupSettings;
      setFormData({
        autoBackup: settings.autoBackup,
        frequency: settings.frequency || "DAILY",
        time: settings.time || "02:00",
        storageType: settings.storageType || "LOCAL",
        retentionDays: settings.retentionDays,
        maxBackups: settings.maxBackups,
        encryptBackups: settings.encryptBackups,
        notifyOnSuccess: settings.notifyOnSuccess,
        notifyOnFailure: settings.notifyOnFailure,
        notificationEmails: settings.notificationEmails || [],
      });
    }
  }, [settingsData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleAddEmail = () => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setFormData((prev) => ({
        ...prev,
        notificationEmails: [...(prev.notificationEmails || []), emailInput],
      }));
      setEmailInput("");
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      notificationEmails: (prev.notificationEmails || []).filter((e) => e !== email),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
        variables: { input: formData },
      });

      toast.success("Backup settings updated successfully!");
      refetchSettings();
    } catch (error: any) {
      console.error("Error updating backup settings:", error);
      toast.error(error.message || "Failed to update backup settings");
    }
  };

  const handleCreateBackup = async () => {
    try {
      await createBackup();
      toast.success("Backup started! This may take a few minutes.");
      refetchBackups();
    } catch (error: any) {
      console.error("Error creating backup:", error);
      toast.error(error.message || "Failed to create backup");
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm("Are you sure you want to delete this backup?")) {
      return;
    }

    try {
      await deleteBackup({
        variables: { id: backupId },
      });
      toast.success("Backup deleted successfully!");
      refetchBackups();
    } catch (error: any) {
      console.error("Error deleting backup:", error);
      toast.error(error.message || "Failed to delete backup");
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const settings: BackupSettingsType | undefined = settingsData?.backupSettings;
  const backups: Backup[] = backupsData?.backups?.backups || [];
  const lastBackupStatus = settings?.lastBackupStatus;
  const lastBackupAt = settings?.lastBackupAt;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CircleStackIcon className="h-7 w-7 text-indigo-600" />
          Backup Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure automated backups and manage backup history
        </p>
      </div>

      {/* Status Banner */}
      {lastBackupStatus && (
        <div
          className={`rounded-lg p-4 flex items-start gap-3 ${
            lastBackupStatus === "SUCCESS"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {lastBackupStatus === "SUCCESS" ? (
            <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                lastBackupStatus === "SUCCESS" ? "text-green-800" : "text-red-800"
              }`}
            >
              {lastBackupStatus === "SUCCESS"
                ? "Last backup completed successfully"
                : "Last backup failed"}
            </p>
            {lastBackupAt && (
              <p
                className={`text-xs mt-1 ${
                  lastBackupStatus === "SUCCESS" ? "text-green-600" : "text-red-600"
                }`}
              >
                {new Date(lastBackupAt).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleCreateBackup}
            disabled={creating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium flex items-center gap-2"
          >
            <PlayIcon className="h-4 w-4" />
            {creating ? "Creating..." : "Backup Now"}
          </button>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Automated Backups */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Automated Backups
          </h3>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-900">
                Enable Automatic Backups
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Automatically backup your data on a schedule
              </p>
            </div>
            <input
              type="checkbox"
              name="autoBackup"
              checked={formData.autoBackup}
              onChange={handleChange}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </label>

          {formData.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time (24-hour format)
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Storage Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Storage Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Type
              </label>
              <select
                name="storageType"
                value={formData.storageType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="LOCAL">Local Storage</option>
                <option value="AWS_S3">Amazon S3</option>
                <option value="GOOGLE_CLOUD">Google Cloud Storage</option>
                <option value="AZURE">Azure Blob Storage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retention Period (days)
              </label>
              <input
                type="number"
                name="retentionDays"
                value={formData.retentionDays}
                onChange={handleChange}
                min="1"
                max="365"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Backups to Keep
              </label>
              <input
                type="number"
                name="maxBackups"
                value={formData.maxBackups}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="encryptBackups"
                  checked={formData.encryptBackups}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm font-medium text-gray-900">
                  Encrypt Backups
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Notifications
          </h3>

          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyOnSuccess"
                checked={formData.notifyOnSuccess}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm font-medium text-gray-900">
                Notify on successful backups
              </span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifyOnFailure"
                checked={formData.notifyOnFailure}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm font-medium text-gray-900">
                Notify on failed backups
              </span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Emails
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEmail())}
                  placeholder="admin@yourchurch.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.notificationEmails?.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="hover:text-indigo-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {updating ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Backup History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Backup History
          </h3>
          <button
            onClick={() => refetchBackups()}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {backupsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : backups.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No backups found</p>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CircleStackIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {backup.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(backup.createdAt).toLocaleString()} •{" "}
                        {formatFileSize(backup.fileSize)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      backup.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : backup.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {backup.status}
                  </span>
                  <button
                    onClick={() => handleDeleteBackup(backup.id)}
                    disabled={deleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    title="Delete backup"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
