"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorshipHeader from './components/WorshipHeader';
import WorshipStats from './components/WorshipStats';
import WorshipTabs from './components/WorshipTabs';
import ServicesList, { mockServices, ServicePlan } from './components/ServicesList';
import SongLibrary, { mockSongs, Song } from './components/SongLibrary';
import TeamScheduling, { mockTeamMembers, mockSchedules, TeamMemberProfile } from './components/TeamScheduling';
import ResourceLibrary, { mockResources, Resource } from './components/ResourceLibrary';
import ServiceDetailsModal from './components/modals/ServiceDetailsModal';
import SongDetailsModal from './components/modals/SongDetailsModal';
import TeamMemberDetailsModal from './components/modals/TeamMemberDetailsModal';
import ResourceDetailsModal from './components/modals/ResourceDetailsModal';
import CreateServiceModal from './components/modals/CreateServiceModal';
import AddSongModal from './components/modals/AddSongModal';
import RehearsalTracker, { mockRehearsals, Rehearsal, RehearsalAttendee } from './components/features/RehearsalTracker';
import RehearsalDetailsModal from './components/modals/RehearsalDetailsModal';
import CreateRehearsalModal from './components/modals/CreateRehearsalModal';
import SpotifyIntegration from './components/SpotifyIntegration';

export default function WorshipPage() {
  // State for tabs
  const [activeTab, setActiveTab] = useState('services');
  
  // Import the router
  const router = useRouter();
  
  // Handle tab changes with navigation when appropriate
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Navigate to specific pages for certain tabs
    if (tab === 'teams') {
      router.push('/dashboard/worship/members');
    }
  };
  
  // State for statistics
  const upcomingServices = mockServices.filter(service => !service.completed).length;
  const songsInLibrary = mockSongs.length;
  const teamMembers = mockTeamMembers.length;
  const completedServices = mockServices.filter(service => service.completed).length;

  // State for modals
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false);
  const [showSongDetailsModal, setShowSongDetailsModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showTeamMemberDetailsModal, setShowTeamMemberDetailsModal] = useState(false);
  const [showResourceDetailsModal, setShowResourceDetailsModal] = useState(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showRehearsalDetailsModal, setShowRehearsalDetailsModal] = useState(false);
  const [showCreateRehearsalModal, setShowCreateRehearsalModal] = useState(false);
  
  // State for selected items
  const [selectedService, setSelectedService] = useState<ServicePlan | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMemberProfile | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedRehearsal, setSelectedRehearsal] = useState<Rehearsal | null>(null);
  
  // State for data
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>(mockRehearsals);

  // Handlers for viewing item details
  const handleViewService = (service: ServicePlan) => {
    setSelectedService(service);
    setShowServiceDetailsModal(true);
  };

  const handleViewSong = (song: Song) => {
    setSelectedSong(song);
    setShowSongDetailsModal(true);
  };

  const handleViewTeamMember = (member: TeamMemberProfile) => {
    setSelectedTeamMember(member);
    setShowTeamMemberDetailsModal(true);
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceDetailsModal(true);
  };

  // Handlers for creating new items
  const handleCreateService = () => {
    setShowCreateServiceModal(true);
  };

  const handleAddSong = () => {
    setShowAddSongModal(true);
  };
  
  const handleSaveSong = (newSong: Omit<Song, 'id'>) => {
    // Create a new song with an ID
    const songWithId: Song = {
      ...newSong,
      id: songs.length > 0 ? Math.max(...songs.map(s => s.id)) + 1 : 1
    };
    
    // Add the new song to the songs array
    setSongs(prevSongs => [...prevSongs, songWithId]);
  };

  const handleAddTeamMember = () => {
    // Navigate to the team members add page
    router.push('/dashboard/worship/members/add');
  };

  const handleUploadResource = () => {
    // For now, just show the placeholder modal
    alert("Upload Resource functionality will be implemented in the future.");
  };
  
  // Handlers for rehearsals
  const handleViewRehearsal = (rehearsal: Rehearsal) => {
    setSelectedRehearsal(rehearsal);
    setShowRehearsalDetailsModal(true);
  };
  
  const handleCreateRehearsal = () => {
    setShowCreateRehearsalModal(true);
  };
  
  const handleSaveRehearsal = (rehearsalData: Omit<Rehearsal, 'id'> | Rehearsal) => {
    if ('id' in rehearsalData) {
      // Updating existing rehearsal
      setRehearsals(prevRehearsals => 
        prevRehearsals.map(r => r.id === rehearsalData.id ? rehearsalData as Rehearsal : r)
      );
    } else {
      // Adding new rehearsal
      const newRehearsal: Rehearsal = {
        ...rehearsalData,
        id: rehearsals.length > 0 ? Math.max(...rehearsals.map(r => r.id)) + 1 : 1
      };
      setRehearsals(prevRehearsals => [...prevRehearsals, newRehearsal]);
    }
  };
  
  const handleUpdateAttendance = (rehearsalId: number, attendance: RehearsalAttendee[]) => {
    setRehearsals(prevRehearsals => 
      prevRehearsals.map(r => {
        if (r.id === rehearsalId) {
          return { ...r, teamMembers: attendance };
        }
        return r;
      })
    );
  };
  
  const handleCompleteRehearsal = (rehearsalId: number, completed: boolean) => {
    setRehearsals(prevRehearsals => 
      prevRehearsals.map(r => {
        if (r.id === rehearsalId) {
          return { ...r, completed };
        }
        return r;
      })
    );
  };

  const handleManageSchedule = (serviceId: number) => {
    const service = mockServices.find(s => s.id === serviceId) || null;
    if (service) {
      setSelectedService({
        ...service,
        status: service.status as 'Draft' | 'Planning' | 'Confirmed' | 'Completed'
      });
    }
    setShowCreateServiceModal(true);
  };

  const handleSaveService = (newService: ServicePlan) => {
    // Mock implementation to handle saving a new service
    // In a real app, this would interact with an API
    alert(`Service "${newService.title}" has been saved.`);
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <WorshipHeader onCreateService={handleCreateService} />

        {/* Stats */}
        <WorshipStats 
          upcomingServices={upcomingServices}
          songsInLibrary={songsInLibrary}
          teamMembers={teamMembers}
          completedServices={completedServices}
        />
      <WorshipTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'services' && (
            <ServicesList 
              services={mockServices}
              onViewService={handleViewService}
            />
          )}

          {activeTab === 'songs' && (
            <>
              <SongLibrary
                songs={songs}
                onViewSong={handleViewSong}
                onAddSong={handleAddSong}
              />
              <SpotifyIntegration onAddSongToLibrary={handleSaveSong} />
            </>
          )}

          {activeTab === 'teams' && (
            <TeamScheduling 
              teamMembers={mockTeamMembers}
              schedules={mockSchedules}
              onViewTeamMember={handleViewTeamMember}
              onAddTeamMember={handleAddTeamMember}
              onManageSchedule={handleManageSchedule}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceLibrary 
              resources={mockResources}
              onViewResource={handleViewResource}
              onUploadResource={handleUploadResource}
            />
          )}
          
          {activeTab === 'rehearsals' && (
            <RehearsalTracker
              teamMembers={mockTeamMembers}
              services={mockServices}
              onViewRehearsal={handleViewRehearsal}
              onCreateRehearsal={handleCreateRehearsal}
            />
          )}
        </div>

        {/* Modals for viewing and creating items */}
        
        {/* Service Details Modal */}
        {showServiceDetailsModal && selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            isOpen={showServiceDetailsModal}
            onClose={() => setShowServiceDetailsModal(false)}
          />
        )}
        
        {/* Song Details Modal */}
        {selectedSong && (
          <SongDetailsModal
            song={selectedSong}
            isOpen={showSongDetailsModal}
            onClose={() => setShowSongDetailsModal(false)}
          />
        )}
        
        {/* Add Song Modal */}
        <AddSongModal
          isOpen={showAddSongModal}
          onClose={() => setShowAddSongModal(false)}
          onAddSong={handleSaveSong}
        />
        
        {/* Team Member Details Modal */}
        {showTeamMemberDetailsModal && selectedTeamMember && (
          <TeamMemberDetailsModal
            teamMember={selectedTeamMember}
            isOpen={showTeamMemberDetailsModal}
            onClose={() => setShowTeamMemberDetailsModal(false)}
          />
        )}
        
        {/* Resource Details Modal */}
        {showResourceDetailsModal && selectedResource && (
          <ResourceDetailsModal
            resource={selectedResource}
            isOpen={showResourceDetailsModal}
            onClose={() => setShowResourceDetailsModal(false)}
          />
        )}
        
        {/* Rehearsal Details Modal */}
        {showRehearsalDetailsModal && selectedRehearsal && (
          <RehearsalDetailsModal
            rehearsal={selectedRehearsal}
            teamMembers={mockTeamMembers}
            services={mockServices}
            isOpen={showRehearsalDetailsModal}
            onClose={() => setShowRehearsalDetailsModal(false)}
            onUpdateAttendance={handleUpdateAttendance}
            onComplete={handleCompleteRehearsal}
            onEdit={(rehearsal) => {
              setSelectedRehearsal(rehearsal);
              setShowRehearsalDetailsModal(false);
              setShowCreateRehearsalModal(true);
            }}
          />
        )}
        
        {/* Create Rehearsal Modal */}
        <CreateRehearsalModal
          isOpen={showCreateRehearsalModal}
          onClose={() => {
            setShowCreateRehearsalModal(false);
            setSelectedRehearsal(null);
          }}
          onSave={handleSaveRehearsal}
          teamMembers={mockTeamMembers}
          services={mockServices}
          editRehearsal={selectedRehearsal}
        />
        
        {/* Create Service Modal */}
        <CreateServiceModal
          isOpen={showCreateServiceModal}
          onClose={() => setShowCreateServiceModal(false)}
          onSave={handleSaveService}
        />
      </div>
    </div>
  );
}
