"use client";

import { useState, useEffect, useRef } from "react";
import { Combobox } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  UserIcon,
  ChevronUpDownIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@apollo/client";
import { GET_MEMBERS } from "@/graphql/queries/memberQueries";

interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  membershipStatus?: string;
  memberIdGeneratedAt?: string;
  memberId?: string;
}

interface EnhancedMemberSearchProps {
  selectedMember: Member | null;
  onMemberSelect: (member: Member | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showMemberDetails?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  error?: string;
}

export default function EnhancedMemberSearch({
  selectedMember,
  onMemberSelect,
  placeholder = "Search for a member...",
  disabled = false,
  showMemberDetails = true,
  autoFocus = false,
  required = false,
  error,
}: EnhancedMemberSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(GET_MEMBERS, {
    variables: {
      filters: {
        search: query,
        membershipStatus: "ACTIVE",
      },
      pagination: {
        page: 1,
        limit: 20,
      },
    },
    skip: query.length < 2,
    fetchPolicy: "cache-and-network",
  });

  const members = data?.members?.items || [];

  // Filter members based on query
  const filteredMembers =
    query === ""
      ? members.slice(0, 10)
      : members.filter((member: Member) => {
          const fullName =
            `${member.firstName} ${member.middleName || ""} ${member.lastName}`.toLowerCase();
          const searchQuery = query.toLowerCase();
          return (
            fullName.includes(searchQuery) ||
            member.email?.toLowerCase().includes(searchQuery) ||
            member.phoneNumber?.includes(searchQuery) ||
            member.memberId?.toLowerCase().includes(searchQuery)
          );
        });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const getDisplayName = (member: Member) => {
    return `${member.firstName} ${member.middleName ? member.middleName + " " : ""}${member.lastName}`;
  };

  const getMemberSubtitle = (member: Member) => {
    const parts = [];
    if (member.memberId) parts.push(`ID: ${member.memberId}`);
    if (member.email) parts.push(member.email);
    if (member.phoneNumber) parts.push(member.phoneNumber);
    return parts.join(" • ");
  };

  const clearSelection = () => {
    onMemberSelect(null);
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <Combobox value={selectedMember} onChange={onMemberSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <div className="flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-3" />
              <Combobox.Input
                ref={inputRef}
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
                displayValue={(member: Member) =>
                  member ? getDisplayName(member) : ""
                }
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                {selectedMember ? (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-400" />
                  </button>
                ) : (
                  <Combobox.Button className="flex items-center justify-center w-5 h-5">
                    <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                  </Combobox.Button>
                )}
              </div>
            </div>
          </div>

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {loading && query.length >= 2 && (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Searching members...</span>
                </div>
              </div>
            )}

            {queryError && (
              <div className="relative cursor-default select-none py-2 px-4 text-red-600">
                Failed to search members. Please try again.
              </div>
            )}

            {!loading && query.length >= 2 && filteredMembers.length === 0 && (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <span>No members found for "{query}"</span>
                </div>
              </div>
            )}

            {!loading && query.length < 2 && members.length > 0 && (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-500 text-sm">
                Type at least 2 characters to search members
              </div>
            )}

            {filteredMembers.map((member: Member) => (
              <Combobox.Option
                key={member.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-3 px-4 ${
                    active ? "bg-indigo-50 text-indigo-900" : "text-gray-900"
                  }`
                }
                value={member}
              >
                {({ selected, active }) => (
                  <div className="flex items-center space-x-3">
                    {member.profileImageUrl ? (
                      <img
                        src={member.profileImageUrl}
                        alt={getDisplayName(member)}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium truncate ${
                            selected ? "font-semibold" : ""
                          }`}
                        >
                          {getDisplayName(member)}
                        </p>
                        {selected && (
                          <CheckIcon className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {getMemberSubtitle(member)}
                      </p>
                      {member.membershipStatus && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                            member.membershipStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : member.membershipStatus === "INACTIVE"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.membershipStatus}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      {/* Selected Member Details */}
      {selectedMember && showMemberDetails && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-4">
            {selectedMember.profileImageUrl ? (
              <img
                src={selectedMember.profileImageUrl}
                alt={getDisplayName(selectedMember)}
                className="h-12 w-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900">
                {getDisplayName(selectedMember)}
              </h4>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                {selectedMember.memberId && (
                  <div>
                    <span className="font-medium">Member ID:</span>{" "}
                    {selectedMember.memberId}
                  </div>
                )}
                {selectedMember.email && (
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedMember.email}
                  </div>
                )}
                {selectedMember.phoneNumber && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedMember.phoneNumber}
                  </div>
                )}
                {selectedMember.dateOfBirth && (
                  <div>
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {new Date(selectedMember.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
                {selectedMember.gender && (
                  <div>
                    <span className="font-medium">Gender:</span>{" "}
                    {selectedMember.gender}
                  </div>
                )}
                {selectedMember.maritalStatus && (
                  <div>
                    <span className="font-medium">Marital Status:</span>{" "}
                    {selectedMember.maritalStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
