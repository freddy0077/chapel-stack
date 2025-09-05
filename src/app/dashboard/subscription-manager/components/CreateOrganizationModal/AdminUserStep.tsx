import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { StepProps } from "./types";
import { COUNTRY_CODES } from "./countryCodes";

export const AdminUserStep: React.FC<StepProps> = ({
  organizationData,
  errors,
  updateField,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <UserIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Administrator Account</h3>
        </div>
        <p className="text-sm text-blue-700">
          This will be the primary administrator account for your organization. They will have full access to manage the system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="adminFirstName" className="text-sm font-semibold text-gray-700">
            First Name *
          </Label>
          <Input
            id="adminFirstName"
            value={organizationData.adminFirstName}
            onChange={(e) => updateField("adminFirstName", e.target.value)}
            placeholder="Enter first name"
            className={`mt-2 ${errors.adminFirstName ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
          />
          {errors.adminFirstName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.adminFirstName}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="adminLastName" className="text-sm font-semibold text-gray-700">
            Last Name *
          </Label>
          <Input
            id="adminLastName"
            value={organizationData.adminLastName}
            onChange={(e) => updateField("adminLastName", e.target.value)}
            placeholder="Enter last name"
            className={`mt-2 ${errors.adminLastName ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
          />
          {errors.adminLastName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.adminLastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="adminEmail" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <EnvelopeIcon className="w-4 h-4" />
          Admin Email Address *
        </Label>
        <Input
          id="adminEmail"
          type="email"
          value={organizationData.adminEmail}
          onChange={(e) => updateField("adminEmail", e.target.value)}
          placeholder="admin@organization.com"
          className={`mt-2 ${errors.adminEmail ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
        />
        {errors.adminEmail && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {errors.adminEmail}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="adminPassword" className="text-sm font-semibold text-gray-700">
            Admin Password *
          </Label>
          <Input
            id="adminPassword"
            type="password"
            value={organizationData.adminPassword}
            onChange={(e) => updateField("adminPassword", e.target.value)}
            placeholder="Create a secure password"
            className={`mt-2 ${errors.adminPassword ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
          />
          {errors.adminPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.adminPassword}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Minimum 8 characters with uppercase, lowercase, and numbers
          </p>
        </div>

        <div>
          <Label htmlFor="adminPhone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            Admin Phone
          </Label>
          <div className="flex gap-2 mt-2">
            <Select
              value={organizationData.adminPhoneCountryCode}
              onValueChange={(value) => updateField("adminPhoneCountryCode", value)}
            >
              <SelectTrigger className={`w-32 ${errors.adminPhone ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}>
                <SelectValue>
                  {COUNTRY_CODES.find(c => c.dialCode === organizationData.adminPhoneCountryCode)?.flag} {organizationData.adminPhoneCountryCode}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {COUNTRY_CODES.map((country) => (
                  <SelectItem key={country.code} value={country.dialCode}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.dialCode}</span>
                      <span className="text-sm text-gray-500">{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="adminPhone"
              value={organizationData.adminPhone}
              onChange={(e) => updateField("adminPhone", e.target.value)}
              placeholder="24 123 4567"
              className={`flex-1 ${errors.adminPhone ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
            />
          </div>
          {errors.adminPhone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.adminPhone}
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The admin user will receive login
          credentials via email and will have full access to manage the
          organization.
        </p>
      </div>
    </div>
  );
};
