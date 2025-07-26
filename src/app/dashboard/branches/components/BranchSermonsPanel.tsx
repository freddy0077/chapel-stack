"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SERMONS, GET_SPEAKERS, GET_SERIES } from '@/graphql/queries/sermonQueries';
import { useSermonMutations, useSpeakerMutations, useSeriesMutations } from '@/graphql/hooks/useSermon';
import { PlusIcon, PlayIcon, DocumentTextIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface BranchSermonsPanelProps {
  branchId: string;
}

interface Sermon {
  id: string;
  title: string;
  description?: string;
  datePreached?: string;
  mainScripture?: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
  status: string;
  speaker?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  series?: {
    id: string;
    title: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

const BranchSermonsPanel: React.FC<BranchSermonsPanelProps> = ({ branchId }) => {
  const [activeTab, setActiveTab] = useState<'sermons' | 'speakers' | 'series'>('sermons');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Queries
  const { data: sermonsData, loading: sermonsLoading, error: sermonsError } = useQuery(GET_SERMONS, {
    variables: { branchId },
    errorPolicy: 'all'
  });

  const { data: speakersData, loading: speakersLoading } = useQuery(GET_SPEAKERS, {
    variables: { branchId },
    errorPolicy: 'all'
  });

  const { data: seriesData, loading: seriesLoading } = useQuery(GET_SERIES, {
    variables: { branchId },
    errorPolicy: 'all'
  });

  // Mutations
  const { createSermon } = useSermonMutations();
  const { createSpeaker } = useSpeakerMutations();
  const { createSeries } = useSeriesMutations();

  const sermons: Sermon[] = sermonsData?.sermons || [];
  const speakers = speakersData?.speakers || [];
  const series = seriesData?.series || [];

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (sermonsLoading || speakersLoading || seriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sermons</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage sermons, speakers, and series for this branch</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Sermon
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'sermons', label: 'Sermons', count: sermons.length },
            { key: 'speakers', label: 'Speakers', count: speakers.length },
            { key: 'series', label: 'Series', count: series.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'sermons' && (
        <div className="space-y-4">
          {sermons.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sermons yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start building your sermon library by adding your first sermon.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Sermon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {sermon.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sermon.status)}`}>
                          {sermon.status}
                        </span>
                      </div>
                      
                      {sermon.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {sermon.description}
                        </p>
                      )}

                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        {sermon.speaker && (
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{sermon.speaker.name}</span>
                          </div>
                        )}
                        
                        {sermon.datePreached && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{format(new Date(sermon.datePreached), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        
                        {sermon.duration && (
                          <div className="flex items-center gap-1">
                            <PlayIcon className="h-4 w-4" />
                            <span>{formatDuration(sermon.duration)}</span>
                          </div>
                        )}
                      </div>

                      {sermon.mainScripture && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {sermon.mainScripture}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {sermon.audioUrl && (
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                      {sermon.videoUrl && (
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'speakers' && (
        <div className="space-y-4">
          {speakers.length === 0 ? (
            <div className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No speakers yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Add speakers to organize your sermon library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {speakers.map((speaker: any) => (
                <div
                  key={speaker.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center"
                >
                  {speaker.imageUrl ? (
                    <img
                      src={speaker.imageUrl}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{speaker.name}</h3>
                  {speaker.title && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{speaker.title}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'series' && (
        <div className="space-y-4">
          {series.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No series yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Create sermon series to organize related messages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {series.map((seriesItem: any) => (
                <div
                  key={seriesItem.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {seriesItem.title}
                  </h3>
                  {seriesItem.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {seriesItem.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      seriesItem.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {seriesItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {seriesItem.startDate && (
                      <span>Started {format(new Date(seriesItem.startDate), 'MMM yyyy')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchSermonsPanel;
