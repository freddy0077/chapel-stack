// Card Scanning Station Component
"use client";

import React, { useState, useEffect } from 'react';
import { AttendanceEvent } from '../types';
import { useAttendanceSessionsByBranch } from '../../../../graphql/hooks/useAttendance';
import { useProcessCardScan, getCurrentBranchFromAuthUser } from '../../../../graphql/hooks/useAttendance';
import { useAuth } from '../../../../graphql/hooks/useAuth';

interface CardScanningStationProps {
  deviceId: string;
  onAttendanceRecorded?: (record: AttendanceRecord) => void;
}

// Simulate card scanning with this component
export default function CardScanningStation({ deviceId, onAttendanceRecorded }: CardScanningStationProps) {
  // Auth and branch context
  const { user } = useAuth();
  const branch = getCurrentBranchFromAuthUser(user ?? undefined);
  const branchId = branch?.id ?? '';

  // Attendance event sessions for branch
  const { sessions: events } = useAttendanceSessionsByBranch(branchId);

  // State for event selection, scan status, message, card number
  const [selectedEvent, setSelectedEvent] = useState<AttendanceEvent | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');

  // Card scan mutation
  const { processCardScan } = useProcessCardScan();

  // Auto-select first event when available
  useEffect(() => {
    if (events && events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
    // Only run when events change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Event selection handler
  const handleEventSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const eventId = evt.target.value;
    const event = events.find((e: AttendanceEvent) => e.id === eventId) || null;
    setSelectedEvent(event);
  };

  // Scan card handler
  const handleScanCard = async () => {
    if (!selectedEvent) {
      setMessage('Please select an event/session first');
      return;
    }
    if (!cardNumber) {
      setMessage('Please enter a card number to scan');
      return;
    }
    setScanStatus('scanning');
    setMessage('Scanning card...');
    try {
      const response = await processCardScan({
        sessionId: selectedEvent.id,
        cardId: cardNumber,
        branchId: branchId,
      });
      if (response.data) {
        setMessage('Attendance recorded successfully!');
        setScanStatus('success');
        if (onAttendanceRecorded) onAttendanceRecorded(response.data);
      } else if (response.errors && response.errors.length > 0) {
        setMessage(response.errors[0].message || 'Scan failed. Please try again.');
        setScanStatus('error');
      } else {
        setMessage('No data returned from scan.');
        setScanStatus('error');
      }
    } catch (error: any) {
      setMessage(error?.message || 'Scan failed. Please try again.');
      setScanStatus('error');
    }
    setTimeout(() => {
      setScanStatus('idle');
      setCardNumber('');
      setMessage('Ready to scan next card');
    }, 3000);
  };

  // UI rendering
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Card Scanning Station</h2>

      {/* Event Selection */}
      <div className="mb-4">
        <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Attendance Event/Session
        </label>
        <select
          id="event-select"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedEvent?.id || ''}
          onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => handleEventSelect(evt)}
        >
          <option value="" disabled>
            -- Select Event/Session --
          </option>
          {events && events.map((event: AttendanceEvent) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Card Number Input */}
      <div className="mb-4">
        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <input
          id="card-number"
          type="text"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={cardNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value)}
          placeholder="Enter card number..."
          disabled={scanStatus === 'scanning'}
        />
      </div>

      {/* Scan Button */}
      <div className="mb-6">
        <button
          className={`w-full px-4 py-2 rounded-md text-white font-semibold ${scanStatus === 'scanning' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          onClick={handleScanCard}
          disabled={scanStatus === 'scanning' || !selectedEvent || !cardNumber}
        >
          {scanStatus === 'scanning' ? 'Scanning...' : 'Scan Card'}
        </button>
      </div>

      {/* Scan Result - Success */}
      {scanStatus === 'success' && (
        <div className="mb-6 p-6 border border-green-300 bg-green-50 rounded-lg">
          <p className="text-green-600 font-medium text-center mb-4">{message}</p>
        </div>
      )}

      {/* Scan Result - Error */}
      {scanStatus === 'error' && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium text-center">{message}</p>
        </div>
      )}

      {/* Idle Message */}
      {scanStatus === 'idle' && message && (
        <div className="mb-4 text-center text-gray-500 text-sm">{message}</div>
      )}
      {/* Station Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Station Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Device ID:</span> 
            <span className="ml-1 text-gray-800">{deviceId}</span>
          </div>
          <div>
            <span className="text-gray-500">Branch:</span> 
            <span className="ml-1 text-gray-800">{branchId}</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span> 
            <span className="ml-1 text-gray-800">
              {scanStatus === 'idle' ? 'Ready' : 
               scanStatus === 'scanning' ? 'Processing' : 
               scanStatus === 'success' ? 'Completed' : 'Error'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Current Event:</span> 
            <span className="ml-1 text-gray-800">{selectedEvent?.name || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS file for the animation */}
      <style jsx global>{`
        @keyframes progress {
          0% { width: 5%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s linear;
        }
      `}</style>
    </div>
  );
}
