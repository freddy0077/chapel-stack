"use client";

import React from 'react';
import { useSermons } from '@/graphql/hooks/useSermon';
import { usePermissions } from '@/hooks/usePermissions';
import { SparklesIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SermonsPage() {
  const { data: sermons = [], loading, error } = useSermons();
  const [search, setSearch] = React.useState('');
  const { isSuperAdmin, isBranchAdmin } = usePermissions();

  // Filter sermons by search
  const filtered = sermons.filter((s: unknown) =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.speaker?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-800 flex items-center gap-3">
          <SparklesIcon className="h-9 w-9 text-yellow-400 animate-pulse" />
          Sermons
        </h1>
        {(isSuperAdmin || isBranchAdmin) && (
          <button
            className="bg-gradient-to-br from-indigo-600 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-indigo-700 transition-transform duration-200 flex items-center gap-2"
          >
            <PlusIcon className="h-6 w-6" />
            Add Sermon
          </button>
        )}
      </div>
      <div className="mb-8 flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-indigo-300" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-indigo-100 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none bg-white/70 shadow"
            placeholder="Search by title or speaker..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading && <div className="text-center text-gray-400 py-10">Loading sermons...</div>}
      {error && <div className="text-center text-red-500 py-10">Failed to load sermons.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((sermon: unknown) => (
          <div
            key={sermon.id}
            className="rounded-3xl bg-white/80 backdrop-blur-md shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-200 flex flex-col overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(236,233,254,0.7) 100%)' }}
          >
            <div className="flex-1 p-6 flex flex-col gap-2">
              <span className="inline-block bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">
                {sermon.series?.title || 'General'}
              </span>
              <h2 className="text-2xl font-bold text-indigo-900 mb-1 truncate" title={sermon.title}>{sermon.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                <span className="font-semibold text-indigo-700">{sermon.speaker?.name || 'Unknown Speaker'}</span>
                <span className="mx-2">•</span>
                <span>{sermon.date ? new Date(sermon.date).toLocaleDateString() : 'No Date'}</span>
              </div>
              <p className="text-gray-700 line-clamp-3 mb-1">{sermon.summary || sermon.description || 'No description.'}</p>
            </div>
            <div className="px-6 pb-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                {sermon.duration ? `${sermon.duration} min` : 'No Duration'}
              </span>
              {sermon.tags?.map((tag: string) => (
                <span key={tag} className="inline-block bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-400 py-12">No sermons found.</div>
        )}
      </div>
      {/* Sermon creation modal would go here in a full implementation */}
    </div>
  );
}
