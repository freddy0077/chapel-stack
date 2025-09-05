"use client";

import React from "react";
import { Card, Title, Text, Grid } from "@tremor/react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { BurialType } from "../../../types/deathRegister";

interface FuneralDetailsSectionProps {
  funeralDate: string;
  funeralLocation: string;
  funeralOfficiant: string;
  burialCremation: BurialType;
  cemeteryLocation: string;
  onFieldChange: (field: string, value: string | BurialType) => void;
  errors: Record<string, string>;
}

export const FuneralDetailsSection: React.FC<FuneralDetailsSectionProps> = ({
  funeralDate,
  funeralLocation,
  funeralOfficiant,
  burialCremation,
  cemeteryLocation,
  onFieldChange,
  errors,
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <Title className="text-purple-800 mb-4 flex items-center">
        <CalendarDaysIcon className="h-5 w-5 mr-2" />
        Funeral & Burial Details
      </Title>

      <Grid numItems={1} numItemsSm={2} className="gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
            Funeral Date
          </label>
          <input
            type="date"
            value={funeralDate}
            onChange={(e) => onFieldChange("funeralDate", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPinIcon className="h-4 w-4 inline mr-1" />
            Funeral Location
          </label>
          <input
            type="text"
            value={funeralLocation}
            onChange={(e) => onFieldChange("funeralLocation", e.target.value)}
            placeholder="Church, funeral home, etc."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <UserIcon className="h-4 w-4 inline mr-1" />
            Funeral Officiant
          </label>
          <input
            type="text"
            value={funeralOfficiant}
            onChange={(e) => onFieldChange("funeralOfficiant", e.target.value)}
            placeholder="Pastor, minister, etc."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Burial/Cremation Type
          </label>
          <select
            value={burialCremation}
            onChange={(e) =>
              onFieldChange("burialCremation", e.target.value as BurialType)
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value={BurialType.BURIAL}>Burial</option>
            <option value={BurialType.CREMATION}>Cremation</option>
            <option value={BurialType.OTHER}>Other</option>
          </select>
        </div>
      </Grid>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <MapPinIcon className="h-4 w-4 inline mr-1" />
          Cemetery/Final Resting Place
        </label>
        <input
          type="text"
          value={cemeteryLocation}
          onChange={(e) => onFieldChange("cemeteryLocation", e.target.value)}
          placeholder="Cemetery name and location"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
    </Card>
  );
};
