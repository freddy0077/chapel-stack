"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

// Import custom components
import MembersTab from './components/MembersTab';
import EventsTab from './components/EventsTab';

// Define types for ministry data

interface MinistryLeader {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  imageUrl: string;
}

interface Ministry {
  id: string;
  name: string;
  description: string;
  category: string;
  meetingDay: string;
  meetingTime: string;
  location: string;
  memberCount: number;
  establishedDate: Date;
  leaders: MinistryLeader[];
  vision: string;
  mission: string;
  logoUrl: string;
}

// Mock ministry data
const MOCK_MINISTRIES: Record<string, Ministry> = {
  '1': {
    id: '1',
    name: 'Worship Ministry',
    description: 'Leads the congregation in worship through music and arts.',
    category: 'Music & Arts',
    meetingDay: 'Wednesday',
    meetingTime: '6:30 PM',
    location: 'Main Sanctuary',
    memberCount: 32,
    establishedDate: new Date('2018-03-15'),
    leaders: [
      {
        id: 'l1',
        name: 'John Doe',
        email: 'john.doe@church.org',
        phone: '(555) 123-4567',
        position: 'Worship Director',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'l2',
        name: 'Jane Smith',
        email: 'jane.smith@church.org',
        phone: '(555) 987-6543',
        position: 'Vocal Director',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ],
    vision: 'To create an atmosphere where people can encounter God through authentic worship.',
    mission: 'Equipping and leading the congregation in worship that glorifies God and transforms lives.',
    logoUrl: 'https://placehold.co/200x200?text=Worship'
  },
  '2': {
    id: '2',
    name: 'Children&apos;s Ministry',
    description: 'Nurtures the spiritual growth of children through age-appropriate teaching and activities.',
    category: 'Education',
    meetingDay: 'Sunday',
    meetingTime: '9:30 AM',
    location: 'Children&apos;s Wing',
    memberCount: 45,
    establishedDate: new Date('2015-06-10'),
    leaders: [
      {
        id: 'l3',
        name: 'Michael Johnson',
        email: 'michael.johnson@church.org',
        phone: '(555) 234-5678',
        position: 'Children\'s Director',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ],
    vision: 'To see children grow in their relationship with Christ and develop a strong spiritual foundation.',
    mission: 'Providing a safe, fun, and enriching environment where children can learn about Jesus and develop their faith.',
    logoUrl: 'https://placehold.co/200x200?text=Kids'
  },
  '3': {
    id: '3',
    name: 'Youth Ministry',
    description: 'Engages teenagers in faith development through fellowship, teaching, and service.',
    category: 'Education',
    meetingDay: 'Friday',
    meetingTime: '7:00 PM',
    location: 'Youth Center',
    memberCount: 38,
    establishedDate: new Date('2016-08-22'),
    leaders: [
      {
        id: 'l4',
        name: 'Sarah Williams',
        email: 'sarah.williams@church.org',
        phone: '(555) 876-5432',
        position: 'Youth Pastor',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ],
    vision: 'To inspire and equip youth to become passionate followers of Christ.',
    mission: 'Creating a community where teenagers can grow spiritually, build authentic relationships, and discover their God-given purpose.',
    logoUrl: 'https://placehold.co/200x200?text=Youth'
  }
};

export default function MinistryDetailsPage() {
  const params = useParams();
  const ministryId = params.id as string;
  
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch ministry data
    const fetchMinistry = () => {
      setLoading(true);
      
      setTimeout(() => {
        const ministryData = MOCK_MINISTRIES[ministryId];
        
        if (ministryData) {
          setMinistry(ministryData);
          setError(null);
        } else {
          setError('Ministry not found');
        }
        
        setLoading(false);
      }, 500); // Simulate API delay
    };
    
    fetchMinistry();
  }, [ministryId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error || !ministry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Error: {error || 'Unknown error'}</h1>
        <p className="text-gray-600 mb-6">We couldn't find the ministry you're looking for.</p>
        <Link 
          href="/dashboard/ministries"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Ministries
        </Link>
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/ministries"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Ministries
        </Link>
      </div>
      
      {/* Ministry Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ministry.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{ministry.category}</p>
          </div>
          <Image
            src={ministry.logoUrl}
            alt={`${ministry.name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover border border-gray-200"
          />
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{ministry.description}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Meeting Schedule</dt>
              <dd className="mt-1 text-sm text-gray-900">{ministry.meetingDay}s at {ministry.meetingTime}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{ministry.location}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Members</dt>
              <dd className="mt-1 text-sm text-gray-900">{ministry.memberCount} members</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Established</dt>
              <dd className="mt-1 text-sm text-gray-900">{ministry.establishedDate.toLocaleDateString()}</dd>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ministry Leaders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Leadership Team</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Contact information for the ministry leaders</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {ministry.leaders.map(leader => (
              <li key={leader.id} className="py-4 flex px-6">
                <Image 
                  className="h-12 w-12 rounded-full object-cover"
                  src={leader.imageUrl} 
                  alt={leader.name}
                  width={48}
                  height={48}
                />
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{leader.name}</div>
                  <div className="text-sm text-gray-600">{leader.position}</div>
                  <div className="text-sm text-gray-500 mt-1">{leader.email}</div>
                  <div className="text-sm text-gray-500">{leader.phone}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Vision and Mission */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Vision & Mission</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Vision</h3>
            <p className="text-sm text-gray-600">{ministry.vision}</p>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Mission</h3>
            <p className="text-sm text-gray-600">{ministry.mission}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <nav className="flex flex-wrap space-x-1 md:space-x-8">
            <button 
              className={`px-1 py-4 text-sm font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-1 py-4 text-sm font-medium ${activeTab === 'members' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('members')}
            >
              Members
            </button>
            <button 
              className={`px-1 py-4 text-sm font-medium ${activeTab === 'events' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
            <button 
              className={`px-1 py-4 text-sm font-medium ${activeTab === 'resources' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </button>
            <button 
              className={`px-1 py-4 text-sm font-medium ${activeTab === 'budget' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('budget')}
            >
              Budget
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Ministry Overview</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed description and core information</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ministry.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Vision</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ministry.vision}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mission</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ministry.mission}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Meeting Schedule</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ministry.meetingDay}s at {ministry.meetingTime}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ministry.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Established</dt>
                  <dd className="mt-1 text-sm text-gray-900">{ministry.establishedDate.toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
        
        {/* Members Tab */}
        {activeTab === 'members' && (
          <MembersTab ministryId={ministryId} ministryName={ministry.name} />
        )}
        
        {/* Events Tab */}
        {activeTab === 'events' && (
          <EventsTab ministryId={ministryId} ministryName={ministry.name} />
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Ministry Resources</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Documents, training materials, and assets</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-12 text-center">
                <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No resources</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a resource</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                    Upload Resource
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Ministry Budget</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Financial planning and expenditures</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-12 text-center">
                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No budget information</h3>
                <p className="mt-1 text-sm text-gray-500">Create a budget plan for this ministry</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  >
                    <CurrencyDollarIcon className="-ml-1 mr-2 h-5 w-5" />
                    Create Budget
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
