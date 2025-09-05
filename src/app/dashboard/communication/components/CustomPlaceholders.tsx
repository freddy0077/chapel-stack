import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

// Backend-handled placeholders that should be ignored
const BACKEND_PLACEHOLDERS = [
  "{firstName}",
  "{lastName}",
  "{fullName}",
  "{churchName}",
  "{date}",
  "{email}",
];

// Function to extract custom placeholders from content
const extractCustomPlaceholders = (content: string): string[] => {
  const placeholderRegex = /\{([^}]+)\}/g;
  const matches = content.match(placeholderRegex) || [];

  // Filter out backend-handled placeholders
  const customPlaceholders = matches.filter(
    (placeholder) => !BACKEND_PLACEHOLDERS.includes(placeholder),
  );

  // Remove duplicates
  return [...new Set(customPlaceholders)];
};

interface CustomPlaceholder {
  key: string;
  value: string;
}

interface CustomPlaceholdersProps {
  subject: string;
  body: string;
  customPlaceholders: CustomPlaceholder[];
  onCustomPlaceholdersChange: (placeholders: CustomPlaceholder[]) => void;
}

export default function CustomPlaceholders({
  subject,
  body,
  customPlaceholders,
  onCustomPlaceholdersChange,
}: CustomPlaceholdersProps) {
  // Extract custom placeholders from subject and body
  const detectedPlaceholders = extractCustomPlaceholders(subject + " " + body);

  // Ensure all detected placeholders have entries in customPlaceholders
  React.useEffect(() => {
    const currentKeys = customPlaceholders.map((p) => p.key);
    const newPlaceholders = detectedPlaceholders.filter(
      (placeholder) => !currentKeys.includes(placeholder),
    );

    if (newPlaceholders.length > 0) {
      const updatedPlaceholders = [
        ...customPlaceholders,
        ...newPlaceholders.map((key) => ({ key, value: "" })),
      ];
      onCustomPlaceholdersChange(updatedPlaceholders);
    }

    // Remove placeholders that are no longer in the content
    const stillUsedPlaceholders = customPlaceholders.filter((placeholder) =>
      detectedPlaceholders.includes(placeholder.key),
    );

    if (stillUsedPlaceholders.length !== customPlaceholders.length) {
      onCustomPlaceholdersChange(stillUsedPlaceholders);
    }
  }, [detectedPlaceholders, customPlaceholders, onCustomPlaceholdersChange]);

  const updatePlaceholderValue = (key: string, value: string) => {
    const updatedPlaceholders = customPlaceholders.map((placeholder) =>
      placeholder.key === key ? { ...placeholder, value } : placeholder,
    );
    onCustomPlaceholdersChange(updatedPlaceholders);
  };

  const addManualPlaceholder = () => {
    const newKey = `{newVariable${customPlaceholders.length + 1}}`;
    const updatedPlaceholders = [
      ...customPlaceholders,
      { key: newKey, value: "" },
    ];
    onCustomPlaceholdersChange(updatedPlaceholders);
  };

  const removePlaceholder = (keyToRemove: string) => {
    const updatedPlaceholders = customPlaceholders.filter(
      (placeholder) => placeholder.key !== keyToRemove,
    );
    onCustomPlaceholdersChange(updatedPlaceholders);
  };

  if (customPlaceholders.length === 0) {
    return (
      <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <div className="text-center">
          <h4 className="font-semibold text-gray-700 mb-2">Custom Variables</h4>
          <p className="text-sm text-gray-500 mb-4">
            Use custom placeholders like {"{eventName}"} or {"{location}"} in
            your message, and they'll appear here for you to define.
          </p>
          <Button
            onClick={addManualPlaceholder}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-300 hover:bg-purple-100"
          >
            <Plus size={16} className="mr-2" />
            Add Custom Variable
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-700">Custom Variables</h4>
        <Button
          onClick={addManualPlaceholder}
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-300 hover:bg-purple-100"
        >
          <Plus size={16} className="mr-2" />
          Add Variable
        </Button>
      </div>

      <div className="space-y-3">
        {customPlaceholders.map((placeholder) => (
          <div key={placeholder.key} className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 px-3 py-1 font-mono text-sm min-w-fit"
            >
              {placeholder.key}
            </Badge>
            <Input
              placeholder="Enter value for this variable"
              value={placeholder.value}
              onChange={(e) =>
                updatePlaceholderValue(placeholder.key, e.target.value)
              }
              className="flex-1 rounded-xl border-purple-200 focus:ring-purple-400"
            />
            <Button
              onClick={() => removePlaceholder(placeholder.key)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white/60 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Variables like {"{firstName}"}, {"{lastName}"},{" "}
          {"{fullName}"}, {"{churchName}"}, {"{date}"} and {"{email}"} are
          automatically handled by the system.
        </p>
      </div>
    </Card>
  );
}
