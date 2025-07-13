"use client";

import { useState, useRef } from "react";
import { 
  DocumentIcon, 
  PhotoIcon, 
  MusicalNoteIcon, 
  XMarkIcon, 
  PaperClipIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface MediaAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  file?: File;
  uploadProgress?: number;
  uploadError?: string;
}

interface MediaAttachmentUploaderProps {
  attachments: MediaAttachment[];
  onChange: (attachments: MediaAttachment[]) => void;
  maxSize?: number; // in MB
  maxFiles?: number;
  allowedTypes?: string[];
  disabled?: boolean;
}

export default function MediaAttachmentUploader({
  attachments,
  onChange,
  maxSize = 10, // Default 10MB
  maxFiles = 5,
  allowedTypes = ["image/*", "application/pdf", "audio/*"],
  disabled = false
}: MediaAttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <PhotoIcon className="h-5 w-5" />;
    } else if (type.startsWith("audio/")) {
      return <MusicalNoteIcon className="h-5 w-5" />;
    } else if (type === "application/pdf") {
      return <DocumentTextIcon className="h-5 w-5" />;
    } else {
      return <DocumentIcon className="h-5 w-5" />;
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    processFiles(Array.from(files));
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Process selected files
  const processFiles = (files: File[]) => {
    setError(null);
    
    // Check if adding these files would exceed the max files limit
    if (attachments.length + files.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const newAttachments: MediaAttachment[] = [];
    
    files.forEach(file => {
      // Check file type
      const isAllowedType = allowedTypes.some(type => {
        if (type.endsWith("/*")) {
          const generalType = type.split("/")[0];
          return file.type.startsWith(`${generalType}/`);
        }
        return type === file.type;
      });
      
      if (!isAllowedType) {
        setError(`File type not allowed: ${file.type}`);
        return;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum size is ${maxSize}MB.`);
        return;
      }
      
      // Create a new attachment
      const newAttachment: MediaAttachment = {
        id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
        uploadProgress: 0
      };
      
      newAttachments.push(newAttachment);
    });
    
    if (newAttachments.length > 0) {
      onChange([...attachments, ...newAttachments]);
      
      // Simulate upload progress for demo purposes
      // In a real app, this would be replaced with actual upload logic
      newAttachments.forEach(attachment => {
        simulateUpload(attachment.id);
      });
    }
  };

  // Simulate file upload progress
  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update the attachment with a fake URL after "upload" completes
        onChange(
          attachments.map(att => 
            att.id === id 
              ? { 
                  ...att, 
                  uploadProgress: 100, 
                  url: `https://example.com/uploads/${att.name}` 
                } 
              : att
          )
        );
      } else {
        // Update progress
        onChange(
          attachments.map(att => 
            att.id === id 
              ? { ...att, uploadProgress: progress } 
              : att
          )
        );
      }
    }, 300);
  };

  // Remove an attachment
  const handleRemoveAttachment = (id: string) => {
    onChange(attachments.filter(attachment => attachment.id !== id));
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and drop area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-blue-100">
            <DocumentArrowUpIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {dragActive ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="text-xs text-gray-500">
              or <span className="text-blue-600 font-medium">browse</span> to upload
            </p>
          </div>
          <div className="pt-2">
            <Badge variant="outline" className="text-xs bg-white">
              Max {maxSize}MB per file • Up to {maxFiles} files
            </Badge>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept={allowedTypes.join(",")}
          disabled={disabled}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm p-2 bg-red-50 rounded-md">
          <ExclamationCircleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Attachment list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Attachments ({attachments.length})</h4>
            {attachments.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                disabled={disabled}
                className="text-xs h-7 text-gray-500 hover:text-gray-700"
              >
                Remove all
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-1.5 rounded-full",
                    attachment.type.startsWith("image/") ? "bg-purple-100" :
                    attachment.type.startsWith("audio/") ? "bg-amber-100" :
                    "bg-blue-100"
                  )}>
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {attachment.uploadProgress !== undefined && attachment.uploadProgress < 100 && (
                    <div className="w-20">
                      <Progress value={attachment.uploadProgress} className="h-1.5" />
                    </div>
                  )}
                  {attachment.uploadProgress === 100 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      Uploaded
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    disabled={disabled}
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
