"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";
import MemberSummaryCard from "../../components/MemberSummaryCard";
import MemberActivityTimeline from "../../components/MemberActivityTimeline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

// Placeholder for all member data and activities
const demoMember = {
  id: "1",
  name: "Jane Doe",
  email: "jane.doe@email.com",
  phone: "+233 555 123 456",
  joinDate: "2021-03-15",
  avatar: "",
  groups: ["Youth Ministry", "Choir"],
  family: "Doe Family",
  sacraments: ["Baptism", "Confirmation"],
  contributions: [
    { date: "2025-06-09", type: "Offering", fund: "General", paymentMethod: "Cash", amount: 50 },
    { date: "2025-05-01", type: "Tithe", fund: "Tithes", paymentMethod: "Mobile Money", amount: 120 },
  ],
  attendance: [
    { date: "2025-06-16", event: "Sunday Service", branch: "Main Sanctuary" },
    { date: "2025-06-02", event: "Midweek Service", branch: "Main Sanctuary" },
  ],
  prayerRequests: [
    { date: "2025-05-28", request: "Prayer for exams", status: "OPEN" },
  ],
  notifications: [
    { date: "2024-10-10", message: "Harvest Announcement", method: "SMS" },
  ],
};

const demoActivities = [
  {
    type: "Attendance",
    date: "2025-06-16",
    summary: "Attended Sunday Service",
    details: "Branch: Main Sanctuary",
    icon: "CalendarIcon",
  },
  {
    type: "Contribution",
    date: "2025-06-09",
    summary: "Gave Offering",
    details: "Amount: 50 GHS, Fund: General",
    icon: "CurrencyDollarIcon",
  },
  {
    type: "Prayer Request",
    date: "2025-05-28",
    summary: "Requested prayer for exams",
    details: "Prayer for wisdom and success in final exams.",
    icon: "ChatBubbleLeftEllipsisIcon",
  },
  {
    type: "Sacrament",
    date: "2024-12-25",
    summary: "Received Confirmation",
    details: "Officiated by Rev. Mensah",
    icon: "SparklesIcon",
  },
  {
    type: "Notification",
    date: "2024-10-10",
    summary: "Received SMS: Harvest Announcement",
    details: "Sent by Admin",
    icon: "EnvelopeIcon",
  },
];

const tabs = [
  { key: "profile", label: "Profile" },
  { key: "groups", label: "Groups" },
  { key: "family", label: "Family" },
  { key: "sacraments", label: "Sacraments" },
  { key: "attendance", label: "Attendance" },
  { key: "contributions", label: "Contributions" },
  { key: "prayerRequests", label: "Prayer Requests" },
  { key: "notifications", label: "Notifications" },
  { key: "activity", label: "Activity Timeline" },
];

export default function MemberActivityPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("profile");
  const member = demoMember;
  const activities = demoActivities;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen pb-12">
      <DashboardHeader
        title="Member Portal"
        subtitle={`Comprehensive profile for ${member.name}`}
        icon={<UserCircleIcon className="h-10 w-10 text-white" />}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="sticky top-24">
              <MemberSummaryCard member={member} />
            </div>
          </div>
          <div className="md:w-2/3 w-full">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 bg-white rounded-t-2xl shadow-sm px-2 pt-2 pb-0 flex flex-wrap gap-2">
              <nav className="flex flex-wrap gap-2" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={`px-4 py-2 rounded-t-lg font-semibold text-sm transition border-b-2  ${
                      activeTab === tab.key
                        ? "border-indigo-600 text-indigo-700 bg-indigo-50 shadow"
                        : "border-transparent text-gray-500 hover:text-indigo-700 hover:bg-indigo-50"
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            {/* Tab Content */}
            <div className="bg-white rounded-b-2xl shadow border border-t-0 border-gray-100 p-8 min-h-[340px] transition-all">
              {activeTab === "profile" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                    <div><span className="font-medium text-gray-700">Name:</span> {member.name}</div>
                    <div><span className="font-medium text-gray-700">Email:</span> {member.email}</div>
                    <div><span className="font-medium text-gray-700">Phone:</span> {member.phone}</div>
                    <div><span className="font-medium text-gray-700">Joined:</span> {new Date(member.joinDate).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
              {activeTab === "groups" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Groups</h3>
                  <ul className="list-disc ml-6 text-base text-gray-700">
                    {member.groups.map((g, i) => (<li key={i}>{g}</li>))}
                  </ul>
                </div>
              )}
              {activeTab === "family" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Family</h3>
                  <div className="text-base text-gray-700">{member.family}</div>
                </div>
              )}
              {activeTab === "sacraments" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Sacraments</h3>
                  <ul className="list-disc ml-6 text-base text-gray-700">
                    {member.sacraments.map((s, i) => (<li key={i}>{s}</li>))}
                  </ul>
                </div>
              )}
              {activeTab === "attendance" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Attendance</h3>
                  <ul className="divide-y divide-gray-100 text-base">
                    {member.attendance.map((a, i) => (
                      <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                        <span className="font-medium text-gray-800">{a.event}</span> <span className="text-gray-500">{a.branch}</span> <span className="text-gray-400">{new Date(a.date).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "contributions" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Contributions</h3>
                  <ul className="divide-y divide-gray-100 text-base">
                    {member.contributions.map((c, i) => (
                      <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                        <span className="font-medium text-gray-800">{c.type}</span> <span className="text-gray-500">{c.fund}</span> <span className="text-gray-400">{new Date(c.date).toLocaleDateString()}</span> <span className="text-green-700 font-semibold">GHS {c.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "prayerRequests" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Prayer Requests</h3>
                  <ul className="divide-y divide-gray-100 text-base">
                    {member.prayerRequests.map((p, i) => (
                      <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                        <span className="font-medium text-gray-800">{p.request}</span> <span className="text-gray-400">{new Date(p.date).toLocaleDateString()}</span> <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === "OPEN" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{p.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "notifications" && (
                <div>
                  <h3 className="font-bold text-xl mb-4 text-indigo-700">Notifications</h3>
                  <ul className="divide-y divide-gray-100 text-base">
                    {member.notifications.map((n, i) => (
                      <li key={i} className="py-3 flex flex-col md:flex-row md:items-center md:gap-4">
                        <span className="font-medium text-gray-800">{n.method}</span> <span className="text-gray-500">{n.message}</span> <span className="text-gray-400">{new Date(n.date).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "activity" && (
                <div className="pt-2">
                  <MemberActivityTimeline activities={activities} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
