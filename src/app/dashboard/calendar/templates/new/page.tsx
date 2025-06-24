"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowPathIcon, 
  ExclamationCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon 
} from "@heroicons/react/24/outline";
import { useBranches } from "@/graphql/hooks/useEvents";
import { useEventTemplateMutations } from "@/graphql/hooks/useEventTemplates";
import { EventType } from "@/graphql/types/event";

// Map event types to human-readable names
const eventTypeNames: Record<string, string> = {
  [EventType.SERVICE]: "Service",
  [EventType.MEETING]: "Meeting",
  [EventType.CONFERENCE]: "Conference",
  [EventType.WORKSHOP]: "Workshop",
  [EventType.RETREAT]: "Retreat",
  [EventType.OUTREACH]: "Outreach",
  [EventType.SOCIAL]: "Social",
  [EventType.OTHER]: "Other"
};

export default function CreateEventTemplate() {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();
  const { branches } = useBranches();
  const { createTemplate, loading, error } = useEventTemplateMutations();
  
  // Form success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Template form data
  const [templateData, setTemplateData] = useState({
    title: "",
    description: "",
    eventType: EventType.SERVICE,
    duration: 60, // Default 1 hour
    isRecurring: false,
    recurrenceType: "WEEKLY",
    recurrenceRule: "",
    resources: [""],
    volunteerRoles: [{ role: "", count: 1 }],
    applicableBranches: [] as string[],
    requiredSetup: "",
    isActive: true
  });
  
  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setTemplateData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else if (name === "duration") {
      setTemplateData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setTemplateData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle resource changes
  const handleResourceChange = (index: number, value: string) => {
    const updatedResources = [...templateData.resources];
    updatedResources[index] = value;
    setTemplateData(prev => ({
      ...prev,
      resources: updatedResources
    }));
  };
  
  // Add new resource field
  const addResourceField = () => {
    setTemplateData(prev => ({
      ...prev,
      resources: [...prev.resources, ""]
    }));
  };
  
  // Remove resource field
  const removeResourceField = (index: number) => {
    const updatedResources = [...templateData.resources];
    updatedResources.splice(index, 1);
    setTemplateData(prev => ({
      ...prev,
      resources: updatedResources.length > 0 ? updatedResources : [""]
    }));
  };
  
  // Handle volunteer role changes
  const handleVolunteerRoleChange = (index: number, field: string, value: string | number) => {
    const updatedRoles = [...templateData.volunteerRoles];
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: field === "count" ? parseInt(value as string) || 1 : value
    };
    setTemplateData(prev => ({
      ...prev,
      volunteerRoles: updatedRoles
    }));
  };
  
  // Add new volunteer role
  const addVolunteerRole = () => {
    setTemplateData(prev => ({
      ...prev,
      volunteerRoles: [...prev.volunteerRoles, { role: "", count: 1 }]
    }));
  };
  
  // Remove volunteer role
  const removeVolunteerRole = (index: number) => {
    const updatedRoles = [...templateData.volunteerRoles];
    updatedRoles.splice(index, 1);
    setTemplateData(prev => ({
      ...prev,
      volunteerRoles: updatedRoles.length > 0 ? updatedRoles : [{ role: "", count: 1 }]
    }));
  };
  
  // Handle branch selection
  const handleBranchChange = (branchId: string) => {
    setTemplateData(prev => {
      const updatedBranches = [...prev.applicableBranches];
      const branchIndex = updatedBranches.indexOf(branchId);
      
      if (branchIndex === -1) {
        updatedBranches.push(branchId);
      } else {
        updatedBranches.splice(branchIndex, 1);
      }
      
      return {
        ...prev,
        applicableBranches: updatedBranches
      };
    });
  };
  
  // Format recurrence rule based on template settings
  const formatRecurrenceRule = () => {
    if (!templateData.isRecurring) return "";
    
    let rule = "";
    
    switch (templateData.recurrenceType) {
      case "DAILY":
        rule = "FREQ=DAILY";
        break;
      case "WEEKLY":
        rule = "FREQ=WEEKLY";
        break;
      case "MONTHLY":
        rule = "FREQ=MONTHLY";
        break;
      case "YEARLY":
        rule = "FREQ=YEARLY";
        break;
      default:
        rule = "FREQ=WEEKLY";
    }
    
    return rule;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit called");
    setHasSubmitted(true);
    setValidationError(null);
    if (!templateData.title.trim()) {
      setValidationError("Title is required.");
      return;
    }
    setHasSubmitted(true);
    e.preventDefault();
    
    // Format data for API
    const formattedData = {
      ...templateData,
      recurrenceRule: formatRecurrenceRule(),
      // Filter out empty resources
      resources: templateData.resources.filter(r => r.trim() !== ""),
      // Filter out empty volunteer roles
      volunteerRoles: templateData.volunteerRoles.filter(vr => vr.role.trim() !== "")
    };
    
    try {
      console.log("Submitting template data:", formattedData);
      const result = await createTemplate(formattedData);
      console.log("Template created:", result);
      setSuccessMessage("Event template created successfully!");
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/dashboard/calendar/templates/list");
      }, 1500);
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Create Event Template</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create a reusable template for events to streamline the event creation process.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <Link href="/dashboard/calendar/templates/list">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <ArrowLeftIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Back to Templates
            </button>
          </Link>
        </div>
      </div>
      
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Redirecting to templates list...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {validationError && (
        <div className="rounded-md bg-yellow-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">{validationError}</h3>
            </div>
          </div>
        </div>
      )}
      {hasSubmitted && error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error creating template</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the basic details about this event template.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Template Title <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={templateData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={templateData.eventType}
                      onChange={handleInputChange}
                    >
                      {Object.entries(eventTypeNames).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      min="1"
                      required
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={templateData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={templateData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description of what this event template is for.
                  </p>
                </div>
                
                <div className="sm:col-span-6">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={templateData.isActive}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isActive" className="font-medium text-gray-700">
                        Active Template
                      </label>
                      <p className="text-gray-500">
                        Inactive templates won't appear in the default template selection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Recurrence Settings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure how this event template repeats.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="isRecurring"
                      name="isRecurring"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={templateData.isRecurring}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isRecurring" className="font-medium text-gray-700">
                      Recurring Event
                    </label>
                    <p className="text-gray-500">
                      Enable if this event typically repeats on a schedule.
                    </p>
                  </div>
                </div>
                
                {templateData.isRecurring && (
                  <div className="sm:col-span-3">
                    <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700">
                      Recurrence Frequency
                    </label>
                    <div className="mt-1">
                      <select
                        id="recurrenceType"
                        name="recurrenceType"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={templateData.recurrenceType}
                        onChange={handleInputChange}
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Resources & Requirements</h3>
              <p className="mt-1 text-sm text-gray-500">
                Specify any resources needed or setup requirements for this event.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Required Resources
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    List any equipment, rooms, or other resources needed for this event.
                  </p>
                  <div className="mt-2 space-y-2">
                    {templateData.resources.map((resource, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={resource}
                          onChange={(e) => handleResourceChange(index, e.target.value)}
                          placeholder="e.g., Projector, Main Hall, Microphones"
                        />
                        <button
                          type="button"
                          onClick={() => removeResourceField(index)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addResourceField}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      Add Resource
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Volunteer Roles
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Specify volunteer positions needed for this event.
                  </p>
                  <div className="mt-2 space-y-2">
                    {templateData.volunteerRoles.map((role, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={role.role}
                          onChange={(e) => handleVolunteerRoleChange(index, "role", e.target.value)}
                          placeholder="Role title"
                        />
                        <div className="flex items-center">
                          <label htmlFor={`count-${index}`} className="block text-sm font-medium text-gray-700 mr-2">
                            Count:
                          </label>
                          <input
                            type="number"
                            id={`count-${index}`}
                            min="1"
                            className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={role.count}
                            onChange={(e) => handleVolunteerRoleChange(index, "count", e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVolunteerRole(index)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addVolunteerRole}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      Add Role
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="requiredSetup" className="block text-sm font-medium text-gray-700">
                    Setup Requirements
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="requiredSetup"
                      name="requiredSetup"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={templateData.requiredSetup}
                      onChange={handleInputChange}
                      placeholder="Describe any specific setup requirements or instructions"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Applicable Branches</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select which church branches this template can be used for.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <fieldset>
                <legend className="sr-only">Branch Selection</legend>
                <div className="space-y-2">
                  {branches?.map((branch) => (
                    <div key={branch.id} className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id={`branch-${branch.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={templateData.applicableBranches.includes(branch.id)}
                          onChange={() => handleBranchChange(branch.id)}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`branch-${branch.id}`} className="font-medium text-gray-700">
                          {branch.name}
                        </label>
                      </div>
                    </div>
                  ))}
                  {(!branches || branches.length === 0) && (
                    <p className="text-sm text-gray-500">
                      No branches available. Template will be applicable to all branches.
                    </p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Leave all unchecked to make this template available to all branches.
                </p>
              </fieldset>
            </div>
          </div>
        </div>
        
        <div className="pt-5">
          <div className="flex justify-end">
            <Link href="/dashboard/calendar/templates/list">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading.create}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {loading.create ? (
                <>
                  <ArrowPathIcon className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />
                  Saving...
                </>
              ) : (
                "Create Template"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
