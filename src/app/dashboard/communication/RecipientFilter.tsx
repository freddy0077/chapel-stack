import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

const topLevelFilters = [
  { key: "all", label: "All Members" },
  { key: "new", label: "New Members" },
  { key: "volunteers", label: "Volunteers" },
  { key: "ministry", label: "Ministry Teams", hasNested: true },
  { key: "smallgroups", label: "Small Groups", hasNested: true },
  { key: "donors", label: "Donors" },
  { key: "guests", label: "Visitors/Guests" },
  { key: "staff", label: "Staff" },
  { key: "birthdays", label: "Birthday Celebrants" },
  { key: "event", label: "Event Attendees", hasNested: true },
  { key: "custom", label: "Custom List", hasUpload: true },
  { key: "demographics", label: "By Demographics", hasNested: true },
  { key: "inactive", label: "Inactive Members" },
  { key: "prayer", label: "Prayer Request Submitters" },
  { key: "parents", label: "Parents (Families with Children)" },
  { key: "newsletter", label: "Newsletter Subscribers" },
  { key: "anniversary", label: "Anniversary Celebrants" },
  { key: "baptized", label: "Recently Baptized" },
  { key: "milestones", label: "Upcoming Milestones" },
];

const ministryTeams = ["Worship", "Youth", "Outreach", "Hospitality", "Tech", "Prayer"];
const smallGroups = ["Men's Group", "Women's Group", "Young Adults", "Seniors", "Families"];
const events = ["Christmas Service", "Easter Brunch", "Youth Retreat", "Volunteer Training"];

const demographics = [
  { key: "age", label: "Age Group", options: ["Children", "Teens", "Adults", "Seniors"] },
  { key: "gender", label: "Gender", options: ["Male", "Female", "Other"] },
  { key: "location", label: "Location", options: ["ZIP 12345", "ZIP 67890", "Other"] },
];

export type RecipientFilterValue =
  | { type: string; value?: string | string[] }
  | { type: "custom"; value: File | string[] };

export default function RecipientFilter({ onChange }: { onChange: (val: RecipientFilterValue) => void }) {
  const [active, setActive] = useState<string>("all");
  const [nested, setNested] = useState<string | null>(null);
  const [customList, setCustomList] = useState<File | null>(null);
  const [demographic, setDemographic] = useState<{ key: string; value: string } | null>(null);

  // Handle top-level filter selection
  const handleSelect = (key: string) => {
    setActive(key);
    setNested(null);
    setDemographic(null);
    if (key === "custom") {
      onChange({ type: "custom", value: customList });
    } else {
      onChange({ type: key });
    }
  };

  // Handle nested selection
  const handleNestedSelect = (type: string, value: string) => {
    setNested(value);
    onChange({ type, value });
  };

  // Handle demographics
  const handleDemographic = (key: string, value: string) => {
    setDemographic({ key, value });
    onChange({ type: "demographics", value: `${key}:${value}` });
  };

  // Handle custom upload
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomList(e.target.files[0]);
      onChange({ type: "custom", value: e.target.files[0] });
    }
  };

  return (
    <Card className="p-4 mb-6 bg-white border shadow-sm flex flex-col gap-3">
      <div className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-blue-500"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor" strokeWidth="1.5"/></svg>
        Recipients
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {topLevelFilters.map(f => (
          <Button
            key={f.key}
            variant={active === f.key ? "default" : "outline"}
            className="rounded-full px-4 py-1 text-sm"
            onClick={() => handleSelect(f.key)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      {/* Nested selectors */}
      {active === "ministry" && (
        <div className="flex flex-wrap gap-2 mt-1">
          {ministryTeams.map(team => (
            <Badge
              key={team}
              className={`cursor-pointer px-3 py-1 ${nested === team ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700"}`}
              onClick={() => handleNestedSelect("ministry", team)}
            >
              {team}
            </Badge>
          ))}
        </div>
      )}
      {active === "smallgroups" && (
        <div className="flex flex-wrap gap-2 mt-1">
          {smallGroups.map(group => (
            <Badge
              key={group}
              className={`cursor-pointer px-3 py-1 ${nested === group ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"}`}
              onClick={() => handleNestedSelect("smallgroups", group)}
            >
              {group}
            </Badge>
          ))}
        </div>
      )}
      {active === "event" && (
        <div className="flex flex-wrap gap-2 mt-1">
          {events.map(ev => (
            <Badge
              key={ev}
              className={`cursor-pointer px-3 py-1 ${nested === ev ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`}
              onClick={() => handleNestedSelect("event", ev)}
            >
              {ev}
            </Badge>
          ))}
        </div>
      )}
      {active === "demographics" && (
        <div className="flex flex-wrap gap-3 mt-1">
          {demographics.map(demo => (
            <div key={demo.key} className="flex items-center gap-1">
              <span className="text-xs text-gray-600 font-medium">{demo.label}:</span>
              <select
                className="border rounded px-2 py-1 text-xs"
                value={demographic?.key === demo.key ? demographic.value : ""}
                onChange={e => handleDemographic(demo.key, e.target.value)}
              >
                <option value="">Select</option>
                {demo.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
      {active === "custom" && (
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-xs text-gray-500">Upload CSV or paste emails below:</label>
          <input type="file" accept=".csv" onChange={handleFile} className="text-xs" />
          <textarea
            rows={2}
            className="border rounded px-2 py-1 text-xs mt-1"
            placeholder="Paste comma-separated emails here"
            onChange={e => onChange({ type: "custom", value: e.target.value.split(/,|\n/).map(x => x.trim()).filter(Boolean) })}
          />
        </div>
      )}
    </Card>
  );
}
