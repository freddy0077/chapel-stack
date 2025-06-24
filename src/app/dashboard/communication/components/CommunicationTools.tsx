import { useState } from 'react';
import CommunicationHeader from './CommunicationHeader';
import CommunicationStats from './CommunicationStats';
import CommunicationTabs from './CommunicationTabs';
import MessagesList from './MessagesList';
import AnnouncementsList from './AnnouncementsList';
import PrayerRequestsList from './PrayerRequestsList';
import MessageModal from './MessageModal';
import AnnouncementModal from './AnnouncementModal';
import PrayerRequestModal from './PrayerRequestModal';
import NewMessageModal from './NewMessageModal';
import { mockAnnouncements, mockPrayerRequests } from './mockData';
import { Message, Announcement, PrayerRequest } from './types';
import { useMessages } from '../../../../graphql/hooks/useMessages';
import { useAuth } from '../../../../graphql/hooks/useAuth';


const CommunicationTools = () => {
  // State management
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [selectedPrayerRequest, setSelectedPrayerRequest] = useState<PrayerRequest | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  
  // Get current user's branch ID for filtering messages
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 
    ? user.userBranches[0].branch.id 
    : undefined;
  
  // Fetch real messages data using the useMessages hook
  const { messages: realMessages, loading: messagesLoading, error: messagesError, refetch: refetchMessages } = useMessages(branchId);

  // Function to handle search
  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    // Implement actual search functionality here when needed
  };

  // Modal handlers
  const openNewMessageModal = () => setShowNewMessageModal(true);
  const closeNewMessageModal = () => {
    setShowNewMessageModal(false);
    // Refetch messages after closing modal to get any newly created messages
    refetchMessages();
  };
  const openNewAnnouncementModal = () => setShowNewAnnouncementModal(true);
  const closeNewAnnouncementModal = () => setShowNewAnnouncementModal(false);

  // Stats for the stats component
  const communicationStats = {
    totalMessages: realMessages?.length || 0,
    totalAnnouncements: mockAnnouncements.length,
    prayerRequests: mockPrayerRequests.length,
    deliveryRate: 96, // Example delivery rate
  };

  // Use real messages data when available, otherwise show empty array
  const adaptedMessages = realMessages || [];

  // Adapted announcements data - create a new type-compatible array
  const adaptedAnnouncements = mockAnnouncements.map(announcement => ({
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    author: announcement.author,
    publishedDate: announcement.date || new Date().toISOString(),
    startDate: announcement.startDate || announcement.date || new Date().toISOString(),
    endDate: announcement.endDate || '',
    status: announcement.status,
    priority: announcement.priority || 'Medium',
    visibleTo: announcement.visibleTo ? announcement.visibleTo.join(', ') : 'All Members'
  }));

  // Adapted prayer requests data - create a new type-compatible array
  const adaptedPrayerRequests = mockPrayerRequests.map(request => {
    // Convert status if needed to match expected values
    let convertedStatus: 'Active' | 'Archived' | 'Answered' = 'Active';
    if (request.status === 'Answered') {
      convertedStatus = 'Answered';
    } else if (request.status === 'Praying') {
      convertedStatus = 'Active';
    } else if (request.status === 'New') {
      convertedStatus = 'Active';
    }
    
    return {
      id: request.id,
      title: request.title,
      content: request.content,
      requestorName: request.requester || 'Anonymous',
      dateSubmitted: request.date || new Date().toISOString(),
      status: convertedStatus,
      prayingCount: request.prayingCount || 0,
      type: request.type || 'General',
      category: request.category || 'Personal',
      isPrivate: request.isPrivate || false,
      prayerCount: request.prayerCount || 0
    };
  });

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Messages</h3>
              <button
                onClick={openNewMessageModal}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Message
              </button>
            </div>
            {messagesLoading ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-gray-500">Loading messages...</span>
              </div>
            ) : messagesError ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-red-500">Failed to load messages.</span>
              </div>
            ) : adaptedMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500 mb-6">Create your first message to start communicating with your members</p>
                <button
                  onClick={openNewMessageModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create New Message
                </button>
              </div>
            ) : (
              <MessagesList 
                messages={adaptedMessages} 
                onViewMessage={setSelectedMessage}
              />
            )}
          </div>
        );
      case 'announcements':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
              <button
                onClick={openNewAnnouncementModal}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Announcement
              </button>
            </div>
            <AnnouncementsList 
              announcements={adaptedAnnouncements} 
              onViewAnnouncement={(announcement) => {
                const originalAnnouncement = mockAnnouncements.find(a => a.id === announcement.id);
                if (originalAnnouncement) {
                  setSelectedAnnouncement(originalAnnouncement);
                }
              }}
            />
          </div>
        );
      case 'prayer-requests':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Prayer Requests</h3>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                New Prayer Request
              </button>
            </div>
            <PrayerRequestsList 
              prayerRequests={adaptedPrayerRequests} 
              onViewPrayerRequest={(prayerRequest) => {
                const originalRequest = mockPrayerRequests.find(r => r.id === prayerRequest.id);
                if (originalRequest) {
                  setSelectedPrayerRequest(originalRequest);
                }
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CommunicationHeader 
          onSearch={handleSearch} 
          onNewMessage={openNewMessageModal} 
          onNewAnnouncement={openNewAnnouncementModal} 
        />
        <CommunicationStats
          totalMessages={communicationStats.totalMessages}
          totalAnnouncements={communicationStats.totalAnnouncements}
          prayerRequests={communicationStats.prayerRequests}
          deliveryRate={communicationStats.deliveryRate}
        />
        <CommunicationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {renderTabContent()}
        
        {selectedMessage && (
          <MessageModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />
        )}
        
        {selectedAnnouncement && (
          <AnnouncementModal announcement={selectedAnnouncement} onClose={() => setSelectedAnnouncement(null)} />
        )}
        
        {selectedPrayerRequest && (
          <PrayerRequestModal prayerRequest={selectedPrayerRequest} onClose={() => setSelectedPrayerRequest(null)} />
        )}

        {/* Enhanced New Message Modal */}
        <NewMessageModal open={showNewMessageModal} onClose={closeNewMessageModal} />

        {/* New Announcement Modal */}
        {showNewAnnouncementModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">New Announcement</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter announcement title" />
                      </div>
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea id="content" name="content" rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter announcement content" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input type="date" name="startDate" id="startDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                          <input type="date" name="endDate" id="endDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                        <select id="priority" name="priority" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Publish Announcement</button>
                <button type="button" onClick={closeNewAnnouncementModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationTools;