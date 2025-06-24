"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";

import { useEventTemplates, EventTemplate, VolunteerRoleRequirement } from '@/graphql/hooks/useEventTemplates';
import { useMemo } from 'react';
import { EventType } from '@/graphql/types/event';

// Branches should come from API in a real app, but for now, keep as static if not available
const branches = [
  { id: "all", name: "All Branches" },
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" }
];

// Event types for filtering
const eventTypes = [
  { id: "all", name: "All Types" },
  { id: "service", name: "Services" },
  { id: "meeting", name: "Meetings" },
  { id: "youth", name: "Youth Events" },
  { id: "prayer", name: "Prayer Gatherings" },
  { id: "bible-study", name: "Bible Studies" },
  { id: "outreach", name: "Outreach Events" },
  { id: "music", name: "Music & Worship" },
  { id: "children", name: "Children's Events" }
];

export default function EventTemplates() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  
  // Fetch event templates from API
  const { templates } = useEventTemplates();

  // Filter templates client-side for any additional logic (if needed)
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    return templates.filter((template: EventTemplate) => {
      // Filter by event type
      if (selectedType !== "all") {
        // Map filter id to enum
        let typeEnum: EventType | undefined = undefined;
        switch(selectedType) {
          case "service": typeEnum = EventType.SERVICE; break;
          case "meeting": typeEnum = EventType.MEETING; break;
          case "youth": typeEnum = EventType.YOUTH; break;
          case "prayer": typeEnum = EventType.PRAYER; break;
          case "bible-study": typeEnum = EventType.BIBLE_STUDY; break;
          case "outreach": typeEnum = EventType.OUTREACH; break;
          case "music": typeEnum = EventType.MUSIC; break;
          case "children": typeEnum = EventType.CHILDREN; break;
        }
        if (typeEnum && template.eventType !== typeEnum) return false;
      }
      // Filter by branch
      if (selectedBranch !== "all") {
        if (!template.applicableBranches?.includes(selectedBranch)) return false;
      }
      return true;
    });
  }, [templates, selectedType, selectedBranch]);
  
  // Toggle template expanded view
  const toggleExpand = (templateId: string) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null);
    } else {
      setExpandedTemplate(templateId);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Event Templates</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage reusable event templates that can be shared across branches.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href="/dashboard/calendar/templates/new">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 inline-block mr-1" />
              Create Template
            </button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Template Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {eventTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Branch Applicability
            </label>
            <select
              id="branch-filter"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.map((template: EventTemplate) => (
          <div key={template.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div 
              className="px-6 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(template.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`
                    p-2 rounded-md
                    ${template.eventType === EventType.SERVICE ? 'bg-blue-100 text-blue-700' :
                      template.eventType === EventType.PRAYER ? 'bg-green-100 text-green-700' :
                      template.eventType === EventType.MEETING ? 'bg-gray-100 text-gray-700' :
                      template.eventType === EventType.YOUTH ? 'bg-purple-100 text-purple-700' :
                      template.eventType === EventType.OUTREACH ? 'bg-orange-100 text-orange-700' :
                      'bg-indigo-100 text-indigo-700'}
                  `}>
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{template.duration}</span>
                      {template.isRecurring && (
                        <>
                          <span className="mx-2">•</span>
                          <ArrowPathIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                          <span>
                            {template.recurrenceType === "weekly" ? 'Weekly' :
                             template.recurrenceType === "monthly" ? 'Monthly' :
                             template.recurrenceType === "yearly" ? 'Yearly' : 'Daily'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500 mr-4">
                    Used <span className="font-medium">{template.usageCount}</span> times
                  </div>
                  <div className="flex-shrink-0">
                    {expandedTemplate === template.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {expandedTemplate === template.id && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Required Resources</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.resources?.map((resource: string, idx: number) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Branches</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.applicableBranches.map((branchId: string) => (
                        <span 
                          key={branchId} 
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                          {branches.find(b => b.id === branchId)?.name || branchId}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Volunteer Roles</h4>
                    <ul className="space-y-2 mb-4">
                      {template.volunteerRoles?.map((role: VolunteerRoleRequirement, idx: number) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{role.role}</span>
                          <span className="text-gray-500">{role.count} needed</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Setup Requirements</h4>
                    <p className="text-sm text-gray-500 mb-4">{template.requiredSetup}</p>
                    
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Template Information</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                      <li>Created by: {typeof template.createdBy === 'object' ? template.createdBy?.username : template.createdBy || 'N/A'}</li>
                      <li>Last used: {template.lastUsed}</li>
                      <li>
                        Recurrence: {template.isRecurring && (
                          <div className="mt-2 text-xs text-gray-500">
                            {template.recurrenceType === "weekly" && template.recurrenceRule && (
                              <span>Weekly recurrence ({template.recurrenceRule})</span>
                            )}
                            {template.recurrenceType === "monthly" && template.recurrenceRule && (
                              <span>Monthly recurrence ({template.recurrenceRule})</span>
                            )}
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <Link href={`/dashboard/calendar/templates/edit/${template.id}`}>
                    <button 
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Edit Template
                    </button>
                  </Link>
                  <Link href={`/dashboard/calendar/new?template=${template.id}`}>
                    <button 
                      type="button"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      <DocumentDuplicateIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      Use Template
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No event templates matching your filter criteria.
            </p>
            <div className="mt-6">
              <Link href="/dashboard/calendar/templates/new">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  Create Template
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Quick Actions</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link href="/dashboard/calendar/templates/import">
              <div className="rounded-md bg-white px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Import Templates
              </div>
            </Link>
            <Link href="/dashboard/calendar/templates/export">
              <div className="rounded-md bg-white px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Export Templates
              </div>
            </Link>
            <Link href="/dashboard/calendar/templates/share">
              <div className="rounded-md bg-white px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Share Templates Between Branches
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
