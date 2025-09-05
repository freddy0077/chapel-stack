import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPinIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { StepProps } from "./types";

export const AddressLocationStep: React.FC<StepProps> = ({
  organizationData,
  errors,
  updateField,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" />
          Full Address *
        </Label>
        <Textarea
          id="address"
          value={organizationData.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Enter the complete physical address"
          className={`mt-2 ${errors.address ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
          rows={3}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
            City *
          </Label>
          <Input
            id="city"
            value={organizationData.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Enter city"
            className={`mt-2 ${errors.city ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
            State/Region *
          </Label>
          <Input
            id="state"
            value={organizationData.state}
            onChange={(e) => updateField("state", e.target.value)}
            placeholder="Enter state or region"
            className={`mt-2 ${errors.state ? "border-red-500 focus:border-red-500" : "focus:border-blue-500"}`}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.state}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
            Country *
          </Label>
          <Select
            value={organizationData.country}
            onValueChange={(value) => updateField("country", value)}
          >
            <SelectTrigger className="mt-2 focus:border-blue-500">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ghana">🇬🇭 Ghana</SelectItem>
              <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
              <SelectItem value="Kenya">🇰🇪 Kenya</SelectItem>
              <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
              <SelectItem value="Uganda">🇺🇬 Uganda</SelectItem>
              <SelectItem value="Tanzania">🇹🇿 Tanzania</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="zipCode" className="text-sm font-semibold text-gray-700">
            Postal Code
          </Label>
          <Input
            id="zipCode"
            value={organizationData.zipCode}
            onChange={(e) => updateField("zipCode", e.target.value)}
            placeholder="Enter postal code"
            className="mt-2 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
