'use client';

import React from 'react';
import { Card, Title, Text, Badge, Flex } from '@tremor/react';
import { DeathRegister } from '../../types/deathRegister';
import { formatDate } from '../../utils/dateUtils';

interface RecentDeathsSectionProps {
  recentDeaths: DeathRegister[];
}

export const RecentDeathsSection: React.FC<RecentDeathsSectionProps> = ({
  recentDeaths,
}) => {
  if (recentDeaths.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
      <Title className="text-red-800 mb-4">Recent Deaths (Last 30 Days)</Title>
      <div className="space-y-3">
        {recentDeaths.map((record) => (
          <div key={record.id} className="bg-white rounded-lg p-4 border border-red-100">
            <Flex justifyContent="between" alignItems="center">
              <div>
                <Text className="font-semibold text-slate-900">
                  {record.member?.firstName} {record.member?.lastName}
                </Text>
                <Text className="text-slate-600 text-sm">
                  {formatDate(record.dateOfDeath)} • Age {record.ageAtDeath}
                </Text>
              </div>
              <Badge className={`${
                record.familyNotified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {record.familyNotified ? 'Family Notified' : 'Pending Notification'}
              </Badge>
            </Flex>
          </div>
        ))}
      </div>
    </Card>
  );
};
