"use client";

import { useState } from "react";
import { 
  CalendarDaysIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  BellIcon,
  BellSlashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  GiftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Anniversary {
  id: string;
  type: "Baptism" | "FirstCommunion" | "Confirmation" | "Marriage";
  memberId: string;
  memberName: string;
  spouse2Id?: string;
  spouse2Name?: string;
  eventDate: string;
  originalDate: string;
  years: number;
  notificationSent: boolean;
  notificationDate?: string;
  notificationType: "Email" | "SMS" | "Both" | "None";
  specialMilestone: boolean;
}

// Mock data for upcoming anniversaries
const mockAnniversaries: Anniversary[] = [
  {
    id: "ann-1",
    type: "Marriage",
    memberId: "mem-123",
    memberName: "Michael Johnson",
    spouse2Id: "mem-124",
    spouse2Name: "Sarah Williams",
    eventDate: "2024-05-18", // Anniversary coming up
    originalDate: "2022-05-18",
    years: 2,
    notificationSent: false,
    notificationType: "Both",
    specialMilestone: false
  },
  {
    id: "ann-2",
    type: "Baptism",
    memberId: "mem-456",
    memberName: "Emma Wilson",
    eventDate: "2024-04-10", // Very soon
    originalDate: "2017-04-10",
    years: 7,
    notificationSent: true,
    notificationDate: "2024-03-27",
    notificationType: "Email",
    specialMilestone: false
  },
  {
    id: "ann-3",
    type: "Marriage",
    memberId: "mem-789",
    memberName: "Christopher Moore",
    spouse2Id: "mem-790",
    spouse2Name: "Elizabeth Clark",
    eventDate: "2024-06-11", 
    originalDate: "1999-06-11",
    years: 25,
    notificationSent: false,
    notificationType: "Both",
    specialMilestone: true
  },
  {
    id: "ann-4",
    type: "Confirmation",
    memberId: "mem-101",
    memberName: "Olivia Taylor",
    eventDate: "2024-06-17",
    originalDate: "2014-06-17",
    years: 10,
    notificationSent: false,
    notificationType: "Email",
    specialMilestone: true
  },
  {
    id: "ann-5",
    type: "FirstCommunion",
    memberId: "mem-112",
    memberName: "William Davis",
    eventDate: "2024-05-05",
    originalDate: "2019-05-05",
    years: 5,
    notificationSent: false,
    notificationType: "None",
    specialMilestone: false
  },
  {
    id: "ann-6",
    type: "Marriage",
    memberId: "mem-131",
    memberName: "Matthew Thompson",
    spouse2Id: "mem-132",
    spouse2Name: "Sophia Martinez",
    eventDate: "2024-08-19",
    originalDate: "1974-08-19",
    years: 50,
    notificationSent: false,
    notificationType: "Both",
    specialMilestone: true
  }
];

export function AnniversaryTracker() {
  const [filter, setFilter] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("upcoming");
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>(mockAnniversaries);
  const [showSettings, setShowSettings] = useState(false);

  // Filter anniversaries based on selected filters
  const filteredAnniversaries = anniversaries.filter(anniversary => {
    // Filter by type
    if (filter !== "all" && anniversary.type.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }

    // Filter by timeframe
    const today = new Date();
    const eventDate = new Date(anniversary.eventDate);
    const daysDifference = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (timeframe === "upcoming" && daysDifference > 90) {
      return false;
    } else if (timeframe === "thisMonth" && (daysDifference < 0 || daysDifference > 30)) {
      return false;
    } else if (timeframe === "nextMonth" && (daysDifference < 30 || daysDifference > 60)) {
      return false;
    } else if (timeframe === "past" && daysDifference >= 0) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort by date (ascending)
    return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const daysDifference = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 0) {
      return `${Math.abs(daysDifference)} days ago`;
    } else if (daysDifference === 0) {
      return "Today!";
    } else if (daysDifference === 1) {
      return "Tomorrow";
    } else {
      return `In ${daysDifference} days`;
    }
  };

  const toggleNotification = (id: string) => {
    setAnniversaries(prev => 
      prev.map(ann => 
        ann.id === id 
          ? { ...ann, notificationSent: !ann.notificationSent, notificationDate: !ann.notificationSent ? new Date().toISOString() : undefined } 
          : ann
      )
    );
  };

  const sendAllNotifications = () => {
    setAnniversaries(prev => 
      prev.map(ann => 
        !ann.notificationSent 
          ? { ...ann, notificationSent: true, notificationDate: new Date().toISOString() } 
          : ann
      )
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900">Anniversary Tracker</h2>
        <div className="flex flex-wrap gap-2">
          <select
            id="filter"
            name="filter"
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Sacraments</option>
            <option value="baptism">Baptism Only</option>
            <option value="firstcommunion">First Communion Only</option>
            <option value="confirmation">Confirmation Only</option>
            <option value="marriage">Marriage Only</option>
          </select>
          
          <select
            id="timeframe"
            name="timeframe"
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="upcoming">Next 90 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="nextMonth">Next Month</option>
            <option value="past">Past Anniversaries</option>
          </select>
          
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setShowSettings(!showSettings)}
          >
            <ChevronDownIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="notifyDays" className="block text-sm font-medium text-gray-700">
                Send notifications before (days)
              </label>
              <select
                id="notifyDays"
                name="notifyDays"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                defaultValue="14"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
            <div>
              <label htmlFor="notificationType" className="block text-sm font-medium text-gray-700">
                Default notification method
              </label>
              <select
                id="notificationType"
                name="notificationType"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                defaultValue="email"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="both">Both Email & SMS</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input
              id="specialOnly"
              name="specialOnly"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              defaultChecked={true}
            />
            <label htmlFor="specialOnly" className="ml-2 block text-sm text-gray-900">
              Highlight special milestones (5, 10, 25, 50 years)
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setShowSettings(false)}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {filteredAnniversaries.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {filteredAnniversaries.length} anniversaries
          </div>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={sendAllNotifications}
          >
            <EnvelopeIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Send All Notifications
          </button>
        </div>
      )}

      {filteredAnniversaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No anniversaries found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No anniversaries match your current filter and timeframe settings.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setTimeframe("upcoming");
              }}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {filteredAnniversaries.map((anniversary) => (
            <div 
              key={anniversary.id} 
              className={`p-6 hover:bg-gray-50 ${anniversary.specialMilestone ? 'bg-yellow-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {anniversary.type === "Marriage" ? (
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/dashboard/members/${anniversary.memberId}`} className="hover:text-indigo-600">
                          {anniversary.memberName}
                        </Link>
                        {" & "}
                        <Link href={`/dashboard/members/${anniversary.spouse2Id}`} className="hover:text-indigo-600">
                          {anniversary.spouse2Name}
                        </Link>
                      </h3>
                    ) : (
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/dashboard/members/${anniversary.memberId}`} className="hover:text-indigo-600">
                          {anniversary.memberName}
                        </Link>
                      </h3>
                    )}
                    
                    {anniversary.specialMilestone && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        <GiftIcon className="-ml-0.5 mr-1 h-4 w-4" />
                        {anniversary.years} Year{anniversary.years !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">{anniversary.type} Anniversary:</span>
                    {formatDate(anniversary.eventDate)} ({getDaysUntil(anniversary.eventDate)})
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="font-medium">Original Date:</span> {formatDate(anniversary.originalDate)} 
                    ({anniversary.years} year{anniversary.years !== 1 ? 's' : ''})
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <div className="mr-4 text-sm">
                      Notification: 
                      <span className={`ml-1 font-medium ${anniversary.notificationType === "None" ? 'text-gray-400' : 'text-gray-900'}`}>
                        {anniversary.notificationType}
                      </span>
                    </div>
                    
                    {anniversary.notificationSent ? (
                      <span className="inline-flex items-center text-xs text-green-700">
                        <BellIcon className="mr-1 h-4 w-4" />
                        Sent on {anniversary.notificationDate ? formatDate(anniversary.notificationDate) : 'Unknown date'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <BellSlashIcon className="mr-1 h-4 w-4" />
                        Not sent yet
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    type="button"
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                      anniversary.notificationSent
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                    onClick={() => toggleNotification(anniversary.id)}
                    disabled={anniversary.notificationSent}
                  >
                    <EnvelopeIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    {anniversary.notificationSent ? 'Notification Sent' : 'Send Notification'}
                  </button>
                  
                  {anniversary.type === "Marriage" && (
                    <Link
                      href={`/dashboard/sacraments/marriage/edit/${anniversary.id.replace('ann-', 'mar-')}`}
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      View Record
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
