import React, { useState } from "react";

interface EventAttendeesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { eventName: string; eventId?: string }) => void;
}

const EventAttendeesModal: React.FC<EventAttendeesModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [eventName, setEventName] = useState("");

  const handleSave = () => {
    if (!eventName) return;
    onSave({ eventName });
    setEventName("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="text-lg font-semibold mb-2">Select Event Attendees</div>
        <div className="mb-2 text-sm text-gray-700">
          Enter or select the event name:
        </div>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Event name (e.g. Easter Service)"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!eventName}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventAttendeesModal;
