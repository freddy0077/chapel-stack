"use client"

import * as React from "react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Calendar icon SVG instead of lucide-react
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
  id?: string;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({ 
  date, 
  setDate,
  onDateChange, 
  className, 
  id,
  placeholderText = "Pick a date",
  minDate,
  maxDate
}: DatePickerProps) {
  // Use internal state to ensure the component works even without external state management
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  
  // Keep internal state in sync with external props
  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateSelect = React.useCallback((selected: Date | undefined) => {
    setSelectedDate(selected);
    
    // Propagate changes to parent components
    if (setDate) {
      setDate(selected);
    }
    
    if (onDateChange) {
      onDateChange(selected);
    }
  }, [setDate, onDateChange]);

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-gray-300",
              !selectedDate && "text-gray-500",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholderText}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white shadow-xl border border-gray-200 rounded-lg" 
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            disabled={minDate ? { before: minDate } : maxDate ? { after: maxDate } : undefined}
            className="rounded-lg"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
