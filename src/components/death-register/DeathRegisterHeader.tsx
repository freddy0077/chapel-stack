"use client";

import React from "react";
import { Title, Text, Button, Flex } from "@tremor/react";
import { PlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";

interface DeathRegisterHeaderProps {
  onAddRecord: () => void;
}

export const DeathRegisterHeader: React.FC<DeathRegisterHeaderProps> = ({
  onAddRecord,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl p-8 text-white">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="text-3xl font-bold text-white mb-2">
            Death Register
          </Title>
          <Text className="text-slate-300 text-lg">
            Manage and track records of deceased members with care and respect
          </Text>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <UserMinusIcon className="h-8 w-8 text-white" />
          </div>
          <Button
            onClick={onAddRecord}
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 py-3 rounded-lg shadow-lg"
            icon={PlusIcon}
          >
            Add Death Record
          </Button>
        </div>
      </Flex>
    </div>
  );
};
