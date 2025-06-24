"use client";

import { QuickLinksWidget as QuickLinksWidgetType } from "@/hooks/useDashboardData";
import Link from "next/link";

interface QuickLinksWidgetProps {
  widget: QuickLinksWidgetType;
}

export default function QuickLinksWidget({ widget }: QuickLinksWidgetProps) {
  if (!widget || !widget.links || widget.links.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{widget.title || "Quick Links"}</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {widget.links.map((link, index) => (
            <Link 
              key={link.id || `quick-link-${index}`} 
              href={link.url}
              className="flex items-center p-3 rounded-md border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  {link.icon ? (
                    <span className="text-indigo-600" dangerouslySetInnerHTML={{ __html: link.icon }} />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{link.title}</h4>
                {link.description && (
                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{link.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
