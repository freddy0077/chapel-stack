"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * ConflictDialog Component
 * 
 * Displays when a concurrent update conflict is detected (optimistic locking)
 * Provides clear explanation and refresh option
 */

interface ConflictDialogProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  message?: string;
  entityName?: string;
}

export function ConflictDialog({
  open,
  onClose,
  onRefresh,
  message,
  entityName = "record",
}: ConflictDialogProps) {
  const handleRefresh = () => {
    onRefresh();
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-xl">
              Concurrent Update Detected
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            {message ? (
              <Alert variant="destructive" className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-900">
                  {message}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertDescription className="text-amber-900">
                  This {entityName} has been modified by another user since you loaded it.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What happened?</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Another user updated this {entityName} while you were viewing it</li>
                <li>Your changes cannot be saved to prevent data loss</li>
                <li>You need to refresh to see the latest version</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What should you do?</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Click "Refresh Now" to load the latest data</li>
                <li>Review the changes made by the other user</li>
                <li>Make your changes again if needed</li>
              </ol>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Hook to manage conflict state
 */
export function useConflictDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState<string>("");
  const [entityName, setEntityName] = React.useState<string>("record");

  const showConflict = (errorMessage: string, entity?: string) => {
    setMessage(errorMessage);
    if (entity) setEntityName(entity);
    setIsOpen(true);
  };

  const hideConflict = () => {
    setIsOpen(false);
    setMessage("");
  };

  const isConflictError = (error: any): boolean => {
    const message = error?.message || error?.toString() || "";
    return (
      message.includes("modified by another user") ||
      message.includes("version") ||
      message.includes("conflict") ||
      message.includes("concurrent")
    );
  };

  return {
    isOpen,
    message,
    entityName,
    showConflict,
    hideConflict,
    isConflictError,
  };
}
