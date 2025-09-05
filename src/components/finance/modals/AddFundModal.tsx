"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import SharedModal from "./SharedModal";

const CREATE_FUND = gql`
  mutation CreateFund($createFundInput: CreateFundInput!) {
    createFund(createFundInput: $createFundInput) {
      id
      name
      description
      organisationId
      branchId
    }
  }
`;

const GET_FUNDS = gql`
  query GetFunds($organisationId: String!, $branchId: String) {
    funds(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      branchId
    }
  }
`;

interface AddFundModalProps {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  branchId: string;
  onFundCreated: () => void;
}

export default function AddFundModal({
  open,
  onClose,
  organisationId,
  branchId,
  onFundCreated,
}: AddFundModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [createFund, { loading, error }] = useMutation(CREATE_FUND);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createFund({
        variables: {
          createFundInput: {
            name,
            description,
            isActive,
            organisationId,
            branchId,
          },
        },
        refetchQueries: [
          {
            query: GET_FUNDS,
            variables: { organisationId, branchId },
          },
        ],
        awaitRefetchQueries: true,
      });

      // Reset form
      setName("");
      setDescription("");
      setIsActive(true);

      // Notify parent and close modal
      onFundCreated();
      onClose();
    } catch (err) {
      console.error("Error creating fund:", err);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setDescription("");
    setIsActive(true);
    onClose();
  };

  return (
    <SharedModal
      open={open}
      title="Add Fund"
      onClose={handleClose}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fund Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter fund name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter fund description (optional)"
            rows={3}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="fund-active"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="fund-active" className="ml-2 text-sm text-gray-700">
            Active Fund
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              Error creating fund: {error.message}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Fund"}
          </button>
        </div>
      </form>
    </SharedModal>
  );
}
