import React, { useState, useRef, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

export type EmailTemplate = {
  category: string;
  name: string;
  purpose: string;
  subjectLines: string[];
  audience: string;
  tone: string;
  tags: string[];
  bodyHtml: string;
  bibleVerse?: string;
  cta: string;
};

const categoryColors: Record<string, string> = {
  "Worship & Services": "bg-blue-100 text-blue-800 border-blue-200",
  "Ministry & Volunteer Communication":
    "bg-purple-100 text-purple-800 border-purple-200",
  "Administrative Notices": "bg-amber-100 text-amber-800 border-amber-200",
  "Celebrations & Events": "bg-green-100 text-green-800 border-green-200",
};

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem("email_template_favs") || "[]");
  } catch {
    return [];
  }
};
const setFavorites = (favNames: string[]) => {
  localStorage.setItem("email_template_favs", JSON.stringify(favNames));
};

const templates: EmailTemplate[] = [
  {
    category: "Worship & Services",
    name: "Sunday Service Invitation",
    purpose: "Invite members to weekly Sunday worship.",
    subjectLines: [
      "Join Us for Worship This Sunday!",
      "You're Invited: Sunday Service at [Church Name]",
    ],
    audience: "All members, visitors",
    tone: "Warm, welcoming, uplifting",
    tags: ["[First Name]", "[Service Time]", "[Church Name]"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#2d6cdf;">Sunday Service Invitation</h2>
        <p>Dear <strong>{First Name}</strong>,</p>
        <p>We warmly invite you and your loved ones to join us for our Sunday Service at <strong>{Church Name}</strong> this week at <strong>{Service Time}</strong>.<br/>
        Come experience heartfelt worship, inspiring teaching, and genuine fellowship.</p>
        <p>We look forward to worshipping together and growing in faith!</p>
        <blockquote style="border-left:4px solid #2d6cdf;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          “Let us come before Him with thanksgiving and extol Him with music and song.”<br/>
          <span style="font-size:0.9em;">— Psalm 95:2</span>
        </blockquote>
        <p>Blessings,<br/>The {Church Name} Team</p>
        <a href="#" style="background:linear-gradient(90deg,#2d6cdf,#6c63ff);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">RSVP or Add to Calendar</a>
      </div>
    `,
    bibleVerse: "Psalm 95:2",
    cta: "RSVP or Add to Calendar",
  },
  {
    category: "Administrative Notices",
    name: "Annual Meeting Announcement",
    purpose: "Notify members of upcoming church meetings.",
    subjectLines: [
      "Notice: Annual Church Meeting",
      "You're Invited: {Church Name} Annual Meeting",
    ],
    audience: "All members",
    tone: "Informative, respectful, transparent",
    tags: ["[First Name]", "[Meeting Date]", "[Meeting Time]", "[Location]"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#1e293b;">Annual Church Meeting</h2>
        <p>Dear <strong>{First Name}</strong>,</p>
        <p>This is a friendly reminder of our upcoming <strong>Annual Church Meeting</strong> on <strong>{Meeting Date}</strong> at <strong>{Meeting Time}</strong>, held at <strong>{Location}</strong>.<br/>
        Your participation is important as we reflect on the past year and plan for the future.</p>
        <p>Please mark your calendar and join us as we seek God’s guidance together.</p>
        <blockquote style="border-left:4px solid #1e293b;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          “Plans fail for lack of counsel, but with many advisers they succeed.”<br/>
          <span style="font-size:0.9em;">— Proverbs 15:22</span>
        </blockquote>
        <p>In His Service,<br/>{Church Name} Leadership</p>
        <a href="#" style="background:linear-gradient(90deg,#1e293b,#64748b);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">View Agenda</a>
      </div>
    `,
    bibleVerse: "Proverbs 15:22",
    cta: "View Agenda",
  },
  {
    category: "Celebrations & Events",
    name: "Special Event Invitation",
    purpose: "Invite to special church events.",
    subjectLines: [
      "Celebrate with Us: {Event Name} at {Church Name}",
      "You're Invited: {Event Name} Celebration",
    ],
    audience: "All members, community, friends",
    tone: "Joyful, celebratory, inclusive",
    tags: [
      "[First Name]",
      "[Event Name]",
      "[Event Date]",
      "[Event Time]",
      "[Location]",
    ],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#e11d48;">{Event Name} Invitation</h2>
        <p>Hello <strong>{First Name}</strong>,</p>
        <p>We’re excited to invite you to our upcoming <strong>{Event Name}</strong> on <strong>{Event Date}</strong> at <strong>{Event Time}</strong>, taking place at <strong>{Location}</strong>.<br/>
        Join us for a joyful time of celebration, music, and fellowship!</p>
        <p>Bring your friends and family—everyone is welcome!</p>
        <blockquote style="border-left:4px solid #e11d48;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          “Rejoice in the Lord always. I will say it again: Rejoice!”<br/>
          <span style="font-size:0.9em;">— Philippians 4:4</span>
        </blockquote>
        <p>With joy,<br/>The {Church Name} Events Team</p>
        <a href="#" style="background:linear-gradient(90deg,#e11d48,#f472b6);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">Register Here</a>
      </div>
    `,
    bibleVerse: "Philippians 4:4",
    cta: "Register Here",
  },
  {
    category: "Ministry & Volunteer Communication",
    name: "Volunteer Appreciation",
    purpose: "Thank volunteers for their service.",
    subjectLines: [
      "Thank You for Serving, {First Name}!",
      "We Appreciate You, {Ministry Name} Volunteer",
    ],
    audience: "Volunteers, ministry teams",
    tone: "Grateful, encouraging, affirming",
    tags: ["[First Name]", "[Ministry Name]", "[Service Date]"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#16a34a;">Thank You, {Ministry Name} Volunteer!</h2>
        <p>Dear <strong>{First Name}</strong>,</p>
        <p>Thank you for your faithful service in {Ministry Name}. Your dedication on {Service Date} made a real difference in our church community.</p>
        <p>We are truly grateful for your heart to serve and your willingness to bless others.</p>
        <blockquote style="border-left:4px solid #16a34a;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          “Each of you should use whatever gift you have received to serve others.”<br/>
          <span style="font-size:0.9em;">— 1 Peter 4:10</span>
        </blockquote>
        <p>With appreciation,<br/>{Church Name} Leadership</p>
        <a href="#" style="background:linear-gradient(90deg,#16a34a,#22d3ee);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">Read More</a>
      </div>
    `,
    bibleVerse: "1 Peter 4:10",
    cta: "Read More",
  },
  {
    category: "Celebrations & Events",
    name: "Event Reminder",
    purpose: "Remind members of upcoming events and encourage attendance.",
    subjectLines: ["Don't Miss Our Upcoming Event!"],
    audience: "All Members",
    tone: "Friendly, Inviting",
    tags: ["event", "reminder", "calendar", "RSVP"],
    bodyHtml: `<p>Dear Church Family,</p><p>This is a friendly reminder about our upcoming event. We hope you can join us for a time of fellowship and growth. Please check the details below and RSVP if you haven't already.</p><p><strong>Event:</strong> {Event Name}<br/><strong>Date:</strong> {Event Date}<br/><strong>Time:</strong> {Event Time}<br/><strong>Location:</strong> {Event Location}</p><p>Blessings,<br/>{Church Name}</p>`,
    cta: "RSVP Now",
  },
  {
    category: "Ministry & Volunteer Communication",
    name: "Volunteer Appreciation",
    purpose:
      "Thank volunteers for their dedication and highlight their impact.",
    subjectLines: ["Thank You for Serving!"],
    audience: "Volunteers",
    tone: "Warm, Grateful",
    tags: ["volunteer", "appreciation", "thank you"],
    bodyHtml: `<p>Dear Volunteer,</p><p>We are deeply grateful for your service and commitment to our ministry. Your efforts make a real difference, and we couldn't do it without you. Thank you for being a vital part of our team!</p><p>With appreciation,<br/>{Church Leadership}</p>`,
    cta: "See Volunteer Opportunities",
  },
  {
    category: "Administrative Notices",
    name: "New Member Welcome",
    purpose: "Welcome new members and provide next steps for involvement.",
    subjectLines: ["Welcome to Our Church Family!"],
    audience: "New Members",
    tone: "Welcoming, Encouraging",
    tags: ["welcome", "onboarding", "new member"],
    bodyHtml: `<p>Welcome to {Church Name}!</p><p>We're excited to have you join our community. Here are a few next steps to help you get connected:</p><ul><li>Attend our New Member Orientation</li><li>Join a small group</li><li>Meet our pastors and staff</li></ul><p>If you have any questions, feel free to reach out. We're here for you!</p>`,
    cta: "Get Connected",
  },
  {
    category: "Administrative Notices",
    name: "Donation Receipt",
    purpose: "Send a receipt and thank you note for donations.",
    subjectLines: ["Thank You for Your Generosity"],
    audience: "Donors",
    tone: "Grateful, Professional",
    tags: ["donation", "receipt", "giving", "thank you"],
    bodyHtml: `<p>Dear {Donor Name},</p><p>Thank you for your generous donation of {Amount} on {Date}. Your support enables us to continue our mission and serve our community.</p><p>This email serves as your official receipt. No goods or services were provided in exchange for this contribution.</p><p>With gratitude,<br/>{Church Name}</p>`,
    cta: "View Giving History",
  },
  {
    category: "Worship & Services",
    name: "Prayer Request Acknowledgement",
    purpose: "Confirm receipt of a prayer request and offer support.",
    subjectLines: ["We've Received Your Prayer Request"],
    audience: "Individuals Submitting Prayer Requests",
    tone: "Compassionate, Supportive",
    tags: ["prayer", "support", "acknowledgement"],
    bodyHtml: `<p>Dear Friend,</p><p>We have received your prayer request and want you to know that our team is praying for you. If you'd like to talk with someone or need additional support, please let us know.</p><p>May God's peace be with you,<br/>{Church Prayer Team}</p>`,
    cta: "Request a Call",
  },
  {
    category: "Celebrations & Events",
    name: "Birthday Greeting",
    purpose: "Send birthday wishes to members.",
    subjectLines: ["Happy Birthday from {Church Name}!"],
    audience: "Members with Upcoming Birthdays",
    tone: "Joyful, Personal",
    tags: ["birthday", "celebration", "greeting"],
    bodyHtml: `<p>Happy Birthday, {Name}!</p><p>We pray this year will be filled with joy, growth, and blessings. Enjoy your special day!</p><p>With love,<br/>Your {Church Name} Family</p>`,
    cta: "Send a Prayer Request",
  },
  {
    category: "Worship & Services",
    name: "Service Schedule Change",
    purpose: "Notify about changes in service times or locations.",
    subjectLines: ["Update: Service Schedule Change"],
    audience: "All Members",
    tone: "Informative, Reassuring",
    tags: ["schedule", "update", "service"],
    bodyHtml: `<p>Dear Church Family,</p><p>Please note that our service schedule has changed:</p><ul><li><strong>New Time:</strong> {New Time}</li><li><strong>New Location:</strong> {New Location}</li></ul><p>Thank you for your understanding. We look forward to seeing you at our next gathering!</p>`,
    cta: "View Updated Schedule",
  },
  {
    category: "Administrative Notices",
    name: "Weekly Newsletter",
    purpose: "Share news, upcoming events, and announcements.",
    subjectLines: ["{Church Name} Weekly Newsletter"],
    audience: "All Members",
    tone: "Informative, Friendly",
    tags: ["newsletter", "update", "announcement"],
    bodyHtml: `<p>Dear Church Family,</p><p>Here's what's happening this week at {Church Name}:</p><ul><li>Upcoming Events</li><li>Volunteer Opportunities</li><li>Prayer Requests</li></ul><p>Stay connected and let us know if you have any questions!</p>`,
    cta: "Read Full Newsletter",
  },
  {
    category: "Ministry & Volunteer Communication",
    name: "Pastoral Care Follow-up",
    purpose: "Follow up with someone who received pastoral care or counseling.",
    subjectLines: ["Checking In: Pastoral Care Follow-up"],
    audience: "Individuals Recently Contacted",
    tone: "Caring, Encouraging",
    tags: ["care", "follow-up", "support"],
    bodyHtml: `<p>Dear Friend,</p><p>We wanted to check in and see how you're doing after our recent conversation. Please let us know if you need further support or prayer.</p><p>We're here for you,<br/>{Church Staff}</p>`,
    cta: "Contact Pastoral Team",
  },
  {
    category: "Celebrations & Events",
    name: "Holiday Greetings",
    purpose: "Send special greetings for holidays such as Christmas or Easter.",
    subjectLines: [
      "Merry Christmas from {Church Name}!",
      "Happy Easter from {Church Name}!",
    ],
    audience: "All Members",
    tone: "Festive, Warm",
    tags: ["holiday", "greeting", "celebration"],
    bodyHtml: `<p>Wishing you and your family a blessed {Holiday}!</p><p>May this season bring you peace, joy, and hope. We're grateful to celebrate together as a church family.</p><p>With love,<br/>{Church Name}</p>`,
    cta: "Share Holiday Blessings",
  },
];

export default function EmailTemplatePicker({
  onSelect,
}: {
  onSelect: (template: EmailTemplate) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [modalTemplate, setModalTemplate] = useState<EmailTemplate | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [favorites, setFavs] = useState<string[]>(getFavorites());
  const [keyboardFocus, setKeyboardFocus] = useState<number>(-1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter and sort logic
  let filteredTemplates = templates.filter((t) => {
    const searchText =
      `${t.name} ${t.purpose} ${t.subjectLines.join(" ")} ${t.tags.join(" ")}`.toLowerCase();
    return (
      (selectedCategory === "All" || t.category === selectedCategory) &&
      (!search || searchText.includes(search.toLowerCase()))
    );
  });

  // Show favorites first if "Favorites" is selected
  const showFavsOnly = selectedCategory === "Favorites";
  if (showFavsOnly) {
    filteredTemplates = filteredTemplates.filter((t) =>
      favorites.includes(t.name),
    );
  }

  // Add "Favorites" category if any exist
  const baseCategories = Array.from(new Set(templates.map((t) => t.category)));
  const categories =
    favorites.length > 0
      ? ["All", "Favorites", ...baseCategories]
      : ["All", ...baseCategories];

  // Keyboard navigation
  useEffect(() => {
    if (keyboardFocus >= 0 && cardRefs.current[keyboardFocus]) {
      cardRefs.current[keyboardFocus]?.focus();
    }
  }, [keyboardFocus, filteredTemplates.length]);

  // Handle modal trap focus
  useEffect(() => {
    if (modalTemplate) {
      const handle = (e: KeyboardEvent) => {
        if (e.key === "Escape") setModalTemplate(null);
      };
      window.addEventListener("keydown", handle);
      return () => window.removeEventListener("keydown", handle);
    }
  }, [modalTemplate]);

  const toggleFavorite = (name: string) => {
    let newFavs = favorites.includes(name)
      ? favorites.filter((f) => f !== name)
      : [...favorites, name];
    setFavs(newFavs);
    setFavorites(newFavs);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-5 flex flex-col h-[70vh]">
      {/* Search and category filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setKeyboardFocus(-1);
          }}
          placeholder="Search templates..."
          className="border rounded px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="rounded-full px-4 py-1 text-sm"
              onClick={() => {
                setSelectedCategory(category);
                setKeyboardFocus(-1);
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid of template cards */}
      <div className="flex-1 overflow-y-auto pr-2">
        {filteredTemplates.length === 0 ? (
          <div className="text-center text-gray-500 py-10 col-span-full">
            No templates found.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((template, idx) => (
              <Card
                key={template.name}
                ref={(el) => (cardRefs.current[idx] = el)}
                tabIndex={0}
                aria-label={`Preview ${template.name}`}
                className={`relative p-4 hover:shadow-lg cursor-pointer transition focus:ring-2 focus:ring-blue-400 ${keyboardFocus === idx ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => setModalTemplate(template)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setModalTemplate(template);
                  if (e.key === "ArrowRight")
                    setKeyboardFocus(
                      idx + 1 < filteredTemplates.length ? idx + 1 : 0,
                    );
                  if (e.key === "ArrowLeft")
                    setKeyboardFocus(
                      idx - 1 >= 0 ? idx - 1 : filteredTemplates.length - 1,
                    );
                  if (e.key === "ArrowDown")
                    setKeyboardFocus(
                      idx + 2 < filteredTemplates.length ? idx + 2 : idx,
                    );
                  if (e.key === "ArrowUp")
                    setKeyboardFocus(idx - 2 >= 0 ? idx - 2 : idx);
                }}
                onFocus={() => setKeyboardFocus(idx)}
              >
                <button
                  className={`absolute top-2 right-2 text-yellow-400 hover:text-yellow-500 focus:outline-none ${favorites.includes(template.name) ? "" : "opacity-50"}`}
                  aria-label={
                    favorites.includes(template.name)
                      ? "Unstar template"
                      : "Star template"
                  }
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(template.name);
                  }}
                >
                  {/* Star SVG */}
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.09 2.67 1.09-6.36L1 7.64l6.41-.93L10 1.5l2.59 5.21 6.41.93-4.65 4.67 1.09 6.36z" />
                  </svg>
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-base text-gray-800 truncate max-w-[120px]">
                    {template.name}
                  </span>
                  <Badge
                    className={`ml-1 ${categoryColors[template.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                  >
                    {template.category}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mb-1 truncate">
                  {template.purpose}
                </div>
                <div className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">
                  {/* Thumbnail preview: strip HTML and show first 200 chars */}
                  {template.bodyHtml.replace(/<[^>]+>/g, "").slice(0, 100)}...
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal Preview */}
      {modalTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setModalTemplate(null)}
          />
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
            tabIndex={-1}
          >
            <div className="px-6 py-4 border-b flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
                  {modalTemplate.name}
                </h3>
                <Badge
                  className={`${categoryColors[modalTemplate.category] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                >
                  {modalTemplate.category}
                </Badge>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setModalTemplate(null)}
                aria-label="Close preview"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
              <div className="text-sm text-gray-600">
                {modalTemplate.purpose}
              </div>
              <div className="flex flex-wrap gap-1">
                {modalTemplate.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-gray-100 text-gray-600 border border-gray-200 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                Audience: {modalTemplate.audience} • Tone: {modalTemplate.tone}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Suggested Subject
                </div>
                <div className="border rounded bg-gray-50 p-2 text-sm text-gray-800">
                  {modalTemplate.subjectLines[0]}
                </div>
              </div>
              <div
                className="border rounded bg-white p-4 shadow-inner max-h-[30vh] overflow-y-auto"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: modalTemplate.bodyHtml }}
                ></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalTemplate(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onSelect(modalTemplate);
                  setModalTemplate(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Use this template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
