"use client";

import React from "react";
import { Title } from "@tremor/react";
import {
  DeathRegister,
  CreateDeathRegisterInput,
  UpdateDeathRegisterInput,
} from "../../types/deathRegister";
import { DeathRegisterForm } from "./DeathRegisterFormNew";

interface DeathRegisterModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  selectedRecord?: DeathRegister | null;
  onClose: () => void;
  onSubmit: (data: CreateDeathRegisterInput | UpdateDeathRegisterInput) => void;
  organisationId: string;
  branchId: string;
}

export const DeathRegisterModal: React.FC<DeathRegisterModalProps> = ({
  isOpen,
  mode,
  selectedRecord,
  onClose,
  onSubmit,
  organisationId,
  branchId,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (
    data: CreateDeathRegisterInput | UpdateDeathRegisterInput,
  ) => {
    await onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <Title className="text-xl font-semibold text-slate-800">
            {mode === "create" ? "Add New Death Record" : "Edit Death Record"}
          </Title>
        </div>
        <div className="p-6">
          <DeathRegisterForm
            initialData={
              mode === "edit" ? selectedRecord || undefined : undefined
            }
            onSubmit={handleSubmit}
            onCancel={onClose}
            organisationId={organisationId}
            branchId={branchId}
          />
        </div>
      </div>
    </div>
  );
};
