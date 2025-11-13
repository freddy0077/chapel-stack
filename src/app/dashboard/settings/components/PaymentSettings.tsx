"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import {
  GET_PAYMENT_SETTINGS,
  UPDATE_PAYMENT_SETTINGS,
  UPDATE_PAYMENT_GATEWAY,
  VALIDATE_PAYMENT_GATEWAY,
  type PaymentSettings as PaymentSettingsType,
  type UpdatePaymentSettingsInput,
} from "@/graphql/settings/paymentSettings";

interface GatewayConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  testMode: boolean;
}

const PAYMENT_GATEWAYS = [
  {
    id: "PAYSTACK",
    name: "Paystack",
    description: "Accept payments across Africa",
    logo: "🇳🇬",
    fields: ["publicKey", "secretKey", "webhookSecret"],
  },
  {
    id: "STRIPE",
    name: "Stripe",
    description: "Global payment processing",
    logo: "💳",
    fields: ["publicKey", "secretKey", "webhookSecret"],
  },
  {
    id: "FLUTTERWAVE",
    name: "Flutterwave",
    description: "Pan-African payment gateway",
    logo: "🌍",
    fields: ["publicKey", "secretKey"],
  },
];

const PAYMENT_METHODS = [
  { id: "CARD", name: "Credit/Debit Card", icon: "💳" },
  { id: "BANK_TRANSFER", name: "Bank Transfer", icon: "🏦" },
  { id: "MOBILE_MONEY", name: "Mobile Money", icon: "📱" },
  { id: "USSD", name: "USSD", icon: "📞" },
  { id: "QR_CODE", name: "QR Code", icon: "📷" },
];

export default function PaymentSettings() {
  const { data, loading, refetch } = useQuery(GET_PAYMENT_SETTINGS);
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_PAYMENT_SETTINGS);
  const [updateGateway, { loading: updatingGateway }] = useMutation(UPDATE_PAYMENT_GATEWAY);
  const [validateGateway, { loading: validating }] = useMutation(VALIDATE_PAYMENT_GATEWAY);

  const [formData, setFormData] = useState<UpdatePaymentSettingsInput>({
    autoReceipt: true,
    feeBearer: "CUSTOMER",
    enabledMethods: [],
  });

  const [selectedGateway, setSelectedGateway] = useState<string>("PAYSTACK");
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig>({
    publicKey: "",
    secretKey: "",
    webhookSecret: "",
    testMode: true,
  });

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  useEffect(() => {
    if (data?.paymentSettings) {
      const settings: PaymentSettingsType = data.paymentSettings;
      setFormData({
        autoReceipt: settings.autoReceipt,
        feeBearer: settings.feeBearer || "CUSTOMER",
        enabledMethods: settings.enabledMethods || [],
      });

      // Load gateway config if exists
      if (settings.gateways && settings.gateways[selectedGateway]) {
        const config = settings.gateways[selectedGateway];
        setGatewayConfig({
          publicKey: config.publicKey || "",
          secretKey: "", // Never load secret key
          webhookSecret: "", // Never load webhook secret
          testMode: config.testMode || false,
        });
      }
    }
  }, [data, selectedGateway]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleGatewayConfigChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setGatewayConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const togglePaymentMethod = (methodId: string) => {
    setFormData((prev) => {
      const methods = prev.enabledMethods || [];
      const isEnabled = methods.includes(methodId);
      return {
        ...prev,
        enabledMethods: isEnabled
          ? methods.filter((m) => m !== methodId)
          : [...methods, methodId],
      };
    });
  };

  const handleSubmitSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
        variables: { input: formData },
      });

      toast.success("Payment settings updated successfully!");
      refetch();
    } catch (error: any) {
      console.error("Error updating payment settings:", error);
      toast.error(error.message || "Failed to update payment settings");
    }
  };

  const handleValidateGateway = async () => {
    if (!gatewayConfig.publicKey || !gatewayConfig.secretKey) {
      toast.error("Please enter both public and secret keys");
      return;
    }

    try {
      const result = await validateGateway({
        variables: {
          input: {
            gateway: selectedGateway,
            credentials: {
              publicKey: gatewayConfig.publicKey,
              secretKey: gatewayConfig.secretKey,
            },
          },
        },
      });

      if (result.data?.validatePaymentGateway) {
        toast.success("Gateway credentials validated successfully!");
      }
    } catch (error: any) {
      console.error("Error validating gateway:", error);
      toast.error(error.message || "Gateway validation failed");
    }
  };

  const handleSaveGateway = async () => {
    if (!gatewayConfig.publicKey || !gatewayConfig.secretKey) {
      toast.error("Please enter both public and secret keys");
      return;
    }

    try {
      await updateGateway({
        variables: {
          input: {
            gateway: selectedGateway,
            config: gatewayConfig,
          },
        },
      });

      toast.success(`${selectedGateway} gateway configured successfully!`);
      refetch();
    } catch (error: any) {
      console.error("Error updating gateway:", error);
      toast.error(error.message || "Failed to update gateway");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCardIcon className="h-7 w-7 text-indigo-600" />
          Payment Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure payment gateways and processing options
        </p>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSubmitSettings} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            General Settings
          </h3>

          <div className="space-y-4">
            {/* Auto Receipt */}
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Auto-Generate Receipts
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Automatically send receipts after successful payments
                </p>
              </div>
              <input
                type="checkbox"
                name="autoReceipt"
                checked={formData.autoReceipt}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </label>

            {/* Fee Bearer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Fee Bearer
              </label>
              <select
                name="feeBearer"
                value={formData.feeBearer}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="CUSTOMER">Customer pays fees</option>
                <option value="CHURCH">Church absorbs fees</option>
                <option value="SPLIT">Split fees 50/50</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {updating ? "Saving..." : "Save General Settings"}
          </button>
        </div>
      </form>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enabled Payment Methods
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const isEnabled = formData.enabledMethods?.includes(method.id);
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => togglePaymentMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isEnabled
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{method.icon}</span>
                  {isEnabled && (
                    <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {method.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Gateway Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Payment Gateway Configuration
        </h3>

        {/* Gateway Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PAYMENT_GATEWAYS.map((gateway) => (
            <button
              key={gateway.id}
              type="button"
              onClick={() => setSelectedGateway(gateway.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedGateway === gateway.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="text-3xl mb-2">{gateway.logo}</div>
              <p className="text-sm font-semibold text-gray-900">
                {gateway.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {gateway.description}
              </p>
            </button>
          ))}
        </div>

        {/* Gateway Configuration Form */}
        <div className="space-y-4 border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900">
            Configure {selectedGateway}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Public Key *
              </label>
              <input
                type="text"
                name="publicKey"
                value={gatewayConfig.publicKey}
                onChange={handleGatewayConfigChange}
                placeholder="pk_test_..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Key *
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? "text" : "password"}
                  name="secretKey"
                  value={gatewayConfig.secretKey}
                  onChange={handleGatewayConfigChange}
                  placeholder="sk_test_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showSecretKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Secret (Optional)
              </label>
              <div className="relative">
                <input
                  type={showWebhookSecret ? "text" : "password"}
                  name="webhookSecret"
                  value={gatewayConfig.webhookSecret}
                  onChange={handleGatewayConfigChange}
                  placeholder="whsec_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
                >
                  {showWebhookSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="testMode"
                  checked={gatewayConfig.testMode}
                  onChange={handleGatewayConfigChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                />
                <span className="text-sm font-medium text-gray-900">
                  Test Mode
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleValidateGateway}
              disabled={validating}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
            >
              <ShieldCheckIcon className="h-4 w-4" />
              {validating ? "Validating..." : "Validate Credentials"}
            </button>

            <button
              type="button"
              onClick={handleSaveGateway}
              disabled={updatingGateway}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {updatingGateway ? "Saving..." : "Save Gateway Config"}
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          🔐 Security Best Practices
        </h4>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Always use test mode for development and testing</li>
          <li>Never share your secret keys publicly</li>
          <li>Rotate keys periodically for security</li>
          <li>Configure webhook URLs in your payment provider dashboard</li>
          <li>Monitor transaction logs for suspicious activity</li>
        </ul>
      </div>
    </div>
  );
}
