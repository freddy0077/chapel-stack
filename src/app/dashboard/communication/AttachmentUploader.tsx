import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AttachmentUploader({
  attachments,
  setAttachments,
}: any) {
  // Placeholder: Would handle file upload logic
  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Attachments</span>
        <Button size="sm" variant="outline">
          Add File
        </Button>
      </div>
      <div className="text-xs text-gray-500">
        Images, PDFs, audio clips (UI only)
      </div>
      {/* List of mock attachments */}
      <ul className="mt-2 space-y-1">
        {(attachments || []).map((file: any, idx: number) => (
          <li key={idx} className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📎</span>
            {file.name || `Attachment ${idx + 1}`}
          </li>
        ))}
      </ul>
    </Card>
  );
}
