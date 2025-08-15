'use client';

import React from 'react';
import { Card, Title, Text, Grid, Button } from '@tremor/react';
import { UserIcon, PhoneIcon, EnvelopeIcon, CalendarDaysIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FamilyContactSectionProps {
  nextOfKin: string;
  nextOfKinPhone: string;
  nextOfKinEmail: string;
  familyNotified: boolean;
  notificationDate: string;
  onFieldChange: (field: string, value: string | boolean) => void;
  errors: Record<string, string>;
}

export const FamilyContactSection: React.FC<FamilyContactSectionProps> = ({
  nextOfKin,
  nextOfKinPhone,
  nextOfKinEmail,
  familyNotified,
  notificationDate,
  onFieldChange,
  errors,
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <Title className="text-green-800 mb-4 flex items-center">
        <UserIcon className="h-5 w-5 mr-2" />
        Family Contact & Notification
      </Title>
      
      <Grid numItems={1} numItemsSm={2} className="gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <UserIcon className="h-4 w-4 inline mr-1" />
            Next of Kin *
          </label>
          <input
            type="text"
            value={nextOfKin}
            onChange={(e) => onFieldChange('nextOfKin', e.target.value)}
            placeholder="Full name of next of kin"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.nextOfKin ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            required
          />
          {errors.nextOfKin && (
            <Text className="text-red-600 text-sm mt-1">{errors.nextOfKin}</Text>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <PhoneIcon className="h-4 w-4 inline mr-1" />
            Next of Kin Phone
          </label>
          <input
            type="tel"
            value={nextOfKinPhone}
            onChange={(e) => onFieldChange('nextOfKinPhone', e.target.value)}
            placeholder="Phone number"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <EnvelopeIcon className="h-4 w-4 inline mr-1" />
            Next of Kin Email
          </label>
          <input
            type="email"
            value={nextOfKinEmail}
            onChange={(e) => onFieldChange('nextOfKinEmail', e.target.value)}
            placeholder="Email address"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </Grid>

      <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <Text className="font-medium text-slate-700">Family Notification Status</Text>
          <Button
            size="sm"
            variant={familyNotified ? "secondary" : "primary"}
            icon={CheckIcon}
            onClick={() => onFieldChange('familyNotified', !familyNotified)}
            className={familyNotified ? "bg-green-100 text-green-800" : "bg-green-600 text-white"}
          >
            {familyNotified ? 'Notified' : 'Mark as Notified'}
          </Button>
        </div>
        
        {familyNotified && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
              Notification Date
            </label>
            <input
              type="date"
              value={notificationDate}
              onChange={(e) => onFieldChange('notificationDate', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
