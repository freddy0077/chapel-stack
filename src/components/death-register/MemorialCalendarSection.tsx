'use client';

import React from 'react';
import { Card, Title, Text, Badge, Flex } from '@tremor/react';
import { DeathRegister } from '../../types/deathRegister';
import { formatDate, getMemorialAnniversary } from '../../utils/dateUtils';

interface MemorialCalendarSectionProps {
  upcomingMemorials: DeathRegister[];
  loading?: boolean;
}

export const MemorialCalendarSection: React.FC<MemorialCalendarSectionProps> = ({
  upcomingMemorials,
  loading = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <Title className="text-purple-800 mb-4">Upcoming Memorial Anniversaries</Title>
        {loading ? (
          <Text>Loading memorial calendar...</Text>
        ) : upcomingMemorials && upcomingMemorials.length > 0 ? (
          <div className="space-y-4">
            {upcomingMemorials.map((memorial) => (
              <Card key={memorial.id} className="bg-white border border-purple-100">
                <Flex justifyContent="between" alignItems="center">
                  <div>
                    <Text className="font-semibold text-slate-900">
                      {memorial.member?.firstName} {memorial.member?.lastName}
                    </Text>
                    <Text className="text-slate-600">
                      {getMemorialAnniversary(memorial.dateOfDeath)} • 
                      Died {formatDate(memorial.dateOfDeath)}
                    </Text>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    Memorial Anniversary
                  </Badge>
                </Flex>
              </Card>
            ))}
          </div>
        ) : (
          <Text className="text-slate-600">No upcoming memorial anniversaries</Text>
        )}
      </div>
    </div>
  );
};
