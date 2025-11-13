"use client";

import { useParams, useRouter } from "next/navigation";
import { useEvent } from "@/graphql/hooks/useEvents";
import EventRegistration from "@/components/events/EventRegistration";
import Loading from "@/components/ui/Loading";
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import EventTypeIcon from "@/components/events/EventTypeIcon";

export default function PublicEventRegistration() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { event, loading, error } = useEvent(eventId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Event</h1>
            <p className="text-gray-600 mb-6">We couldn't load the event details. Please try again later.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event.isPublic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-yellow-500 text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Private Event</h1>
            <p className="text-gray-600 mb-6">This event is private and not open for public registration.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event.registrationRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-blue-500 text-6xl mb-4">ℹ️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Registration Required</h1>
            <p className="text-gray-600 mb-6">This event doesn't require registration. Just show up!</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>{format(new Date(event.startDate), "PPP p")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{event.location || "TBA"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <EventTypeIcon eventType={event.eventType} size="lg" className="text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-2">
                  {event.eventType?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                {event.description && (
                  <p className="text-white/90 text-lg">{event.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Date & Time</div>
                  <div className="text-gray-900 font-semibold">
                    {format(new Date(event.startDate), "PPP")}
                  </div>
                  <div className="text-gray-600">
                    {format(new Date(event.startDate), "p")}
                    {event.endDate && ` - ${format(new Date(event.endDate), "p")}`}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Location</div>
                  <div className="text-gray-900 font-semibold">
                    {event.location || "To Be Announced"}
                  </div>
                </div>
              </div>

              {event.capacity && (
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium">Capacity</div>
                    <div className="text-gray-900 font-semibold">
                      {event.eventRegistrations?.length || 0} / {event.capacity} registered
                    </div>
                  </div>
                </div>
              )}

              {event.registrationDeadline && (
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <CalendarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium">Registration Deadline</div>
                    <div className="text-gray-900 font-semibold">
                      {format(new Date(event.registrationDeadline), "PPP")}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!event.isFree && event.ticketPrice && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-800 font-medium">Event Fee</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {event.currency || "USD"} {event.ticketPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-blue-600">
                    💳
                  </div>
                </div>
              </div>
            )}

            {event.requiresApproval && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 text-xl">⏳</div>
                  <div>
                    <div className="font-semibold text-yellow-900">Approval Required</div>
                    <div className="text-sm text-yellow-800">
                      Your registration will be reviewed and you'll receive a confirmation email once approved.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Registration Form */}
        <EventRegistration
          open={true}
          event={event}
          isPublicPage={true}
          onClose={() => {}}
          onSuccess={() => {
            toast.success("Registration successful! Check your email for confirmation.");
            setTimeout(() => {
              router.push("/");
            }, 2000);
          }}
        />
      </div>
    </div>
  );
}
