"use client";

import { useState, useEffect, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Combobox, Transition, Tab } from "@headlessui/react";
import { 
  CheckIcon, 
  ChevronUpDownIcon, 
  XMarkIcon, 
  UserGroupIcon, 
  UserIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { cn } from "@/lib/utils";

// GraphQL queries
const GET_MEMBERS = gql`
  query GetMembers($filter: MemberFilterInput!) {
    members(filter: $filter) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        role
        activityStatus
        lastAttendance
      }
      totalCount
    }
  }
`;

const GET_GROUPS = gql`
  query GetGroups($filter: GroupFilterInput!) {
    groups(filter: $filter) {
      items {
        id
        name
        description
        memberCount
        type
      }
      totalCount
    }
  }
`;

const GET_ROLES = gql`
  query GetRoles($organisationId: ID!) {
    roles(organisationId: $organisationId) {
      id
      name
      description
    }
  }
`;

const GET_EVENTS = gql`
  query GetEvents($filter: EventFilterInput!) {
    events(filter: $filter) {
      items {
        id
        name
        startDate
        endDate
      }
      totalCount
    }
  }
`;

export interface Recipient {
  id: string;
  type: 'individual' | 'group';
  name: string;
  email?: string;
  phoneNumber?: string;
  memberCount?: number;
  role?: string;
  activityStatus?: string;
  lastAttendance?: string;
}

interface RecipientSelectorProps {
  selectedRecipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
  messageType: 'email' | 'sms' | 'notification';
  disabled?: boolean;
}

export default function RecipientSelector({
  selectedRecipients,
  onChange,
  messageType,
  disabled = false
}: RecipientSelectorProps) {
  const { organisationId, branchId } = useOrganizationBranchFilter();
  const [query, setQuery] = useState('');
  const [recipientType, setRecipientType] = useState<'individual' | 'group'>('individual');
  
  // Advanced filters
  const [filters, setFilters] = useState({
    roles: [] as string[],
    activityStatus: [] as string[],
    attendedEvents: [] as string[],
    lastAttendance: '',
    missedServices: false
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch members
  const { data: membersData, loading: loadingMembers } = useQuery(GET_MEMBERS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        searchTerm: query,
        // Only fetch members with email for email messages, or phone for SMS
        ...(messageType === 'email' ? { hasEmail: true } : {}),
        ...(messageType === 'sms' ? { hasPhone: true } : {}),
        // Advanced filters
        ...(filters.roles.length > 0 ? { roles: filters.roles } : {}),
        ...(filters.activityStatus.length > 0 ? { activityStatus: filters.activityStatus } : {}),
        ...(filters.attendedEvents.length > 0 ? { attendedEvents: filters.attendedEvents } : {}),
        ...(filters.lastAttendance ? { lastAttendanceBefore: filters.lastAttendance } : {}),
        ...(filters.missedServices ? { missedLastService: true } : {})
      }
    },
    skip: !organisationId || recipientType !== 'individual',
    fetchPolicy: 'network-only'
  });
  
  // Fetch groups
  const { data: groupsData, loading: loadingGroups } = useQuery(GET_GROUPS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        searchTerm: query
      }
    },
    skip: !organisationId || recipientType !== 'group',
    fetchPolicy: 'network-only'
  });
  
  // Fetch roles for filtering
  const { data: rolesData } = useQuery(GET_ROLES, {
    variables: {
      organisationId
    },
    skip: !organisationId,
    fetchPolicy: 'cache-first'
  });
  
  // Fetch events for filtering
  const { data: eventsData } = useQuery(GET_EVENTS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        // Get events from the last 3 months
        startDateFrom: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    skip: !organisationId,
    fetchPolicy: 'cache-first'
  });
  
  // Format members as recipients
  const memberRecipients: Recipient[] = membersData?.members?.items.map((member: any) => ({
    id: member.id,
    type: 'individual',
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    phoneNumber: member.phoneNumber,
    role: member.role,
    activityStatus: member.activityStatus,
    lastAttendance: member.lastAttendance
  })) || [];
  
  // Format groups as recipients
  const groupRecipients: Recipient[] = groupsData?.groups?.items.map((group: any) => ({
    id: group.id,
    type: 'group',
    name: group.name,
    memberCount: group.memberCount
  })) || [];
  
  // Combined recipients based on current type
  const recipients = recipientType === 'individual' ? memberRecipients : groupRecipients;
  
  // Filter out already selected recipients
  const filteredRecipients = recipients.filter(
    recipient => !selectedRecipients.some(selected => selected.id === recipient.id && selected.type === recipient.type)
  );
  
  // Handle recipient selection
  const handleSelectRecipient = (recipient: Recipient) => {
    onChange([...selectedRecipients, recipient]);
    setQuery('');
  };
  
  // Handle recipient removal
  const handleRemoveRecipient = (recipient: Recipient) => {
    onChange(selectedRecipients.filter(
      selected => !(selected.id === recipient.id && selected.type === recipient.type)
    ));
  };
  
  // Clear all recipients
  const handleClearAll = () => {
    onChange([]);
  };
  
  // Update filters
  const updateFilter = (filterType: keyof typeof filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      roles: [],
      activityStatus: [],
      attendedEvents: [],
      lastAttendance: '',
      missedServices: false
    });
  };
  
  // Count active filters
  const activeFilterCount = 
    (filters.roles.length > 0 ? 1 : 0) +
    (filters.activityStatus.length > 0 ? 1 : 0) +
    (filters.attendedEvents.length > 0 ? 1 : 0) +
    (filters.lastAttendance ? 1 : 0) +
    (filters.missedServices ? 1 : 0);
  
  return (
    <div>
      <div className="flex flex-col space-y-2">
        {/* Recipient type toggle and filters */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={recipientType === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecipientType('individual')}
              disabled={disabled}
              className="flex items-center"
            >
              <UserIcon className="h-4 w-4 mr-1" />
              Individuals
            </Button>
            <Button
              type="button"
              variant={recipientType === 'group' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecipientType('group')}
              disabled={disabled}
              className="flex items-center"
            >
              <UserGroupIcon className="h-4 w-4 mr-1" />
              Groups
            </Button>
          </div>
          
          {recipientType === 'individual' && (
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center",
                    activeFilterCount > 0 && "border-blue-300 bg-blue-50 text-blue-700"
                  )}
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-blue-500 hover:bg-blue-600">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Advanced Filters</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-xs h-7"
                    >
                      Reset
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Role filter */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Roles</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {rolesData?.roles?.map((role: any) => (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`role-${role.id}`}
                              checked={filters.roles.includes(role.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFilter('roles', [...filters.roles, role.id]);
                                } else {
                                  updateFilter('roles', filters.roles.filter(id => id !== role.id));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`role-${role.id}`}
                              className="text-sm font-normal"
                            >
                              {role.name}
                            </Label>
                          </div>
                        ))}
                        {!rolesData?.roles?.length && (
                          <span className="text-sm text-gray-500 col-span-2">No roles found</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Activity status filter */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Activity Status</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Active', 'Inactive', 'New', 'Visitor'].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`status-${status}`}
                              checked={filters.activityStatus.includes(status.toUpperCase())}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  updateFilter('activityStatus', [...filters.activityStatus, status.toUpperCase()]);
                                } else {
                                  updateFilter('activityStatus', filters.activityStatus.filter(s => s !== status.toUpperCase()));
                                }
                              }}
                            />
                            <Label 
                              htmlFor={`status-${status}`}
                              className="text-sm font-normal"
                            >
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Attendance filters */}
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Attendance</Label>
                      
                      <div className="space-y-2">
                        {/* Missed services */}
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="missed-services"
                            checked={filters.missedServices}
                            onCheckedChange={(checked) => {
                              updateFilter('missedServices', !!checked);
                            }}
                          />
                          <Label 
                            htmlFor="missed-services"
                            className="text-sm font-normal"
                          >
                            Missed last service
                          </Label>
                        </div>
                        
                        {/* Last attendance */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Not attended since</Label>
                          <Select
                            value={filters.lastAttendance}
                            onValueChange={(value) => updateFilter('lastAttendance', value)}
                          >
                            <option value="">Any time</option>
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 3 months</option>
                          </Select>
                        </div>
                        
                        {/* Attended events */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">Attended events</Label>
                          <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                            {eventsData?.events?.items?.map((event: any) => (
                              <div key={event.id} className="flex items-center space-x-2 py-1">
                                <Checkbox 
                                  id={`event-${event.id}`}
                                  checked={filters.attendedEvents.includes(event.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      updateFilter('attendedEvents', [...filters.attendedEvents, event.id]);
                                    } else {
                                      updateFilter('attendedEvents', filters.attendedEvents.filter(id => id !== event.id));
                                    }
                                  }}
                                />
                                <Label 
                                  htmlFor={`event-${event.id}`}
                                  className="text-sm font-normal"
                                >
                                  {event.name}
                                  <span className="text-xs text-gray-500 block">
                                    {new Date(event.startDate).toLocaleDateString()}
                                  </span>
                                </Label>
                              </div>
                            ))}
                            {!eventsData?.events?.items?.length && (
                              <span className="text-sm text-gray-500">No recent events found</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button 
                      onClick={() => setShowFilters(false)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {filters.roles.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <AdjustmentsHorizontalIcon className="h-3 w-3 mr-1" />
                {filters.roles.length} role{filters.roles.length !== 1 ? 's' : ''}
                <XMarkIcon 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('roles', [])}
                />
              </Badge>
            )}
            {filters.activityStatus.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <UserIcon className="h-3 w-3 mr-1" />
                {filters.activityStatus.length} status{filters.activityStatus.length !== 1 ? 'es' : ''}
                <XMarkIcon 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('activityStatus', [])}
                />
              </Badge>
            )}
            {filters.attendedEvents.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {filters.attendedEvents.length} event{filters.attendedEvents.length !== 1 ? 's' : ''}
                <XMarkIcon 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('attendedEvents', [])}
                />
              </Badge>
            )}
            {filters.lastAttendance && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <ClockIcon className="h-3 w-3 mr-1" />
                Not attended in {filters.lastAttendance} days
                <XMarkIcon 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('lastAttendance', '')}
                />
              </Badge>
            )}
            {filters.missedServices && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Missed last service
                <XMarkIcon 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('missedServices', false)}
                />
              </Badge>
            )}
          </div>
        )}
        
        {/* Recipient search combobox */}
        <Combobox
          as="div"
          value={null}
          onChange={handleSelectRecipient}
          disabled={disabled}
        >
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-200 bg-white text-left focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all duration-200">
              <Combobox.Input
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${recipientType === 'individual' ? 'members' : 'groups'}...`}
                displayValue={() => query}
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
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {loadingMembers || loadingGroups ? (
                  <div className="p-2">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ) : filteredRecipients.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    No {recipientType === 'individual' ? 'members' : 'groups'} found.
                  </div>
                ) : (
                  filteredRecipients.map((recipient) => (
                    <Combobox.Option
                      key={`${recipient.type}-${recipient.id}`}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'text-gray-900'
                        } transition-colors duration-150`
                      }
                      value={recipient}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <div className={`absolute left-2 flex items-center justify-center ${active ? "text-white" : "text-blue-500"}`}>
                              <div className={`rounded-full ${active ? "bg-white/20" : "bg-blue-100"} p-1`}>
                                {recipient.type === 'individual' ? (
                                  <UserIcon className="h-3.5 w-3.5" />
                                ) : (
                                  <UserGroupIcon className="h-3.5 w-3.5" />
                                )}
                              </div>
                            </div>
                            <div>
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {recipient.name}
                              </span>
                              {recipient.type === 'individual' && (
                                <span className={`block truncate text-xs ${
                                  active ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {messageType === 'email' ? recipient.email : recipient.phoneNumber}
                                  {recipient.role && ` • ${recipient.role}`}
                                </span>
                              )}
                              {recipient.type === 'group' && recipient.memberCount && (
                                <span className={`block truncate text-xs ${
                                  active ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {recipient.memberCount} members
                                </span>
                              )}
                            </div>
                          </div>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                active ? 'text-white' : 'text-blue-600'
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
      </div>
      
      {/* Selected recipients */}
      {selectedRecipients.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={disabled}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedRecipients.map((recipient) => (
              <Badge
                key={`${recipient.type}-${recipient.id}`}
                variant="secondary"
                className="flex items-center"
              >
                {recipient.type === 'individual' ? (
                  <UserIcon className="h-3 w-3 mr-1" />
                ) : (
                  <UserGroupIcon className="h-3 w-3 mr-1" />
                )}
                <span>{recipient.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(recipient)}
                  disabled={disabled}
                  className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
