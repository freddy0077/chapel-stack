"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  EnvelopeIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TextInput,
  Textarea,
  Select,
  SelectItem,
  Button
} from "@tremor/react";

// Types
interface Group {
  id: string;
  name: string;
  members: number;
  leader: string;
  meetingDay: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'both';
}

interface Message {
  id: string;
  groupId: string;
  subject: string;
  body: string;
  createdAt: Date;
  sentBy: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledFor?: Date;
  messageType: 'announcement' | 'reminder' | 'groupChat';
  readBy: string[];
}

// Mock data
const mockGroups: Group[] = [
  { id: '1', name: 'Young Adults Bible Study', members: 15, leader: 'Michael Chen', meetingDay: 'Tuesday' },
  { id: '2', name: 'Prayer Warriors', members: 12, leader: 'Sarah Johnson', meetingDay: 'Thursday' },
  { id: '3', name: 'Men\'s Fellowship', members: 18, leader: 'Marcus Williams', meetingDay: 'Saturday' },
  { id: '4', name: 'Women\'s Bible Study', members: 21, leader: 'Rebecca Thomas', meetingDay: 'Monday' },
  { id: '5', name: 'College Ministry', members: 25, leader: 'David Patel', meetingDay: 'Wednesday' },
  { id: '6', name: 'Seniors Group', members: 14, leader: 'Elizabeth Warren', meetingDay: 'Friday' },
];

// Mock members
const mockMembers: Record<string, Member[]> = {
  '1': [
    { id: '101', name: 'Alex Johnson', email: 'alex@example.com', phone: '555-1234', preferredContact: 'both' },
    { id: '102', name: 'Taylor Swift', email: 'taylor@example.com', phone: '555-2345', preferredContact: 'email' },
    { id: '103', name: 'Jordan Lee', email: 'jordan@example.com', phone: '555-3456', preferredContact: 'phone' },
    { id: '104', name: 'Morgan Chen', email: 'morgan@example.com', phone: '555-4567', preferredContact: 'email' },
  ],
  '2': [
    { id: '201', name: 'Dana Cruz', email: 'dana@example.com', phone: '555-1111', preferredContact: 'both' },
    { id: '202', name: 'Sam Rodriguez', email: 'sam@example.com', phone: '555-2222', preferredContact: 'email' },
  ],
};

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'm1',
    groupId: '1',
    subject: 'Bible Study Reminder',
    body: 'Don\'t forget our study this Tuesday at 7pm. We\'ll be continuing our series on Ephesians.',
    createdAt: new Date(2025, 3, 10),
    sentBy: 'Michael Chen',
    status: 'sent',
    messageType: 'reminder',
    readBy: ['101', '102']
  },
  {
    id: 'm2',
    groupId: '1',
    subject: 'Location Change Next Week',
    body: 'Please note that next week\'s meeting will be held in Room 204 instead of our usual Room 101.',
    createdAt: new Date(2025, 3, 8),
    sentBy: 'Michael Chen',
    status: 'sent',
    messageType: 'announcement',
    readBy: ['101', '103', '104']
  },
  {
    id: 'm3',
    groupId: '2',
    subject: 'Prayer Requests Update',
    body: 'Here are the updated prayer requests for this week...',
    createdAt: new Date(2025, 3, 11),
    sentBy: 'Sarah Johnson',
    status: 'sent',
    messageType: 'groupChat',
    readBy: ['201']
  },
];

// Message templates
const messageTemplates = [
  { 
    id: 'template1', 
    title: 'Weekly Meeting Reminder', 
    subject: 'Reminder: [Group Name] Meeting Tomorrow',
    body: 'Hello everyone,\n\nThis is a friendly reminder that we have our [Group Name] meeting tomorrow at [Time] in [Location].\n\nWe\'ll be discussing [Topic].\n\nLooking forward to seeing you all!\n\n[Leader Name]'
  },
  { 
    id: 'template2', 
    title: 'Event Announcement', 
    subject: 'Upcoming [Group Name] Event',
    body: 'Dear [Group Name] members,\n\nWe\'re excited to announce our upcoming event: [Event Name]!\n\nDate: [Date]\nTime: [Time]\nLocation: [Location]\n\nPlease let me know if you can attend by replying to this message.\n\nBlessings,\n[Leader Name]'
  },
  { 
    id: 'template3', 
    title: 'Prayer Request Form', 
    subject: 'Prayer Requests for this Week',
    body: 'Dear prayer partners,\n\nPlease share any prayer requests for this week by replying to this message.\n\nRemember, all requests are kept confidential within our group unless specified otherwise.\n\nIn prayer,\n[Leader Name]'
  },
];

export default function GroupCommunication() {
  const [selectedGroup, setSelectedGroup] = useState<string>(mockGroups[0]?.id || '');
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [messageSubject, setMessageSubject] = useState<string>('');
  const [messageBody, setMessageBody] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('announcement');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Get group members
  const groupMembers = selectedGroup ? (mockMembers[selectedGroup] || []) : [];
  
  // Get group messages
  const groupMessages = mockMessages.filter(msg => msg.groupId === selectedGroup);
  
  // Apply a template
  const applyTemplate = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      const group = mockGroups.find(g => g.id === selectedGroup);
      let subject = template.subject;
      let body = template.body;
      
      // Replace placeholders
      if (group) {
        subject = subject.replace('[Group Name]', group.name);
        body = body.replace(/\[Group Name\]/g, group.name);
        body = body.replace(/\[Leader Name\]/g, group.leader);
      }
      
      setMessageSubject(subject);
      setMessageBody(body);
    }
  };
  
  // Send message
  const sendMessage = () => {
    if (!messageSubject || !messageBody) {
      alert('Please provide both subject and message content');
      return;
    }
    
    // In a real app, this would send the message to the backend
    alert('Message sent successfully!');
    
    // Reset form
    setMessageSubject('');
    setMessageBody('');
    setSelectedTemplate('');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Group Communication
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Tools for group leaders to communicate with members
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Send announcements, reminders, and updates
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/dashboard/groups">
                <Button variant="secondary" className="mr-3">
                  Back to Groups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Group selection sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Groups
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a group to manage communications
                </p>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {mockGroups.map((group) => (
                  <li key={group.id}>
                    <button
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full px-4 py-4 flex items-center hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                        selectedGroup === group.id ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedGroup === group.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <UserGroupIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {group.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {group.members} members • {group.meetingDay}s
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Communication tools */}
          <div className="lg:col-span-3">
            {selectedGroup ? (
              <div>
                <Card>
                  <TabGroup 
                    index={selectedTab} 
                    onIndexChange={setSelectedTab}
                  >
                    <TabList variant="solid">
                      <Tab icon={EnvelopeIcon}>Send Message</Tab>
                      <Tab icon={BellAlertIcon}>Reminders</Tab>
                      <Tab icon={ChatBubbleLeftRightIcon}>Group Chat</Tab>
                      <Tab icon={ClockIcon}>Message History</Tab>
                    </TabList>
                    <TabPanels>
                      {/* Send Message Tab */}
                      <TabPanel>
                        <div className="space-y-6 mt-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Message Type
                            </label>
                            <Select
                              value={messageType}
                              onValueChange={setMessageType}
                            >
                              <SelectItem value="announcement">Announcement</SelectItem>
                              <SelectItem value="reminder">Reminder</SelectItem>
                              <SelectItem value="groupChat">Group Chat</SelectItem>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Use Template
                            </label>
                            <Select
                              value={selectedTemplate}
                              onValueChange={(value) => {
                                setSelectedTemplate(value);
                                applyTemplate(value);
                              }}
                              placeholder="Select a template or write from scratch"
                            >
                              <SelectItem value="">Custom Message</SelectItem>
                              {messageTemplates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.title}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subject
                            </label>
                            <TextInput
                              placeholder="Enter message subject"
                              value={messageSubject}
                              onChange={(e) => setMessageSubject(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Message
                            </label>
                            <Textarea
                              placeholder="Enter your message"
                              value={messageBody}
                              onChange={(e) => setMessageBody(e.target.value)}
                              rows={10}
                            />
                          </div>
                          
                          <div className="pt-3 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Recipients: {groupMembers.length} members
                            </span>
                            <div className="flex space-x-3">
                              <Button variant="secondary">
                                Save Draft
                              </Button>
                              <Button
                                icon={PaperAirplaneIcon}
                                onClick={sendMessage}
                              >
                                Send Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      
                      {/* Reminders Tab */}
                      <TabPanel>
                        <div className="space-y-6 mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Scheduled Reminders</h3>
                            <Button size="xs">
                              New Reminder
                            </Button>
                          </div>
                          
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <CalendarDaysIcon className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  Weekly Reminder (Recurring)
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>Sends a reminder email every Monday at 9:00 AM</p>
                                  <p className="mt-1">
                                    "Don't forget our Bible study tomorrow at 7:00 PM!"
                                  </p>
                                </div>
                                <div className="mt-3">
                                  <div className="-mx-2 -my-1.5 flex">
                                    <button
                                      type="button"
                                      className="px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                                    >
                                      Disable
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <CalendarDaysIcon className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-indigo-800">
                                  Special Event Reminder (One-time)
                                </h3>
                                <div className="mt-2 text-sm text-indigo-700">
                                  <p>Sends on April 15, 2025 at 10:00 AM</p>
                                  <p className="mt-1">
                                    "Reminder about our special guest speaker this week!"
                                  </p>
                                </div>
                                <div className="mt-3">
                                  <div className="-mx-2 -my-1.5 flex">
                                    <button
                                      type="button"
                                      className="px-2 py-1.5 rounded-md text-sm font-medium text-indigo-800 hover:bg-indigo-100"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-indigo-800 hover:bg-indigo-100"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      
                      {/* Group Chat Tab */}
                      <TabPanel>
                        <div className="flex flex-col space-y-4 mt-6">
                          <div className="text-center py-12">
                            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Group Chat Feature</h3>
                            <p className="mt-1 text-gray-500 max-w-md mx-auto">
                              This feature allows ongoing conversations between group members.
                              All members can participate in the discussion.
                            </p>
                            <div className="mt-6">
                              <Button>
                                Start New Discussion
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      
                      {/* Message History Tab */}
                      <TabPanel>
                        <div className="mt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
                          
                          {groupMessages.length > 0 ? (
                            <div className="space-y-4">
                              {groupMessages.map((message) => (
                                <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="text-md font-medium text-gray-900">
                                        {message.subject}
                                      </h4>
                                      <p className="text-sm text-gray-500 mt-1">
                                        Sent by {message.sentBy} on {message.createdAt.toLocaleDateString()}
                                      </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      message.messageType === 'announcement' ? 'bg-blue-100 text-blue-800' : 
                                      message.messageType === 'reminder' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {message.messageType.charAt(0).toUpperCase() + message.messageType.slice(1)}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-600">
                                    {message.body.length > 150 ? 
                                      message.body.substring(0, 150) + '...' : 
                                      message.body}
                                  </div>
                                  <div className="mt-3 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">
                                      Read by {message.readBy.length} members
                                    </span>
                                    <div className="flex space-x-2">
                                      <Button size="xs" variant="light" icon={DocumentDuplicateIcon}>
                                        Duplicate
                                      </Button>
                                      <Button size="xs" variant="light">
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No messages sent yet</p>
                            </div>
                          )}
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </Card>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No group selected</h3>
                <p className="mt-1 text-gray-500">
                  Please select a group from the list to manage communications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
