import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApply: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}) => {
  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Label htmlFor="start-date" className="mb-2 block">
            Start Date
          </Label>
          <DatePicker
            id="start-date"
            date={startDate}
            onDateChange={onStartDateChange}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="end-date" className="mb-2 block">
            End Date
          </Label>
          <DatePicker
            id="end-date"
            date={endDate}
            onDateChange={onEndDateChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickSelect(7)}
        >
          Last 7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickSelect(30)}
        >
          Last 30 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickSelect(90)}
        >
          Last 3 Months
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickSelect(365)}
        >
          Last Year
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={onApply} className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Apply Date Range
        </Button>
      </div>
    </div>
  );
};
