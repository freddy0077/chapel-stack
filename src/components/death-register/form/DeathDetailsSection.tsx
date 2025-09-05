"use client";

import React from "react";
import { Card, Title, Text, Grid } from "@tremor/react";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface DeathDetailsSectionProps {
  dateOfDeath: string;
  timeOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: string;
  circumstances: string;
  onFieldChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export const DeathDetailsSection: React.FC<DeathDetailsSectionProps> = ({
  dateOfDeath,
  timeOfDeath,
  placeOfDeath,
  causeOfDeath,
  circumstances,
  onFieldChange,
  errors,
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      <Title className="text-red-800 mb-4 flex items-center">
        <CalendarDaysIcon className="h-5 w-5 mr-2" />
        Death Details
      </Title>

      <Grid numItems={1} numItemsSm={2} className="gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
            Date of Death *
          </label>
          <input
            type="date"
            value={dateOfDeath}
            onChange={(e) => onFieldChange("dateOfDeath", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.dateOfDeath
                ? "border-red-300 bg-red-50"
                : "border-slate-300"
            }`}
            required
          />
          {errors.dateOfDeath && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.dateOfDeath}
            </Text>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <ClockIcon className="h-4 w-4 inline mr-1" />
            Time of Death
          </label>
          <input
            type="time"
            value={timeOfDeath}
            onChange={(e) => onFieldChange("timeOfDeath", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPinIcon className="h-4 w-4 inline mr-1" />
            Place of Death *
          </label>
          <input
            type="text"
            value={placeOfDeath}
            onChange={(e) => onFieldChange("placeOfDeath", e.target.value)}
            placeholder="e.g., Hospital, Home, etc."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.placeOfDeath
                ? "border-red-300 bg-red-50"
                : "border-slate-300"
            }`}
            required
          />
          {errors.placeOfDeath && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.placeOfDeath}
            </Text>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <DocumentTextIcon className="h-4 w-4 inline mr-1" />
            Cause of Death *
          </label>
          <input
            type="text"
            value={causeOfDeath}
            onChange={(e) => onFieldChange("causeOfDeath", e.target.value)}
            placeholder="Medical cause of death"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.causeOfDeath
                ? "border-red-300 bg-red-50"
                : "border-slate-300"
            }`}
            required
          />
          {errors.causeOfDeath && (
            <Text className="text-red-600 text-sm mt-1">
              {errors.causeOfDeath}
            </Text>
          )}
        </div>
      </Grid>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <DocumentTextIcon className="h-4 w-4 inline mr-1" />
          Circumstances (Optional)
        </label>
        <textarea
          value={circumstances}
          onChange={(e) => onFieldChange("circumstances", e.target.value)}
          placeholder="Additional details about the circumstances of death..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </Card>
  );
};
