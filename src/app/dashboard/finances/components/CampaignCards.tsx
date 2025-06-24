"use client";

import { 
  GiftIcon, 
  ArchiveBoxIcon, 
  CurrencyDollarIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { ProgressBar } from "@tremor/react";
import Image from "next/image";

interface Campaign {
  id: number;
  name: string;
  goal: string;
  raised: string;
  progress: number;
  category?: string;
  endDate?: string;
  image?: string;
}

interface CampaignCardsProps {
  campaigns: Campaign[];
}

const CampaignCards = ({ campaigns }: CampaignCardsProps) => {
  // Function to determine color based on progress
  const getColorByProgress = (progress: number): { bg: string; text: string } => {
    if (progress < 35) return { bg: "bg-indigo-100/70", text: "text-indigo-800" };
    if (progress < 70) return { bg: "bg-emerald-100/70", text: "text-emerald-800" };
    return { bg: "bg-amber-100/70", text: "text-amber-800" };
  };
  
  return (
    <div className="bg-gradient-to-br from-white/70 via-indigo-50/60 to-white/90 rounded-3xl shadow-xl overflow-hidden border border-indigo-100 backdrop-blur-xl">
      <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-white/80 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
          <GiftIcon className="h-6 w-6 text-indigo-400" /> Active Campaigns
        </h2>
        <button
          type="button"
          className="inline-flex items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Campaign
        </button>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="relative bg-white/80 rounded-2xl p-6 border border-indigo-100 hover:shadow-xl transition-shadow duration-200 flex flex-col overflow-hidden group backdrop-blur-xl"
          >
            {/* Decorative gradient ring */}
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-gradient-to-br from-indigo-200/30 via-purple-100/20 to-white/0 rounded-full blur-2xl z-0" />
            <div className="flex items-start justify-between mb-3 z-10 relative">
              <div className={`p-3 rounded-xl ${getColorByProgress(campaign.progress).bg} ${getColorByProgress(campaign.progress).text} shadow-md`}> 
                <GiftIcon className="h-6 w-6" />
              </div>
              <span className="ml-3 text-base font-bold text-indigo-900 truncate max-w-[10rem]">{campaign.name}</span>
            </div>
            
            {campaign.image && (
              <div className="mb-4 h-32 w-full rounded-xl overflow-hidden relative shadow-lg">
                <Image
                  src={campaign.image}
                  alt={campaign.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="space-y-1 flex-grow">
              {campaign.category && (
                <div className="flex items-center text-xs text-indigo-500 font-semibold">
                  <ArchiveBoxIcon className="mr-1 h-4 w-4" />
                  {campaign.category}
                </div>
              )}
              
              {campaign.endDate && (
                <div className="text-xs text-indigo-400 font-medium">
                  Ends on {campaign.endDate}
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-600">
                  {campaign.raised} raised
                </span>
                <span className="text-xs font-semibold text-indigo-700">
                  {campaign.goal} goal
                </span>
              </div>
              <ProgressBar 
                value={campaign.progress} 
                color={(() => {
                  if (campaign.progress < 35) return "indigo";
                  if (campaign.progress < 70) return "emerald";
                  return "amber";
                })()}
                className="mt-2 h-3 rounded-full bg-indigo-50"
              />
              <p className="mt-1 text-xs text-center font-semibold text-indigo-700">
                {campaign.progress}% Complete
              </p>
            </div>
            
            <button className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-600 transition">
              <CurrencyDollarIcon className="mr-2 h-4 w-4 text-white/80" />
              View Campaign
            </button>
          </div>
        ))}
        
        {/* Add Campaign Card */}
        <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 transition-colors duration-200 cursor-pointer bg-white/70 shadow-md">
          <div className="p-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-3">
            <PlusIcon className="h-7 w-7 text-indigo-600" />
          </div>
          <h3 className="text-base font-bold text-indigo-900 mb-1">Create New Campaign</h3>
          <p className="text-sm text-indigo-500">Set up a new fundraising campaign for your church</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignCards;
