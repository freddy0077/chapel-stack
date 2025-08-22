"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_MEMBERS } from "@/graphql/queries/memberQueries";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { MagnifyingGlassIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/20/solid";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  memberId?: string;
  gender?: string;
  branch?: {
    id: string;
    name: string;
  };
}

interface SearchableMemberInputProps {
  value?: string;
  onChange: (memberId: string, member?: Member) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

export default function SearchableMemberInput({
  value,
  onChange,
  placeholder = "Search for a member...",
  required = false,
  disabled = false,
  className = "",
  label,
  error,
}: SearchableMemberInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const orgBranchFilter = useOrganizationBranchFilter();

  // Query for searching members
  const { data, loading } = useQuery(SEARCH_MEMBERS, {
    variables: {
      query: searchTerm,
      branchId: orgBranchFilter.branchId,
    },
    skip: !searchTerm || searchTerm.length < 2,
    fetchPolicy: 'cache-and-network',
  });

  const members: Member[] = data?.searchMembers || [];

  // Handle member selection
  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setSearchTerm(`${member.firstName} ${member.lastName}`);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange(member.id, member);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    
    // If input is cleared, reset selection
    if (!newValue) {
      setSelectedMember(null);
      onChange('');
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || members.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < members.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : members.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < members.length) {
          handleSelectMember(members[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle clear selection
  const handleClear = () => {
    setSelectedMember(null);
    setSearchTerm('');
    setIsOpen(false);
    onChange('');
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format member display name
  const formatMemberName = (member: Member) => {
    return `${member.firstName} ${member.lastName}`;
  };

  // Format member details
  const formatMemberDetails = (member: Member) => {
    const details = [];
    if (member.memberId) details.push(`ID: ${member.memberId}`);
    if (member.email) details.push(member.email);
    if (member.phoneNumber) details.push(member.phoneNumber);
    return details.join(' • ');
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.length >= 2) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`block w-full pl-10 pr-10 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-blue-500 ${
            error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        />
        
        {selectedMember && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Selected member display */}
      {selectedMember && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-blue-900">
                {formatMemberName(selectedMember)}
              </p>
              <p className="text-xs text-blue-700">
                {formatMemberDetails(selectedMember)}
              </p>
            </div>
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        >
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Searching members...
              </div>
            </div>
          ) : members.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {searchTerm.length < 2 
                ? 'Type at least 2 characters to search'
                : 'No members found'
              }
            </div>
          ) : (
            members.map((member, index) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelectMember(member)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                  index === highlightedIndex ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">
                      {formatMemberName(member)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatMemberDetails(member)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
