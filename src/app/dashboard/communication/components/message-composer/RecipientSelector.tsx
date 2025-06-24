"use client";

import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useSearchMembers } from '@/graphql/hooks/useSearchMembers';
import { useAllSmallGroups } from '@/graphql/hooks/useSmallGroups';

export type Recipient = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  isGroup?: boolean;
};

interface RecipientSelectorProps {
  selectedRecipients: Recipient[];
  onSelectRecipient: (recipients: Recipient[]) => void;
}

export default function RecipientSelector({ selectedRecipients, onSelectRecipient }: RecipientSelectorProps) {
  const [query, setQuery] = useState("");
  const { searchMembers, members, loading, error } = useSearchMembers();
  const { smallGroups } = useAllSmallGroups();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [groupResults, setGroupResults] = useState<any[]>([]);

  // Helper to get group member count by group id
  const getGroupMemberCount = (groupId: string) => {
    const group = smallGroups.find((g: any) => g.id === groupId);
    return group && group.members ? group.members.length : null;
  };

  // Search as user types
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length > 1) {
      searchMembers({ variables: { search: value } }).then(res => {
        setSearchResults(res.data?.members || []);
      });
      // Filter groups by query
      setGroupResults(
        smallGroups.filter((group: any) =>
          group.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
      setGroupResults([]);
    }
  };

  // Combine member and group results for selection
  const combinedResults = [
    ...groupResults.map((group: any) => ({
      id: group.id,
      name: group.name,
      isGroup: true,
    })),
    ...searchResults.map((member: any) => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      email: member.email,
      phone: member.phoneNumber,
      isGroup: false,
    })),
  ];

  const handleRemoveRecipient = (id: number) => {
    onSelectRecipient(selectedRecipients.filter(recipient => recipient.id !== id));
  };

  const handleSelectRecipient = (recipient: Recipient) => {
    if (!selectedRecipients.filter(Boolean).find(r => r.id === recipient.id)) {
      onSelectRecipient([...selectedRecipients, recipient]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Recipients
      </label>
      
      {/* Selected recipients */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedRecipients.map((recipient) => (
          <span
            key={recipient.id}
            className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 mr-2 mb-2"
          >
            {recipient.name}
            {recipient.isGroup && (
              <span className="ml-2 text-xs text-gray-500">(
                {getGroupMemberCount(recipient.id) !== null
                  ? `${getGroupMemberCount(recipient.id)} members`
                  : '...'}
              )</span>
            )}
            <button
              type="button"
              className="ml-2 text-indigo-700 hover:text-indigo-900"
              onClick={() => handleRemoveRecipient(recipient.id)}
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      
      {/* Recipient search */}
      <Combobox value={null} onChange={handleSelectRecipient}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              placeholder="Search for members, groups, or enter an email/phone..."
              displayValue={() => ""}
              onChange={handleInputChange}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {loading && query.length > 1 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Searching...</div>
              ) : error ? (
                <div className="relative cursor-default select-none py-2 px-4 text-red-500">Error searching members</div>
              ) : combinedResults.length === 0 && query.length > 1 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
              ) : (
                combinedResults.map((recipient) => (
                  <Combobox.Option
                    key={recipient.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-indigo-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={recipient}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {recipient.name}
                        </span>
                        {recipient.email && (
                          <span className="block truncate text-xs text-gray-500">
                            {recipient.email}
                          </span>
                        )}
                        {recipient.phone && (
                          <span className="block truncate text-xs text-gray-500">
                            {recipient.phone}
                          </span>
                        )}
                        {selectedRecipients.filter(Boolean).some(r => r.id === recipient?.id) ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-indigo-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      
      <div className="mt-1 text-xs text-gray-500">
        {selectedRecipients.length === 0 
          ? "Select recipients from the dropdown or enter email addresses/phone numbers" 
          : `${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? 's' : ''} selected`}
      </div>
    </div>
  );
}
