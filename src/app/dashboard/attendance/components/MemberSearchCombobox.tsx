"use client";
import React, { useState, useMemo } from "react";
import { Combobox } from "@headlessui/react";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface MemberSearchComboboxProps {
  members: Member[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  query?: string;
  onQueryChange?: (query: string) => void;
  loading?: boolean;
}

export default function MemberSearchCombobox({ members, value, onChange, disabled, query = "", onQueryChange, loading }: MemberSearchComboboxProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const actualQuery = onQueryChange ? query : internalQuery;
  const setQuery = onQueryChange || setInternalQuery;

  // Avoid filteredMembers changing on every keystroke by memoizing
  const filteredMembers = useMemo(() => (
    actualQuery === ""
      ? members
      : members.filter((member) => {
          const name = `${member.firstName} ${member.lastName}`.toLowerCase();
          return (
            name.includes(actualQuery.toLowerCase()) ||
            member.id.toLowerCase().includes(actualQuery.toLowerCase())
          );
        })
  ), [members, actualQuery]);

  // Always show the input value, even if not in filteredMembers
  const displayValue = (id: string) => {
    const member = members.find((m) => m.id === id);
    return member ? `${member.firstName} ${member.lastName}` : actualQuery;
  };

  return (
    <Combobox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <Combobox.Input
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
          displayValue={displayValue}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search member by name or ID"
          disabled={disabled || loading}
          autoComplete="off"
        />
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {loading ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Loading...
            </div>
          ) : filteredMembers.length === 0 && actualQuery !== "" ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No members found.
            </div>
          ) : (
            filteredMembers.map((member) => (
              <Combobox.Option
                key={member.id}
                value={member.id}
                className={({ active }) =>
                  "relative cursor-pointer select-none py-2 pl-10 pr-4 " +
                  (active ? "bg-indigo-600 text-white" : "text-gray-900")
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={"block truncate " + (selected ? "font-medium" : "font-normal")}
                    >
                      {member.firstName} {member.lastName} ({member.id})
                    </span>
                    {selected ? (
                      <span
                        className={"absolute inset-y-0 left-0 flex items-center pl-3 " +
                          (active ? "text-white" : "text-indigo-600")}
                      >
                        ✓
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
