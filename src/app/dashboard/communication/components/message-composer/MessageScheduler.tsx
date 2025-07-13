"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageSchedulerProps {
  isScheduled: boolean;
  scheduledDate: Date | null;
  onIsScheduledChange: (isScheduled: boolean) => void;
  onScheduledDateChange: (date: Date | null) => void;
}

export default function MessageScheduler({ 
  isScheduled, 
  scheduledDate, 
  onIsScheduledChange, 
  onScheduledDateChange 
}: MessageSchedulerProps) {
  const [time, setTime] = useState("12:00");
  const [date, setDate] = useState<Date | undefined>(scheduledDate || undefined);
  
  // Initialize time from scheduledDate if available
  useEffect(() => {
    if (scheduledDate) {
      setTime(format(scheduledDate, "HH:mm"));
      setDate(scheduledDate);
    }
  }, [scheduledDate]);
  
  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    
    if (newDate) {
      // Combine date with time
      const [hours, minutes] = time.split(":").map(Number);
      const combinedDate = new Date(newDate);
      combinedDate.setHours(hours || 0, minutes || 0, 0, 0);
      onScheduledDateChange(combinedDate);
    } else {
      onScheduledDateChange(null);
    }
  };
  
  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    
    if (date) {
      // Combine date with new time
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const combinedDate = new Date(date);
      combinedDate.setHours(hours || 0, minutes || 0, 0, 0);
      onScheduledDateChange(combinedDate);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Switch 
            id="schedule-toggle" 
            checked={isScheduled} 
            onCheckedChange={onIsScheduledChange}
            className="data-[state=checked]:bg-gradient-to-r from-amber-500 to-amber-600"
          />
          <Label htmlFor="schedule-toggle" className="font-medium cursor-pointer">
            Schedule for later
          </Label>
        </div>
        {isScheduled && scheduledDate && (
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            {format(scheduledDate, "MMM d, h:mm a")}
          </span>
        )}
      </div>
      
      {isScheduled && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div>
              <Label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border border-gray-200 hover:bg-gray-50 hover:border-amber-200 transition-colors duration-200"
                    id="date"
                  >
                    <div className="rounded-full bg-amber-100 text-amber-600 p-1 mr-2">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-0 shadow-lg">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Time Picker */}
            <div>
              <Label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-700">Time</Label>
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 text-amber-600 p-1 mr-2">
                  <ClockIcon className="h-4 w-4" />
                </div>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="flex-1 border-gray-200 focus:border-amber-300 focus:ring focus:ring-amber-100 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
          
          {/* Preview */}
          {scheduledDate && (
            <div className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-100 flex items-center">
              <ClockIcon className="h-4 w-4 text-amber-500 mr-2" />
              Message will be sent on {format(scheduledDate, "EEEE, MMMM d, yyyy")} at {format(scheduledDate, "h:mm a")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
