'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Cog,
  Save,
  Settings,
  Lock,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { RouteGuard } from '@/components/RouteGuard';

const GET_FEATURE_FLAGS_QUERY = gql`
  query {
    godModeFeatureFlags {
      newDashboard
      advancedReporting
      apiIntegrations
      customRoles
      bulkOperations
      dataExport
      maintenanceMode
    }
  }
`;

const GET_EMAIL_SETTINGS_QUERY = gql`
  query {
    godModeEmailSettings {
      provider
      apiKey
      fromEmail
      fromName
      replyTo
    }
  }
`;

const GET_PAYMENT_SETTINGS_QUERY = gql`
  query {
    godModePaymentSettings {
      provider
      publicKey
      secretKey
      currency
      testMode
    }
  }
`;

const GET_SECURITY_SETTINGS_QUERY = gql`
  query {
    godModeSecuritySettings {
      sessionTimeout
      maxLoginAttempts
      passwordMinLength
      requireMFA
      ipWhitelist
      enableAuditLogging
      dataEncryption
    }
  }
`;

const TOGGLE_FEATURE_FLAG_MUTATION = gql`
  mutation ToggleFeatureFlag($flag: String!, $enabled: Boolean!) {
    godModeToggleFeatureFlag(flag: $flag, enabled: $enabled) {
      newDashboard
      advancedReporting
      apiIntegrations
      customRoles
      bulkOperations
      dataExport
      maintenanceMode
    }
  }
`;

const UPDATE_EMAIL_SETTINGS_MUTATION = gql`
  mutation UpdateEmailSettings($input: UpdateEmailSettingsInputType!) {
    godModeUpdateEmailSettings(input: $input) {
      provider
      apiKey
      fromEmail
      fromName
      replyTo
    }
  }
`;

const UPDATE_PAYMENT_SETTINGS_MUTATION = gql`
  mutation UpdatePaymentSettings($input: UpdatePaymentSettingsInputType!) {
    godModeUpdatePaymentSettings(input: $input) {
      provider
      publicKey
      secretKey
      currency
      testMode
    }
  }
`;

const UPDATE_SECURITY_SETTINGS_MUTATION = gql`
  mutation UpdateSecuritySettings($input: UpdateSecuritySettingsInputType!) {
    godModeUpdateSecuritySettings(input: $input) {
      sessionTimeout
      maxLoginAttempts
      passwordMinLength
      requireMFA
      ipWhitelist
      enableAuditLogging
      dataEncryption
    }
  }
`;

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('features');
  const [emailSettings, setEmailSettings] = useState({
    provider: '',
    apiKey: '',
    fromEmail: '',
    fromName: '',
    replyTo: '',
  });
  const [paymentSettings, setPaymentSettings] = useState({
    provider: '',
    publicKey: '',
    secretKey: '',
    currency: '',
    testMode: false,
  });
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireMFA: false,
    enableAuditLogging: true,
    dataEncryption: true,
  });

  const { data: featureFlags, loading: flagsLoading } = useQuery(GET_FEATURE_FLAGS_QUERY);
  const { data: emailData, loading: emailLoading } = useQuery(GET_EMAIL_SETTINGS_QUERY, {
    onCompleted: (data) => {
      if (data?.godModeEmailSettings) {
        setEmailSettings(data.godModeEmailSettings);
      }
    },
  });
  const { data: paymentData, loading: paymentLoading } = useQuery(GET_PAYMENT_SETTINGS_QUERY, {
    onCompleted: (data) => {
      if (data?.godModePaymentSettings) {
        setPaymentSettings(data.godModePaymentSettings);
      }
    },
  });
  const { data: securityData, loading: securityLoading } = useQuery(GET_SECURITY_SETTINGS_QUERY, {
    onCompleted: (data) => {
      if (data?.godModeSecuritySettings) {
        setSecuritySettings(data.godModeSecuritySettings);
      }
    },
  });

  const [toggleFeatureFlag] = useMutation(TOGGLE_FEATURE_FLAG_MUTATION);
  const [updateEmailSettings] = useMutation(UPDATE_EMAIL_SETTINGS_MUTATION);
  const [updatePaymentSettings] = useMutation(UPDATE_PAYMENT_SETTINGS_MUTATION);
  const [updateSecuritySettings] = useMutation(UPDATE_SECURITY_SETTINGS_MUTATION);

  const handleToggleFeature = async (flag: string, currentValue: boolean) => {
    try {
      await toggleFeatureFlag({
        variables: {
          flag,
          enabled: !currentValue,
        },
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleUpdateEmailSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmailSettings({
        variables: { input: emailSettings },
      });
      alert('Email settings updated successfully');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleUpdatePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePaymentSettings({
        variables: { input: paymentSettings },
      });
      alert('Payment settings updated successfully');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleUpdateSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSecuritySettings({
        variables: { input: securitySettings },
      });
      alert('Security settings updated successfully');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const flags = featureFlags?.godModeFeatureFlags || {};

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 p-8 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Cog className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    System Configuration
                  </h1>
                  <p className="text-white/90 text-lg">
                    Manage system settings and configurations
                  </p>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => toast.success('Settings saved successfully!')}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save All
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-2 mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'features', label: 'Feature Flags', icon: Settings },
                { id: 'email', label: 'Email Settings', icon: CreditCard },
                { id: 'payment', label: 'Payment Settings', icon: CreditCard },
                { id: 'security', label: 'Security Settings', icon: ShieldCheck },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <TabIcon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {/* Feature Flags */}
            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Feature Flags</h2>
                {flagsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(flags).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:shadow-md transition-all">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {value ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleFeature(key, value as boolean)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          value
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {value ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Email Settings</h2>
                {emailLoading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                ) : (
                  <form onSubmit={handleUpdateEmailSettings} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Provider
                        </label>
                        <input
                          type="text"
                          value={emailSettings.provider}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, provider: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={emailSettings.apiKey}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, apiKey: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailSettings.fromEmail}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Name
                        </label>
                        <input
                          type="text"
                          value={emailSettings.fromName}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, fromName: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reply To
                        </label>
                        <input
                          type="email"
                          value={emailSettings.replyTo}
                          onChange={(e) =>
                            setEmailSettings({ ...emailSettings, replyTo: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Email Settings
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h2>
                {paymentLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    Payment settings form would go here
                  </div>
                )}
              </motion.div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                {securityLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    Security settings form would go here
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RouteGuard>
  );
}
