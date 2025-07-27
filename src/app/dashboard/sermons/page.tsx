"use client";

import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  PlusIcon,
  PlayIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  DocumentIcon,
  HeartIcon,
  BookmarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  BookOpenIcon,
  XMarkIcon,
  MicrophoneIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as SolidHeartIcon, BookmarkIcon as SolidBookmarkIcon, PlayIcon as SolidPlayIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { usePermissions } from '@/hooks/usePermissions';
import { useOrganizationBranchFilter } from '@/hooks/useOrganizationBranchFilter';
import { useSermons, useGetSpeakers, useGetSeries, useCategories, useCreateSermon, useUpdateSermon, useDeleteSermon, SermonEntity } from '@/graphql/hooks/useSermon';
import { SermonFormModal } from './components/SermonFormModal';
import { SermonDetailsModal } from './components/SermonDetailsModal';
import { SpeakerManagerModal } from './components/SpeakerManagerModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { SeriesManagerModal } from './components/SeriesManagerModal';

// Utility function for formatting dates
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Utility function for formatting duration
function formatDuration(minutes: number) {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

// Modern Sermon Card Component
function ModernSermonCard({ 
  sermon, 
  onViewDetails, 
  onEdit, 
  onDelete,
  viewMode = 'grid'
}: { 
  sermon: any; 
  onViewDetails: (sermon: any) => void; 
  onEdit: (sermon: any) => void;
  onDelete: (sermon: any) => void;
  viewMode?: 'grid' | 'list';
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (viewMode === 'list') {
    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          {/* Thumbnail */}
          <div className="relative w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {sermon.thumbnailUrl ? (
              <img src={sermon.thumbnailUrl} alt={sermon.title} className="w-full h-full object-cover" />
            ) : (
              <BookOpenIcon className="w-8 h-8 text-white" />
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                 onClick={() => onViewDetails(sermon)}>
              <SolidPlayIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-4 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => onViewDetails(sermon)}>
                {sermon.title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="p-1 h-8 w-8"
                >
                  {isFavorited ? (
                    <SolidHeartIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-1 h-8 w-8"
                >
                  {isBookmarked ? (
                    <SolidBookmarkIcon className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <UserIcon className="w-4 h-4" />
                <span>{sermon.speaker?.name || 'Unknown Speaker'}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{formatDate(sermon.datePreached)}</span>
              </div>
              {sermon.duration && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{formatDuration(sermon.duration)}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {sermon.description || 'No description available.'}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {sermon.category && (
                  <Badge variant="secondary" className="text-xs">
                    {sermon.category.name || sermon.category}
                  </Badge>
                )}
                {sermon.tags?.slice(0, 2).map((tag: any, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag.name || tag}
                  </Badge>
                ))}
                {sermon.tags?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{sermon.tags.length - 2}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {sermon.audioUrl && (
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(sermon)}>
                    <SpeakerWaveIcon className="w-4 h-4 mr-1" />
                    Audio
                  </Button>
                )}
                {sermon.videoUrl && (
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(sermon)}>
                    <VideoCameraIcon className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => onEdit(sermon)}>
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="default" size="sm" onClick={() => onViewDetails(sermon)}>
                  <SolidPlayIcon className="w-4 h-4 mr-1" />
                  Play
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {sermon.thumbnailUrl ? (
          <img src={sermon.thumbnailUrl} alt={sermon.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpenIcon className="w-12 h-12 text-white/80" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            onClick={() => onViewDetails(sermon)}
            className="bg-white/90 hover:bg-white text-gray-900 rounded-full w-16 h-16 p-0"
          >
            <SolidPlayIcon className="w-6 h-6 ml-1" />
          </Button>
        </div>

        {/* Duration badge */}
        {sermon.duration && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {formatDuration(sermon.duration)}
          </div>
        )}

        {/* Favorite and bookmark buttons */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-black/20 hover:bg-black/40 text-white p-1 h-8 w-8 rounded-full"
          >
            {isFavorited ? (
              <SolidHeartIcon className="w-4 h-4 text-red-400" />
            ) : (
              <HeartIcon className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="bg-black/20 hover:bg-black/40 text-white p-1 h-8 w-8 rounded-full"
          >
            {isBookmarked ? (
              <SolidBookmarkIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onViewDetails(sermon)}>
            {sermon.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MicrophoneIcon className="w-4 h-4" />
            <span className="truncate">{sermon.speaker?.name || 'Unknown Speaker'}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>{formatDate(sermon.datePreached)}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {sermon.description || 'No description available.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {sermon.category && (
            <Badge variant="secondary" className="text-xs">
              {sermon.category.name || sermon.category}
            </Badge>
          )}
          {sermon.tags?.slice(0, 2).map((tag: any, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag.name || tag}
            </Badge>
          ))}
          {sermon.tags?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{sermon.tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {sermon.audioUrl && (
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(sermon)} className="p-2">
                <SpeakerWaveIcon className="w-4 h-4" />
              </Button>
            )}
            {sermon.videoUrl && (
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(sermon)} className="p-2">
                <VideoCameraIcon className="w-4 h-4" />
              </Button>
            )}
            {sermon.notesUrl && (
              <Button variant="ghost" size="sm" className="p-2">
                <DocumentIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(sermon)}>
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onViewDetails(sermon)}>
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Main Sermons Page Component
export default function SermonsPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [sortBy, setSortBy] = useState('datePreached');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSermonForm, setShowSermonForm] = useState(false);
  const [showSermonDetails, setShowSermonDetails] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<SermonEntity | null>(null);
  const [editingSermon, setEditingSermon] = useState<SermonEntity | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Explicit mode tracking
  const [isSpeakerManagerOpen, setIsSpeakerManagerOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isSeriesManagerOpen, setIsSeriesManagerOpen] = useState(false);

  // Hooks
  const { state } = useAuth();
  const user = state.user;
  const { canCreate, canEdit, canDelete } = usePermissions();
  const { organizationId, branchId } = useOrganizationBranchFilter();

  // GraphQL hooks
  const { data: sermonsData, loading: sermonsLoading, error: sermonsError, refetch: refetchSermons } = useSermons();
  const { data: speakersData, loading: speakersLoading } = useGetSpeakers();
  const { data: seriesData, loading: seriesLoading } = useGetSeries();
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
  const [createSermon, { loading: createLoading }] = useCreateSermon();
  const [updateSermon, { loading: updateLoading }] = useUpdateSermon();
  const [deleteSermon, { loading: deleteLoading }] = useDeleteSermon();

  const mutationLoading = createLoading || updateLoading || deleteLoading;

  const sermons = sermonsData?.sermons || [];
  const speakers = speakersData?.speakers || [];
  const series = seriesData?.series || [];
  const categories = categoriesData?.categories || [];

  // Data processing
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sermons.forEach((sermon: any) => {
      if (sermon.tags && Array.isArray(sermon.tags)) {
        sermon.tags.forEach((tag: any) => {
          if (typeof tag === 'string') {
            tags.add(tag);
          } else if (tag && tag.name) {
            tags.add(tag.name);
          }
        });
      }
    });
    return Array.from(tags).sort();
  }, [sermons]);

  // Filter and sort sermons
  const filteredSermons = useMemo(() => {
    let filtered = sermons.filter((sermon: any) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = sermon.title?.toLowerCase().includes(searchLower);
        const matchesSpeaker = sermon.speaker?.name?.toLowerCase().includes(searchLower);
        const matchesDescription = sermon.description?.toLowerCase().includes(searchLower);
        const matchesTags = sermon.tags?.some((tag: any) => {
          const tagName = typeof tag === 'string' ? tag : tag?.name || '';
          return tagName.toLowerCase().includes(searchLower);
        });
        
        if (!matchesTitle && !matchesSpeaker && !matchesDescription && !matchesTags) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && sermon.category?.id !== selectedCategory) {
        return false;
      }

      // Speaker filter
      if (selectedSpeaker && sermon.speaker?.id !== selectedSpeaker) {
        return false;
      }

      // Series filter
      if (selectedSeries && sermon.series?.id !== selectedSeries) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const sermonTags = sermon.tags?.map((tag: any) => 
          typeof tag === 'string' ? tag : tag?.name || ''
        ) || [];
        const hasSelectedTag = selectedTags.some(tag => sermonTags.includes(tag));
        if (!hasSelectedTag) {
          return false;
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const sermonDate = new Date(sermon.datePreached);
        if (dateRange.from && sermonDate < dateRange.from) {
          return false;
        }
        if (dateRange.to && sermonDate > dateRange.to) {
          return false;
        }
      }

      return true;
    });

    // Sort sermons
    filtered.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'speaker':
          aValue = a.speaker?.name || '';
          bValue = b.speaker?.name || '';
          break;
        case 'datePreached':
        default:
          aValue = new Date(a.datePreached);
          bValue = new Date(b.datePreached);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [sermons, searchTerm, selectedCategory, selectedSpeaker, selectedSeries, selectedTags, dateRange, sortBy, sortOrder]);

  // Event handlers
  const handleOpenFormModal = (sermon?: SermonEntity) => {
    if (sermon && sermon.id) {
      // Edit mode - editing an existing sermon
      setEditingSermon(sermon);
      setIsEditMode(true);
    } else {
      // Create mode - creating a new sermon
      setEditingSermon(null);
      setIsEditMode(false);
    }
    setShowSermonForm(true);
  };

  const handleCloseFormModal = () => {
    setShowSermonForm(false);
    setEditingSermon(null);
    setIsEditMode(false);
  };

  const handleViewSermon = (sermon: SermonEntity) => {
    setSelectedSermon(sermon);
    setShowSermonDetails(true);
  };

  const handleCloseSermonDetails = () => {
    setShowSermonDetails(false);
    setSelectedSermon(null);
  };

  const handleSubmitSermon = async (data: any) => {
    
    try {
      const submissionData = {
        ...data,
        branchId: user?.userBranches?.[0]?.branch?.id,
        organisationId: user?.userBranches?.[0]?.branch?.organisation?.id,
      };
      
      
      if (isEditMode) {
        await updateSermon({ variables: { updateSermonInput: submissionData } });
      } else {
        await createSermon({ variables: { createSermonInput: submissionData } });
      }
      await refetchSermons();
      setShowSermonForm(false);
      setEditingSermon(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving sermon:', error);
      alert('Failed to save sermon. Please try again.');
    }
  };

  const handleDeleteSermon = async (sermon: SermonEntity) => {
    if (window.confirm(`Are you sure you want to delete "${sermon.title}"?`)) {
      try {
        await deleteSermon({ variables: { id: sermon.id } });
        await refetchSermons();
        setShowSermonDetails(false);
      } catch (error) {
        console.error('Error deleting sermon:', error);
        alert('Failed to delete sermon. Please try again.');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSpeaker('');
    setSelectedSeries('');
    setSelectedTags([]);
    setDateRange({});
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedSpeaker || selectedSeries || selectedTags.length > 0 || dateRange.from || dateRange.to;

  if (sermonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Sermon Library
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover inspiring messages, grow in faith, and share God's word with our comprehensive sermon collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="w-6 h-6" />
                  <span className="font-semibold">{sermons.length}</span>
                  <span>Sermons</span>
                </div>
                <div className="flex items-center gap-2">
                  <MicrophoneIcon className="w-6 h-6" />
                  <span className="font-semibold">{speakers.length}</span>
                  <span>Speakers</span>
                </div>
                <div className="flex items-center gap-2">
                  <TagIcon className="w-6 h-6" />
                  <span className="font-semibold">{categories.length}</span>
                  <span>Categories</span>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1 max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons, speakers, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3 py-2"
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3 py-2"
                >
                  <ListBulletIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant={showFilters ? 'default' : 'outline'}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <FunnelIcon className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {[searchTerm, selectedCategory, selectedSpeaker, selectedSeries, ...selectedTags, dateRange.from, dateRange.to].filter(Boolean).length}
                  </Badge>
                )}
              </Button>

              {/* Add Sermon Button */}
              <Button 
                onClick={handleOpenFormModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Sermon
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Speaker Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <select
                    value={selectedSpeaker}
                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">All Speakers</option>
                    {speakers.map((speaker: any) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="datePreached">Date Preached</option>
                    <option value="title">Title</option>
                    <option value="speaker">Speaker</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag: string) => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter(t => t !== tag));
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        className="text-xs"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end">
                  <Button onClick={clearFilters} variant="ghost" className="text-sm">
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredSermons.length} {filteredSermons.length === 1 ? 'Sermon' : 'Sermons'}
            </h2>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-sm">
                Filtered Results
              </Badge>
            )}
          </div>

          {/* Management Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSpeakerManagerOpen(true)}
              className="flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Manage Speakers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCategoryManagerOpen(true)}
              className="flex items-center gap-2"
            >
              <TagIcon className="w-4 h-4" />
              Manage Categories
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSeriesManagerOpen(true)}
              className="flex items-center gap-2"
            >
              <BookOpenIcon className="w-4 h-4" />
              Manage Series
            </Button>
          </div>
        </div>

        {/* Sermons Grid/List */}
        {filteredSermons.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredSermons.map((sermon: any) => (
              <ModernSermonCard
                key={sermon.id}
                sermon={sermon}
                onViewDetails={handleViewSermon}
                onEdit={handleOpenFormModal}
                onDelete={handleDeleteSermon}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {hasActiveFilters ? 'No sermons match your filters' : 'No sermons found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'Get started by adding your first sermon to the library.'
              }
            </p>
            {hasActiveFilters ? (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : canCreate ? (
              <Button onClick={() => handleOpenFormModal()}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add First Sermon
              </Button>
            ) : null}
          </div>
        )}
      </div>

      {/* Modals */}
      <SermonFormModal
        open={showSermonForm}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitSermon}
        initialData={editingSermon}
        categories={categories}
        speakers={speakers}
        series={series}
        isSaving={mutationLoading}
        isEditMode={isEditMode}
        user={user}
      />

      <SermonDetailsModal
        open={showSermonDetails}
        onClose={handleCloseSermonDetails}
        sermon={selectedSermon}
        onEdit={handleOpenFormModal}
        onDelete={handleDeleteSermon}
      />

      <SpeakerManagerModal
        open={isSpeakerManagerOpen}
        onClose={() => setIsSpeakerManagerOpen(false)}
      />

      <CategoryManagerModal
        open={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      <SeriesManagerModal
        open={isSeriesManagerOpen}
        onClose={() => setIsSeriesManagerOpen(false)}
      />
    </div>
  );
}
