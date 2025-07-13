"use client";

import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, DocumentTextIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateSelectorProps {
  templates: EmailTemplate[];
  loading: boolean;
  selectedTemplateId: string | null;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({
  templates,
  loading,
  selectedTemplateId,
  onSelect,
}: TemplateSelectorProps) {
  const [query, setQuery] = useState("");

  // Filter templates based on search query
  const filteredTemplates =
    query === ""
      ? templates || []
      : (templates || []).filter((template) => {
          return (
            template.name.toLowerCase().includes(query.toLowerCase()) ||
            (template.description?.toLowerCase().includes(query.toLowerCase())) ||
            (template.category?.toLowerCase().includes(query.toLowerCase()))
          );
        });

  // Group templates by category
  const groupedTemplates = filteredTemplates?.reduce<Record<string, EmailTemplate[]>>(
    (groups, template) => {
      const category = template.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(template);
      return groups;
    },
    {}
  ) || {};

  // Sort categories
  const sortedCategories = Object.keys(groupedTemplates).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Combobox value={selectedTemplateId} onChange={onSelect}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-200 bg-white text-left focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all duration-200">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <Combobox.Input
              as={Input}
              className="w-full border-none py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Select a template or search..."
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(templateId: string) => {
                const template = (templates || []).find((t) => t.id === templateId);
                return template ? template.name : "";
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredTemplates?.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {query !== "" ? "No templates found." : "No templates available."}
              </div>
            ) : (
              sortedCategories.map((category) => (
                <div key={category}>
                  <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-800">
                    {category}
                  </div>
                  {groupedTemplates[category].map((template) => (
                    <Combobox.Option
                      key={template.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "text-gray-900"
                        } transition-colors duration-150`
                      }
                      value={template.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <div className={`absolute left-2 flex items-center justify-center ${active ? "text-white" : "text-blue-500"}`}>
                              <div className={`rounded-full ${active ? "bg-white/20" : "bg-blue-100"} p-1`}>
                                <DocumentTextIcon className="h-3.5 w-3.5" />
                              </div>
                            </div>
                            <div>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {template.name}
                              </span>
                              {template.description && (
                                <span
                                  className={`block truncate text-xs ${
                                    active ? "text-blue-100" : "text-gray-500"
                                  }`}
                                >
                                  {template.description}
                                </span>
                              )}
                            </div>
                          </div>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                active ? "text-white" : "text-blue-600"
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
      
      {selectedTemplateId && (
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5">
            <DocumentTextIcon className="h-3 w-3 mr-1" />
            Template selected
          </Badge>
          <span className="text-xs text-gray-500">
            {(templates || []).find(t => t.id === selectedTemplateId)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
