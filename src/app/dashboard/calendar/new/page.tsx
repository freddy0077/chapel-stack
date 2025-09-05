"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  useEventMutations,
  useBranches,
  useRooms,
  useVolunteerRoles,
} from "@/graphql/hooks/useEvents";
import { EventType, CreateEventInput } from "@/graphql/types/event";
import {
  useEventTemplates,
  useEventTemplate,
} from "@/graphql/hooks/useEventTemplates";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { useAuth } from "@/contexts/AuthContextEnhanced";
// No date-fns imports needed for now

// Types mapped from backend schema
const eventTypes = [
  {
    id: EventType.SERVICE,
    name: "Service",
  },
  {
    id: EventType.MEETING,
    name: "Meeting",
  },
  {
    id: EventType.CONFERENCE,
    name: "Conference",
  },
  {
    id: EventType.WORKSHOP,
    name: "Workshop",
  },
  {
    id: EventType.RETREAT,
    name: "Retreat",
  },
  {
    id: EventType.OUTREACH,
    name: "Outreach",
  },
  {
    id: EventType.SOCIAL,
    name: "Social",
  },
  {
    id: EventType.OTHER,
    name: "Other",
  },
];

// Extended event input interface to include additional fields
interface ExtendedEventInput extends Partial<CreateEventInput> {
  isPublic?: boolean;
  recurringFrequency?: string;
  recurringInterval?: number;
  recurringDays?: number[];
  resources?: string[];
  volunteerRoles?: { role: string; count: number }[];
}

export default function CreateEvent() {
  // State for showing template loading
  const [templateApplied, setTemplateApplied] = useState(false);
  const router = useRouter();

  const { createEvent, loading: mutationLoading } = useEventMutations();
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState(false);

  // Fetch data from API using hooks
  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
  } = useRooms(selectedBranchId);
  const {
    volunteerRoles: fetchedVolunteerRoles,
    loading: rolesLoading,
    error: rolesError,
  } = useVolunteerRoles();

  // Get org/branch filter for event creation
  const orgBranchFilter = useOrganizationBranchFilter();

  // Get user role
  const { user } = useAuth();

  // Form state - aligned with GraphQL schema
  const [eventData, setEventData] = useState<ExtendedEventInput>({
    title: "",
    type: EventType.SERVICE,
    description: "",
    startDateTime: "", // Will be computed from date and startTime
    endDateTime: "", // Will be computed from date and endTime
    location: "",
    branchId: "b1",
    isRecurring: false,
    recurrencePattern: "", // Will be computed based on recurring settings
    capacity: 0,
    registrationRequired: false,
    registrationDeadline: undefined,
    // Extended properties
    isPublic: false,
    recurringFrequency: "weekly",
    recurringInterval: 1,
    recurringDays: [0], // Sunday by default
    resources: [""],
    volunteerRoles: [{ role: "", count: 1 }],
  });

  // Additional form fields for date/time handling
  const [formFields, setFormFields] = useState({
    date: "",
    startTime: "",
    endTime: "",
    recurringFrequency: "weekly",
    recurringInterval: 1,
    recurringDays: [0], // Sunday by default
    recurringEndDate: "", // Add missing field
    resources: [""],
    volunteerRoles: [{ role: "", count: 1 }],
    expectedAttendees: 0,
  });

  // Get the template ID from URL params
  const searchParamsHook = useSearchParams();
  const templateId = searchParamsHook.get("template");

  // Fetch all event templates for selection
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
  } = useEventTemplates();

  // Template selection dropdown and preview UI
  // (Insert this JSX in the return statement of your component, e.g. above the form)
  // --- BEGIN TEMPLATE DROPDOWN UI ---
  // Example usage in your render/return block:
  //
  // <div className="mb-4">
  //   <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">Event Template</label>
  //   {templatesLoading ? (
  //     <div className="text-gray-500 flex items-center gap-2"><ArrowPathIcon className="animate-spin h-5 w-5" /> Loading templates...</div>
  //   ) : templatesError ? (
  //     <div className="text-red-500">Failed to load templates.</div>
  //   ) : (
  //     <select
  //       id="template-select"
  //       name="template-select"
  //       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
  //       value={templateId || ''}
  //       onChange={e => {
  //         const selected = e.target.value;
  //         if (selected) {
  //           router.replace(`?template=${selected}`);
  //         } else {
  //           router.replace('');
  //         }
  //       }}
  //     >
  //       <option value="">-- No Template --</option>
  //       {templates.map(t => (
  //         <option key={t.id} value={t.id}>{t.title}</option>
  //       ))}
  //     </select>
  //   )}
  //   {template && (
  //     <div className="mt-4 p-4 rounded bg-gray-50 border border-gray-200">
  //       <div className="font-semibold text-lg">{template.title}</div>
  //       <div className="text-sm text-gray-600 mb-2">{template.description}</div>
  //       <div className="flex flex-wrap gap-4 text-xs">
  //         <div><span className="font-medium">Type:</span> {template.eventType}</div>
  //         <div><span className="font-medium">Duration:</span> {template.duration} min</div>
  //         <div><span className="font-medium">Recurring:</span> {template.isRecurring ? 'Yes' : 'No'}</div>
  //       </div>
  //       {template.volunteerRoles && template.volunteerRoles.length > 0 && (
  //         <div className="mt-2">
  //           <span className="font-medium">Volunteer Roles:</span>
  //           <ul className="list-disc ml-6">
  //             {template.volunteerRoles.map((vr, idx) => (
  //               <li key={idx}>{vr.role} (x{vr.count}) {vr.description ? `- ${vr.description}` : ''}</li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   )}
  // </div>
  // --- END TEMPLATE DROPDOWN UI ---

  // Use the template API hook to fetch template if ID is provided
  const {
    template,
    loading: templateLoading,
    error: templateError,
  } = useEventTemplate(templateId || undefined);

  // Helper function to parse recurrence rule for day numbers
  const parseRecurrenceRule = (rule: string): number[] => {
    // Simple parser for RRULE format - can be extended for more complex rules
    try {
      if (rule.includes("BYDAY=")) {
        const daysStr = rule.split("BYDAY=")[1].split(";")[0];
        const dayMap: Record<string, number> = {
          SU: 0,
          MO: 1,
          TU: 2,
          WE: 3,
          TH: 4,
          FR: 5,
          SA: 6,
        };
        return daysStr.split(",").map((d) => dayMap[d] || 0);
      }
      return [0]; // Default to Sunday
    } catch (err) {
      console.error("Error parsing recurrence rule:", err);
      return [0];
    }
  };

  // Initialize with template data if a template is selected
  useEffect(() => {
    if (templateId && template) {
      setTemplateApplied(true);

      // Set event data from API template
      setEventData((prev: ExtendedEventInput) => ({
        ...prev,
        title: template.title || "",
        // API returns the correct enum value
        type: template.eventType || EventType.SERVICE,
        description: template.description || "",
        isRecurring: Boolean(template.isRecurring),
        // Handle recurrence pattern properly
        recurringFrequency:
          template.recurrenceType === "WEEKLY"
            ? "weekly"
            : template.recurrenceType === "MONTHLY"
              ? "monthly"
              : template.recurrenceType === "YEARLY"
                ? "yearly"
                : template.recurrenceType === "DAILY"
                  ? "daily"
                  : "weekly",
        recurringInterval: 1, // Default to 1 if not specified
        // Parse recurrence rule for days if available
        recurringDays: template.recurrenceRule
          ? parseRecurrenceRule(template.recurrenceRule)
          : [0],
        resources: Array.isArray(template.resources)
          ? template.resources
          : [""],
        volunteerRoles: Array.isArray(template.volunteerRoles)
          ? template.volunteerRoles.map(
              (vr: { role: string; count: number }) => ({
                role: vr.role,
                count: vr.count,
              }),
            )
          : [{ role: "", count: 1 }],
      }));

      // Set form fields with the same structure
      setFormFields((prev) => ({
        ...prev,
        date: "", // Clear the date field - user should select current date
        startTime: "", // User should select appropriate time
        endTime: "", // User should select appropriate time
        recurringFrequency:
          template.recurrenceType === "WEEKLY"
            ? "weekly"
            : template.recurrenceType === "MONTHLY"
              ? "monthly"
              : template.recurrenceType === "YEARLY"
                ? "yearly"
                : template.recurrenceType === "DAILY"
                  ? "daily"
                  : "weekly",
        recurringInterval: 1,
        recurringDays: template.recurrenceRule
          ? parseRecurrenceRule(template.recurrenceRule)
          : [0],
        resources: Array.isArray(template.resources)
          ? template.resources
          : [""],
        volunteerRoles: Array.isArray(template.volunteerRoles)
          ? template.volunteerRoles.map(
              (vr: { role: string; count: number }) => ({
                role: vr.role,
                count: vr.count,
              }),
            )
          : [{ role: "", count: 1 }],
      }));
    }
  }, [template, templateId, setEventData, setFormFields]);

  // Initialize branch selection when branches load
  useEffect(() => {
    if (branches && branches.length > 0) {
      const firstBranchId = branches[0]?.id;
      if (firstBranchId) {
        setSelectedBranchId(firstBranchId);
        setEventData((prev: ExtendedEventInput) => ({
          ...prev,
          branchId: firstBranchId,
        }));
      }
    }
  }, [branches, setSelectedBranchId, setEventData]);

  // Handle form field changes for event data
  const handleEventDataChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form field changes for additional form fields
  const handleFormFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle branch change to filter rooms
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = e.target.value;

    // Update event data and selected branch ID for filtering rooms
    setEventData((prev) => ({ ...prev, branchId }));
    setSelectedBranchId(branchId);

    // Reset room selection if the new branch doesn't have the currently selected room
    const branchRooms = rooms.filter(
      (room: {
        branchId: string;
        id: string;
        name: string;
        capacity: number;
      }) => room.branchId === branchId,
    );
    if (
      formFields.resources &&
      formFields.resources.length > 0 &&
      branchRooms.length > 0
    ) {
      const currentRoomIds = formFields.resources;
      const validRoomIds = branchRooms.map(
        (room: {
          branchId: string;
          id: string;
          name: string;
          capacity: number;
        }) => room.id,
      );

      // Check if any selected rooms are not in the new branch
      const hasInvalidRoom = currentRoomIds.some(
        (roomId) => !validRoomIds.includes(roomId),
      );

      // If there are invalid rooms, reset the room selection
      if (hasInvalidRoom) {
        setFormFields((prev) => ({
          ...prev,
          resources: [""],
        }));
      }
    }
  };

  // Toggle recurrence
  const toggleRecurring = () => {
    setEventData((prev) => ({
      ...prev,
      isRecurring: !prev.isRecurring,
    }));
  };

  // Update recurrence days
  const toggleRecurringDay = (day: number) => {
    const updatedDays = [...formFields.recurringDays];
    const index = updatedDays.indexOf(day);

    if (index > -1) {
      updatedDays.splice(index, 1);
    } else {
      updatedDays.push(day);
    }

    setFormFields((prev) => ({
      ...prev,
      recurringDays: updatedDays,
    }));
  };

  // Add/remove resource fields
  const addResource = () => {
    setFormFields((prev) => ({
      ...prev,
      resources: [...prev.resources, ""],
    }));
  };

  const removeResource = (index: number) => {
    const updatedResources = [...formFields.resources];
    updatedResources.splice(index, 1);
    setFormFields((prev) => ({
      ...prev,
      resources: updatedResources,
    }));
  };

  const updateResource = (index: number, value: string) => {
    const updatedResources = [...formFields.resources];
    updatedResources[index] = value;
    setFormFields((prev) => ({
      ...prev,
      resources: updatedResources,
    }));
  };

  // Add/remove volunteer role fields
  const addVolunteerRole = () => {
    setFormFields((prev) => ({
      ...prev,
      volunteerRoles: [...prev.volunteerRoles, { role: "", count: 1 }],
    }));
  };

  const removeVolunteerRole = (index: number) => {
    const updatedRoles = [...formFields.volunteerRoles];
    updatedRoles.splice(index, 1);
    setFormFields((prev) => ({
      ...prev,
      volunteerRoles: updatedRoles,
    }));
  };

  const updateVolunteerRole = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedRoles = [...formFields.volunteerRoles];
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: value,
    };
    setFormFields((prev) => ({
      ...prev,
      volunteerRoles: updatedRoles,
    }));
  };

  // Update branch/organisation logic for event creation
  // If SUPER_ADMIN, use organisationId, else use branchId
  const prepareEventData = (): CreateEventInput => {
    const startDateTime =
      formFields.date && formFields.startTime
        ? new Date(`${formFields.date}T${formFields.startTime}`).toISOString()
        : new Date().toISOString();
    const endDateTime =
      formFields.date && formFields.endTime
        ? new Date(`${formFields.date}T${formFields.endTime}`).toISOString()
        : new Date(new Date(startDateTime).getTime() + 3600000).toISOString();

    const base: any = {
      title: eventData.title || "",
      description: eventData.description || "",
      type: eventData.type || EventType.OTHER,
      startDateTime,
      endDateTime,
      location: eventData.location || "",
      capacity: eventData.capacity || 0,
      registrationRequired: eventData.registrationRequired || false,
      registrationDeadline: eventData.registrationDeadline,
    };

    // Only include recurring fields if the event is actually recurring
    if (eventData.isRecurring) {
      const recurrencePattern = `${formFields.recurringFrequency}:${formFields.recurringInterval}:${formFields.recurringDays.join(",")}`;

      // Map frontend recurring fields to backend format
      const recurringFields = {
        isRecurring: true,
        recurrenceType: formFields.recurringFrequency.toUpperCase() as
          | "DAILY"
          | "WEEKLY"
          | "MONTHLY"
          | "YEARLY",
        recurrenceInterval: formFields.recurringInterval,
        recurrenceEndDate:
          formFields.recurringEndDate && formFields.recurringEndDate.trim()
            ? new Date(formFields.recurringEndDate).toISOString()
            : undefined,
        recurrenceDaysOfWeek: formFields.recurringDays.map((day) => {
          const days = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
          ];
          return days[day];
        }),
        recurrencePattern: recurrencePattern,
      };

      // Only include fields that have values - improved filtering
      Object.keys(recurringFields).forEach((key) => {
        const value = recurringFields[key];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          base[key] = value;
        }
      });
    }

    // Prefer branchId if present, else organisationId for super_admin
    if (orgBranchFilter.branchId) {
      return { ...base, branchId: orgBranchFilter.branchId };
    } else if (orgBranchFilter.organisationId) {
      return { ...base, organisationId: orgBranchFilter.organisationId } as any;
    }
    return base;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      const input = prepareEventData();

      const result = await createEvent(input);

      setApiSuccess(true);
      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push("/dashboard/calendar");
      }, 1500);
    } catch (error) {
      console.error("Error creating event:", error);
      setApiError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  };

  // Filter rooms by selected branch
  const filteredRooms =
    eventData.branchId && rooms
      ? rooms.filter(
          (room: {
            branchId: string;
            id: string;
            name: string;
            capacity: number;
          }) => room.branchId === eventData.branchId,
        )
      : [];

  // Form submit button with loading state
  const submitButton = (
    <button
      type="submit"
      disabled={mutationLoading}
      className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {mutationLoading ? (
        <>
          <ArrowPathIcon
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
          Saving...
        </>
      ) : (
        <>Save Event</>
      )}
    </button>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Event
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Fill out the form below to create a new calendar event.
          </p>
          {templateLoading && (
            <div className="mt-2 flex items-center text-sm text-gray-700">
              <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
              <span>Loading template...</span>
            </div>
          )}
          {templateError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <ExclamationCircleIcon className="h-4 w-4 mr-2" />
              <span>Error loading template: {templateError.message}</span>
            </div>
          )}
          {templateApplied && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <CheckIcon className="h-4 w-4 mr-2" />
              <span>Template applied: {template?.title}</span>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <Link href="/dashboard/calendar/templates">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Use Template
            </button>
          </Link>
        </div>
      </div>

      {/* API Message Banners */}
      {apiError && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error creating event
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{apiError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {apiSuccess && (
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Event created successfully!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Redirecting to calendar page...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Basic Information */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">
              Basic Information
            </h2>
          </div>
          <div className="px-6 py-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Event Title *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={eventData.title || ""}
                  onChange={handleEventDataChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Event Type *
              </label>
              <div className="mt-1">
                <select
                  id="type"
                  name="type"
                  required
                  value={eventData.type || EventType.SERVICE}
                  onChange={handleEventDataChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formFields.date}
                  onChange={handleFormFieldChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700"
              >
                Start Time *
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  required
                  value={formFields.startTime}
                  onChange={handleFormFieldChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="endTime"
                className="block text-sm font-medium text-gray-700"
              >
                End Time *
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  required
                  value={formFields.endTime}
                  onChange={handleFormFieldChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="branchId"
                className="block text-sm font-medium text-gray-700"
              >
                Branch *
              </label>
              <div className="mt-1">
                {user?.primaryRole === "super_admin" ? (
                  <select
                    id="branchId"
                    name="branchId"
                    required
                    value={eventData.branchId || ""}
                    onChange={handleBranchChange}
                    disabled={branchesLoading}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Branch</option>
                    {branchesLoading ? (
                      <option value="" disabled>
                        Loading branches...
                      </option>
                    ) : branches && branches.length > 0 ? (
                      branches.map((branch: { id: string; name: string }) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No branches available
                      </option>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    id="branchId"
                    name="branchId"
                    value={
                      branches.find(
                        (b: { id: string }) => b.id === eventData.branchId,
                      )?.name || ""
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
                    disabled
                  />
                )}
                {branchesError && (
                  <p className="mt-1 text-sm text-red-600">
                    Error loading branches. Please try again.
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location/Room *
              </label>
              <div className="mt-1">
                <select
                  id="location"
                  name="location"
                  required
                  value={eventData.location || ""}
                  onChange={handleEventDataChange}
                  disabled={roomsLoading || !eventData.branchId}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">
                    {!eventData.branchId
                      ? "Select a branch first"
                      : "Select a room"}
                  </option>
                  {roomsLoading ? (
                    <option value="" disabled>
                      Loading rooms...
                    </option>
                  ) : filteredRooms.length > 0 ? (
                    filteredRooms.map(
                      (room: {
                        id: string;
                        name: string;
                        capacity: number;
                      }) => (
                        <option key={room.id} value={room.id}>
                          {room.name} (Capacity: {room.capacity})
                        </option>
                      ),
                    )
                  ) : eventData.branchId ? (
                    <option value="" disabled>
                      No rooms available for this branch
                    </option>
                  ) : null}
                </select>
                {roomsError && (
                  <p className="mt-1 text-sm text-red-600">
                    Error loading rooms. Please try again.
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={eventData.description || ""}
                  onChange={handleEventDataChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Briefly describe the event, its purpose, and any special notes.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="expectedAttendees"
                className="block text-sm font-medium text-gray-700"
              >
                Expected Attendees
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="expectedAttendees"
                  id="expectedAttendees"
                  min="0"
                  value={formFields.expectedAttendees}
                  onChange={handleFormFieldChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Recurrence Pattern */}
          <div className="px-6 py-5 border-t border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">
                Recurrence Pattern
              </h2>
              <div className="flex items-center">
                <input
                  id="is-recurring"
                  name="isRecurring"
                  type="checkbox"
                  checked={eventData.isRecurring}
                  onChange={toggleRecurring}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="is-recurring"
                  className="ml-2 text-sm text-gray-700"
                >
                  This is a recurring event
                </label>
              </div>
            </div>
          </div>

          {eventData.isRecurring && (
            <div className="px-6 py-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="recurringFrequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Frequency
                </label>
                <div className="mt-1">
                  <select
                    id="recurringFrequency"
                    name="recurringFrequency"
                    required
                    value={formFields.recurringFrequency}
                    onChange={handleFormFieldChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled={!eventData.isRecurring}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="recurringInterval"
                  className="block text-sm font-medium text-gray-700"
                >
                  Repeat every
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    name="recurringInterval"
                    id="recurringInterval"
                    min="1"
                    value={formFields.recurringInterval}
                    onChange={handleFormFieldChange}
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <span className="ml-2 text-sm text-gray-500">
                    {formFields.recurringFrequency === "daily"
                      ? "days"
                      : formFields.recurringFrequency === "weekly"
                        ? "weeks"
                        : formFields.recurringFrequency === "monthly"
                          ? "months"
                          : ""}
                  </span>
                </div>
              </div>

              {eventData.recurringFrequency === "weekly" && (
                <div className="sm:col-span-6">
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-700">
                      Repeat on
                    </legend>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => toggleRecurringDay(index)}
                          className={`rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium ${
                            eventData.recurringDays!.includes(index)
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
          )}

          {/* Resources */}
          <div className="px-6 py-5 border-t border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">
              Resources Needed
            </h2>
          </div>
          <div className="px-6 py-6 space-y-4">
            {eventData.resources!.map((resource: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => updateResource(index, e.target.value)}
                  placeholder="e.g., Projector, Sound System, etc."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeResource(index)}
                  className="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResource}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Resource
            </button>
          </div>

          {/* Volunteer Roles */}
          <div className="px-6 py-5 border-t border-b border-gray-200">
            <h2 className="text-base font-medium text-gray-900">
              Volunteer Needs
            </h2>
          </div>
          <div className="px-6 py-6 space-y-4">
            {eventData.volunteerRoles!.map(
              (roleData: { role: string; count: number }, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={roleData.role}
                    onChange={(e) =>
                      updateVolunteerRole(index, "role", e.target.value)
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Role</option>
                    {rolesLoading ? (
                      <option value="" disabled>
                        Loading roles...
                      </option>
                    ) : fetchedVolunteerRoles &&
                      fetchedVolunteerRoles.length > 0 ? (
                      fetchedVolunteerRoles.map(
                        (role: {
                          id: string;
                          name: string;
                          description?: string;
                        }) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ),
                      )
                    ) : (
                      <option value="" disabled>
                        No volunteer roles available
                      </option>
                    )}
                  </select>
                  {rolesError && (
                    <p className="text-sm text-red-600">
                      Error loading roles. Please try again.
                    </p>
                  )}
                  <input
                    type="number"
                    min="1"
                    value={roleData.count}
                    onChange={(e) =>
                      updateVolunteerRole(
                        index,
                        "count",
                        parseInt(e.target.value),
                      )
                    }
                    className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <span className="text-sm text-gray-500">needed</span>
                  <button
                    type="button"
                    onClick={() => removeVolunteerRole(index)}
                    className="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ),
            )}
            <button
              type="button"
              onClick={addVolunteerRole}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              + Add Volunteer Role
            </button>
          </div>

          {/* Visibility Settings */}
          <div className="px-6 py-5 border-t border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">
                Visibility Settings
              </h2>
              <div className="flex items-center">
                <input
                  id="is-public"
                  name="isPublic"
                  type="checkbox"
                  checked={eventData.isPublic}
                  onChange={() =>
                    setEventData({
                      ...eventData,
                      isPublic: !eventData.isPublic,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="is-public"
                  className="ml-2 text-sm text-gray-700"
                >
                  Make this event public
                </label>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <Link href="/dashboard/calendar">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </Link>
            {submitButton}
          </div>
        </div>
      </form>
    </div>
  );
}
