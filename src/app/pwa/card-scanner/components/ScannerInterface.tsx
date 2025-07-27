"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  CreditCardIcon, 
  QrCodeIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

interface ScannerInterfaceProps {
  scanMode: "NFC" | "QR";
  status: "idle" | "scanning" | "success" | "error";
  onScanComplete: (cardId: string) => Promise<void>;
  className?: string;
}

export default function ScannerInterface({ 
  scanMode, 
  status, 
  onScanComplete,
  className = ""
}: ScannerInterfaceProps) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [simulateCardId, setSimulateCardId] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Safe check for NFC support
  interface NDEFReader {
    scan: () => Promise<void>;
    addEventListener: (event: string, callback: unknown) => void;
  }
  const checkNfcSupport = (): boolean => {
    return typeof window !== 'undefined' && 'NDEFReader' in window;
  };

  const initNfcReading = useCallback(async () => {
    if (!checkNfcSupport()) {
      setErrorMessage("NFC is not supported on this device");
      return;
    }
    try {
      const ndef = new (window as any).NDEFReader() as NDEFReader;
      await ndef.scan();
      ndef.addEventListener("reading", (event: any) => {
        if (event.serialNumber) {
          onScanComplete(event.serialNumber);
        } else {
          setErrorMessage("NFC tag read but serial number not found.");
        }
      });
      ndef.addEventListener("error", () => {
        setErrorMessage("Error reading NFC card. Please try again.");
      });
    } catch (error: any) {
      if (error && error.name === "NotAllowedError") {
        setErrorMessage("NFC access was denied. Please allow NFC permissions in your browser.");
      } else {
        setErrorMessage("Failed to initialize NFC scanning: " + (error?.message || error));
      }
    }
  }, [onScanComplete]);

  // Initialize NFC reading when in NFC mode and idle
  useEffect(() => {
    if (scanMode === "NFC" && status === "idle") {
      initNfcReading();
    }
  }, [scanMode, status, initNfcReading]);

  // Initialize QR code scanning when in QR mode and idle
  useEffect(() => {
    if (scanMode === "QR" && status === "idle") {
      // In a real implementation, this would initialize the camera
      // and set up QR code reading
    }
    
    return () => {
      // Clean up camera resources if needed
    };
  }, [scanMode, status]);

  const handleSimulateScan = async () => {
    if (simulateCardId.trim()) {
      await onScanComplete(simulateCardId);
      setSimulateCardId("");
    }
  };

  const renderScanAnimation = () => {
    if (status === "scanning") {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="animate-ping absolute h-40 w-40 rounded-full bg-indigo-400 opacity-50"></div>
          <div className="animate-pulse absolute h-32 w-32 rounded-full bg-indigo-300 opacity-70"></div>
          <div className="relative h-28 w-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg flex items-center justify-center">
            {scanMode === "NFC" ? (
              <CreditCardIcon className="h-14 w-14 text-white" />
            ) : (
              <QrCodeIcon className="h-14 w-14 text-white" />
            )}
          </div>
          <div className="absolute bottom-24 bg-white/90 backdrop-blur rounded-full py-2 px-6 shadow-md">
            <p className="text-indigo-800 font-medium text-sm animate-pulse">Scanning...</p>
          </div>
        </div>
      );
    }
    
    if (status === "success") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50/90 backdrop-blur-sm">
          <div className="mb-4 relative h-28 w-28 rounded-full bg-white shadow-md border border-green-100 flex items-center justify-center">
            <CheckCircleIcon className="h-20 w-20 text-green-500" />
          </div>
          <div className="bg-white rounded-full py-2 px-6 shadow-sm border border-green-100">
            <p className="text-green-800 font-medium">Successfully Checked In!</p>
          </div>
        </div>
      );
    }
    
    if (status === "error") {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90 backdrop-blur-sm">
          <div className="mb-4 relative h-28 w-28 rounded-full bg-white shadow-md border border-red-100 flex items-center justify-center">
            <XCircleIcon className="h-20 w-20 text-red-500" />
          </div>
          <div className="bg-white rounded-lg py-3 px-6 shadow-md border border-red-100 max-w-xs text-center">
            <p className="text-red-800 font-medium mb-1">Error</p>
            <p className="text-red-600 text-sm">{errorMessage || "Could not complete check-in"}</p>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden ${className}`}>
      {errorMessage && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 my-2 text-center">
          {errorMessage}
        </div>
      )}
      <div 
        ref={scannerContainerRef}
        className="relative h-96 flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white"
      >
        {scanMode === "QR" && status === "idle" && (
          <div className="absolute inset-0">
            <video 
              ref={videoRef} 
              className="h-full w-full object-cover"
              playsInline 
              muted
            ></video>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Scanner target area with animated borders */}
                <div className="w-64 h-64 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-16 h-2 bg-indigo-500 rounded-tl-lg rounded-tr-lg"></div>
                  <div className="absolute top-0 left-0 w-2 h-16 bg-indigo-500 rounded-tl-lg rounded-bl-lg"></div>
                  
                  <div className="absolute top-0 right-0 w-16 h-2 bg-indigo-500 rounded-tl-lg rounded-tr-lg"></div>
                  <div className="absolute top-0 right-0 w-2 h-16 bg-indigo-500 rounded-tr-lg rounded-br-lg"></div>
                  
                  <div className="absolute bottom-0 left-0 w-16 h-2 bg-indigo-500 rounded-bl-lg rounded-br-lg"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-16 bg-indigo-500 rounded-bl-lg rounded-tl-lg"></div>
                  
                  <div className="absolute bottom-0 right-0 w-16 h-2 bg-indigo-500 rounded-bl-lg rounded-br-lg"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-16 bg-indigo-500 rounded-br-lg rounded-tr-lg"></div>
                </div>
                {/* Scanning laser effect */}
                <div className="absolute left-0 w-64 h-0.5 bg-red-500 animate-[scanline_2s_ease-in-out_infinite] opacity-80"></div>
              </div>
            </div>
          </div>
        )}
        
        {scanMode === "NFC" && status === "idle" && (
          <div className="text-center px-8 py-12 max-w-md mx-auto">
            <div className="mx-auto h-40 w-40 rounded-full bg-white/80 backdrop-blur shadow-md border border-indigo-100 flex items-center justify-center mb-8 relative overflow-hidden">
              {/* Pulsing animation */}
              <div className="absolute inset-0 bg-indigo-100 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] opacity-70"></div>
              <CreditCardIcon className="h-20 w-20 text-indigo-600 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Tap Card to Scan</h3>
            <p className="text-base text-gray-600 max-w-xs mx-auto leading-relaxed">
              Hold your membership card close to the back of this device to register your attendance
            </p>
          </div>
        )}
        
        {renderScanAnimation()}
      </div>
      
      {/* Simulation controls with modern design */}
      <div className="p-5 border-t border-indigo-100 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
            Simulate Card Scan
          </h3>
          <div className="text-xs text-gray-500 italic">Development Mode</div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={simulateCardId}
            onChange={(e) => setSimulateCardId(e.target.value)}
            placeholder="Enter card ID to simulate scan"
            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-lg border border-indigo-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 text-base transition-all disabled:bg-gray-50"
            disabled={status !== "idle"}
          />
          <button
            onClick={handleSimulateScan}
            disabled={status !== "idle" || !simulateCardId.trim()}
            className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
          >
            Simulate
          </button>
        </div>
      </div>
    </div>
  );
}
