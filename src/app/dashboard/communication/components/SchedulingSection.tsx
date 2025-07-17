import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';

interface SchedulingSectionProps {
  isScheduled: boolean;
  setIsScheduled: (scheduled: boolean) => void;
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
}

export default function SchedulingSection({
  isScheduled,
  setIsScheduled,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime
}: SchedulingSectionProps) {
  return (
    <Card className="p-8 rounded-3xl shadow-2xl bg-white/90 border-0 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Scheduling</h3>
      
      <div className="flex items-center space-x-3">
        <Switch
          id="schedule-toggle"
          checked={isScheduled}
          onCheckedChange={setIsScheduled}
        />
        <label htmlFor="schedule-toggle" className="font-semibold text-gray-700">
          Schedule for later
        </label>
      </div>

      {isScheduled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-700 block mb-2">Date</label>
            <DatePicker
              date={scheduledDate}
              setDate={setScheduledDate}
              placeholder="Select date"
              className="w-full"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 block mb-2">Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-violet-400 focus:border-violet-400"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
