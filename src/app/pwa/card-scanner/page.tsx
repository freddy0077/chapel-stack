"use client";

import { Suspense } from "react";
import CardScannerApp from "./page";

export default function CardScannerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardScannerApp />
    </Suspense>
  );
}

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ScannerInterface from "@/app/pwa/card-scanner/components/ScannerInterface";
import EventSelector from "@/app/pwa/card-scanner/components/EventSelector";
import MemberInfo from "@/app/pwa/card-scanner/components/MemberInfo";
import OfflineIndicator from "@/app/pwa/card-scanner/components/OfflineIndicator";
import { 
  ArrowLeftIcon, 
  QrCodeIcon, 
  WifiIcon,
  CreditCardIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import { AttendanceEvent, AttendanceRecord, Member } from "@/app/dashboard/attendance/types";
import { useProcessCardScan, useFilteredAttendanceSessions } from "@/graphql/hooks/useAttendance";
import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { useAuth } from "@/graphql/hooks/useAuth";

function CardScannerApp() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingScans, setPendingScans] = useState<AttendanceRecord[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AttendanceEvent | null>(null);
  const [scanMode, setScanMode] = useState<"NFC" | "QR">("NFC");
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [scannedMember, setScannedMember] = useState<Member | null>(null);
  const [activeEvents, setActiveEvents] = useState<AttendanceEvent[]>([]);

  // Organization and branch context
  const { organisationId, branchId } = useOrganizationBranchFilter();
  const { user } = useAuth();

  // Fetch attendance sessions
  const { sessions = [] } = useFilteredAttendanceSessions({
    organisationId,
    branchId,
  });
  const [showMemberInfo, setShowMemberInfo] = useState<boolean>(false);

  // Define syncPendingScans with useCallback to avoid dependency issues
  const syncPendingScans = useCallback(async () => {
    // In a real app, this would send pending scans to the server
    console.log("Syncing pending scans:", pendingScans);
    
    // Mock successful sync
    setPendingScans([]);
  }, [pendingScans]);

  // Check for online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine && pendingScans.length > 0) {
        syncPendingScans();
      }
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, [pendingScans, syncPendingScans]);

  // Load active events from API sessions
  useEffect(() => {
    if (!sessions) return;
    const now = new Date();
    const soon = new Date(now.getTime() + 60 * 60 * 1000);
    // Accept SCHEDULED, ONGOING, PLANNED (case-insensitive)
    const activeStatuses = ["SCHEDULED", "ONGOING", "PLANNED"];
    const events = sessions.filter((event: import('@/graphql/hooks/useAttendance').AttendanceSession) => {
      if (!event.startTime) return false;
      return (
        activeStatuses.includes((event.status || "").toUpperCase()) &&
        new Date(event.startTime) < soon
      );
    });
    setActiveEvents(events);
  }, [sessions]);

  // Check for NFC capability
  useEffect(() => {
    // Check if the device supports Web NFC API
    const checkNfcSupport = () => {
      // Check for Web NFC API support
      if (typeof window !== 'undefined' && 'NDEFReader' in window) {
        setScanMode("NFC");
      } else {
        setScanMode("QR");
      }
    };

    checkNfcSupport();
  }, []);



  const handleEventSelect = (event: AttendanceEvent) => {
    setSelectedEvent(event);
  };

  // --- Integrate real processCardScan mutation ---
  const { processCardScan } = useProcessCardScan();

  const handleScanComplete = async (cardId: string): Promise<void> => {
    if (!selectedEvent) return;
    setScanStatus("scanning");

    try {
      const result = await processCardScan({
        sessionId: selectedEvent.id,
        cardId,
        scanMethod: scanMode === "NFC" ? "NFC" : "QR_CODE",
        branchId: selectedEvent.branchId,
        scanTime: new Date().toISOString(),
      });
      const scanResult = result?.data?.processCardScan;
      if (scanResult && scanResult.member) {
        setScannedMember({
          id: scanResult.member.id,
          firstName: scanResult.member.firstName ?? '',
          lastName: scanResult.member.lastName ?? '',
          status: "active",
          email: '',
          primaryBranchId: selectedEvent.branchId,
          hasCard: true,
          cardId: cardId,
          photoUrl: '',
          attendanceStreak: 0,
          isChild: false
        });
        setScanStatus("success");
        setShowMemberInfo(true);
      } else {
        setScanStatus("error");
      }
    } catch {
      setScanStatus("error");
    }

    // Reset scanner after a delay
    setTimeout(() => {
      setScanStatus("idle");
      setShowMemberInfo(false);
    }, 3000);
  };


  const toggleScanMode = () => {
    setScanMode(prev => prev === "NFC" ? "QR" : "NFC");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Modern App Header */}
      <header className="bg-white backdrop-blur-sm bg-opacity-90 sticky top-0 z-10 shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/dashboard/attendance" className="flex items-center">
                <button
                  className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Card Scanner
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {!isOnline && (
                <div className="text-red-600 flex items-center bg-red-50 px-3 py-1 rounded-full">
                  <WifiIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Offline</span>
                </div>
              )}
              <button
                onClick={toggleScanMode}
                className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
                aria-label={scanMode === "NFC" ? "Switch to QR scanning" : "Switch to NFC scanning"}
              >
                {scanMode === "NFC" ? (
                  <QrCodeIcon className="h-5 w-5" />
                ) : (
                  <CreditCardIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Offline Indicator */}
      {!isOnline && (
        <OfflineIndicator pendingCount={pendingScans.length} />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Event Selection Screen */}
        {!selectedEvent ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2 text-indigo-600" />
              Select Event
            </h2>
            <EventSelector 
              events={activeEvents} 
              onSelectEvent={handleEventSelect} 
            />
          </div>
        ) : (
          <div className="mt-4 lg:flex lg:gap-6">
            {/* Left column: Event info and scanner */}
            <div className="lg:w-2/3 space-y-6">
              {/* Event information card */}
              <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedEvent.name}
                    </h2>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1 text-indigo-500" />
                        <span>
                          {new Date(selectedEvent.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {" - "}
                          {new Date(selectedEvent.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-1 text-indigo-500" />
                        <span>{selectedEvent.locationId === "loc_001" ? "Main Auditorium" : "Branch Location"}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-1 text-indigo-500" />
                        <span>Expected: {selectedEvent.expectedAttendees || "120"} members</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors"
                  >
                    Change Event
                  </button>
                </div>
              </div>
            
              {/* Scanner Interface */}
              <ScannerInterface 
                scanMode={scanMode} 
                status={scanStatus}
                onScanComplete={handleScanComplete}
                className="lg:mb-0"
              />
            </div>

            {/* Right column: Member information or instructions */}
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              {showMemberInfo && scannedMember ? (
                <MemberInfo 
                  member={scannedMember} 
                  event={selectedEvent}
                  onClose={() => setShowMemberInfo(false)}
                />
              ) : (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100 text-center">
                  <div className="bg-white/70 backdrop-blur rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <CreditCardIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Scan</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {scanMode === "NFC" 
                      ? "Hold the NFC card close to the back of your device to register attendance" 
                      : "Position the QR code within the scanning area"}
                  </p>
                  <div className="text-xs text-gray-500 border-t border-indigo-100 pt-4 mt-4">
                    <p>Last check-in: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
