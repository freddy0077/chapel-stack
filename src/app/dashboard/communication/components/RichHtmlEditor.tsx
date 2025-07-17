import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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

// Template data
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    category: "Worship & Services",
    name: "Sunday Service Invitation",
    purpose: "Invite members to weekly Sunday worship.",
    subjectLines: [
      "Join Us for Worship This Sunday!",
      "You're Invited: Sunday Service at {churchName}",
    ],
    audience: "All members, visitors",
    tone: "Warm, welcoming, uplifting",
    tags: ["{firstName}", "{serviceTime}", "{churchName}"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#2d6cdf;">Sunday Service Invitation</h2>
        <p>Dear <strong>{firstName}</strong>,</p>
        <p>We warmly invite you and your loved ones to join us for our Sunday Service at <strong>{churchName}</strong> this week at <strong>{serviceTime}</strong>.<br/>
        Come experience heartfelt worship, inspiring teaching, and genuine fellowship.</p>
        <p>We look forward to worshipping together and growing in faith!</p>
        <blockquote style="border-left:4px solid #2d6cdf;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          "Let us come before Him with thanksgiving and extol Him with music and song."<br/>
          <span style="font-size:0.9em;">— Psalm 95:2</span>
        </blockquote>
        <p>Blessings,<br/>The {churchName} Team</p>
        <a href="#" style="background:linear-gradient(90deg,#2d6cdf,#6c63ff);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">RSVP or Add to Calendar</a>
      </div>
    `,
    bibleVerse: "Psalm 95:2",
    cta: "RSVP or Add to Calendar",
  },
  {
    category: "Worship & Services",
    name: "Welcome New Members",
    purpose: "Welcome new members to the church family.",
    subjectLines: [
      "Welcome to the {churchName} Family!",
      "We're So Glad You're Here!"
    ],
    audience: "New members",
    tone: "Warm, welcoming, encouraging",
    tags: ["{firstName}", "{churchName}", "{pastorName}"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#10b981;">Welcome to Our Church Family!</h2>
        <p>Dear <strong>{firstName}</strong>,</p>
        <p>What a joy it is to welcome you to the <strong>{churchName}</strong> family! We are thrilled that God has brought you to our community of faith.</p>
        <p>As you begin this journey with us, please know that you are loved, valued, and an important part of our church family. We're here to support you in your spiritual growth and walk with Christ.</p>
        <blockquote style="border-left:4px solid #10b981;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          "Therefore welcome one another as Christ has welcomed you, for the glory of God."<br/>
          <span style="font-size:0.9em;">— Romans 15:7</span>
        </blockquote>
        <p>In Christ's love,<br/>{pastorName} and the {churchName} Team</p>
        <a href="#" style="background:linear-gradient(90deg,#10b981,#34d399);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">Get Connected</a>
      </div>
    `,
    bibleVerse: "Romans 15:7",
    cta: "Get Connected",
  },
  {
    category: "Administrative Notices",
    name: "Annual Meeting Announcement",
    purpose: "Notify members of upcoming church meetings.",
    subjectLines: [
      "Notice: Annual Church Meeting",
      "You're Invited: {churchName} Annual Meeting"
    ],
    audience: "All members",
    tone: "Informative, respectful, transparent",
    tags: ["{firstName}", "{meetingDate}", "{meetingTime}", "{location}"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#1e293b;">Annual Church Meeting</h2>
        <p>Dear <strong>{firstName}</strong>,</p>
        <p>This is a friendly reminder of our upcoming <strong>Annual Church Meeting</strong> on <strong>{meetingDate}</strong> at <strong>{meetingTime}</strong>, held at <strong>{location}</strong>.<br/>
        Your participation is important as we reflect on the past year and plan for the future.</p>
        <p>Please mark your calendar and join us as we seek God's guidance together.</p>
        <blockquote style="border-left:4px solid #1e293b;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          "Plans fail for lack of counsel, but with many advisers they succeed."<br/>
          <span style="font-size:0.9em;">— Proverbs 15:22</span>
        </blockquote>
        <p>In His Service,<br/>{churchName} Leadership</p>
        <a href="#" style="background:linear-gradient(90deg,#1e293b,#64748b);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">View Agenda</a>
      </div>
    `,
    bibleVerse: "Proverbs 15:22",
    cta: "View Agenda",
  },
  {
    category: "Administrative Notices",
    name: "Giving Statement",
    purpose: "Send annual giving statements to members.",
    subjectLines: [
      "Your 2024 Giving Statement",
      "Annual Contribution Statement - {churchName}"
    ],
    audience: "Contributing members",
    tone: "Professional, grateful, informative",
    tags: ["{firstName}", "{year}", "{totalAmount}", "{churchName}"],
    bodyHtml: `
      <div style="font-family:Arial,sans-serif;">
        <h2 style="color:#0f172a;">Annual Giving Statement</h2>
        <p>Dear <strong>{firstName}</strong>,</p>
        <p>Thank you for your faithful generosity to <strong>{churchName}</strong> during {year}. Your contributions totaling <strong>${'$'}{totalAmount}</strong> have made a significant impact in advancing God's kingdom.</p>
        <p>Please find your detailed giving statement attached for your tax records. Your generosity enables us to continue our mission and ministry in the community.</p>
        <blockquote style="border-left:4px solid #0f172a;padding-left:12px;margin:16px 0;color:#555;font-style:italic;">
          "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."<br/>
          <span style="font-size:0.9em;">— 2 Corinthians 9:7</span>
        </blockquote>
        <p>With gratitude,<br/>The {churchName} Finance Team</p>
        <a href="#" style="background:linear-gradient(90deg,#0f172a,#475569);color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:16px;">Download Statement</a>
      </div>
    `,
    bibleVerse: "2 Corinthians 9:7",
    cta: "Download Statement",
  },
  // Add more templates as needed - truncated for brevity
];

interface RichHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onInsertTemplate: (html: string) => void;
  templates?: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  setSelectedTemplate: (template: EmailTemplate | null) => void;
}

export function RichHtmlEditor({ 
  value, 
  onChange, 
  onInsertTemplate, 
  templates = EMAIL_TEMPLATES, 
  selectedTemplate, 
  setSelectedTemplate 
}: RichHtmlEditorProps) {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Get available categories from templates
  const categories = ['All', ...new Set(templates?.map(t => t.category) || [])];
  
  // Filter templates based on search and category
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                         template.purpose.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Helper function to insert formatting at cursor position
  const insertFormatting = (startTag: string, endTag: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (selectedText) {
      // Wrap selected text
      newText = value.substring(0, start) + startTag + selectedText + endTag + value.substring(end);
    } else {
      // Insert tags at cursor position
      newText = value.substring(0, start) + startTag + endTag + value.substring(start);
    }
    
    onChange(newText);
    
    // Set cursor position after the start tag
    setTimeout(() => {
      const newCursorPos = selectedText ? start + startTag.length + selectedText.length + endTag.length : start + startTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  // Formatting functions
  const formatBold = () => insertFormatting('<strong>', '</strong>');
  const formatItalic = () => insertFormatting('<em>', '</em>');
  const formatUnderline = () => insertFormatting('<u>', '</u>');
  const formatH1 = () => insertFormatting('<h1>', '</h1>');
  const formatH2 = () => insertFormatting('<h2>', '</h2>');
  const formatLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      insertFormatting(`<a href="${url}">`, '</a>');
    }
  };
  const formatBulletList = () => insertFormatting('<ul><li>', '</li></ul>');
  const formatNumberedList = () => insertFormatting('<ol><li>', '</li></ol>');
  const formatParagraph = () => insertFormatting('<p>', '</p>');
  const formatLineBreak = () => insertFormatting('<br/>');

  return (
    <div className="rounded-xl bg-white/80 shadow-inner border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-4 pb-2 border-b border-gray-100">
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatBold} title="Bold">
          <b>B</b>
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatItalic} title="Italic">
          <i>I</i>
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatUnderline} title="Underline">
          <u>U</u>
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatH1} title="Heading 1">
          H1
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatH2} title="Heading 2">
          H2
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatParagraph} title="Paragraph">
          P
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatLineBreak} title="Line Break">
          ↵
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatBulletList} title="Bullet List">
          •
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatNumberedList} title="Numbered List">
          1.
        </Button>
        <Button size="icon" variant="ghost" type="button" className="hover:bg-violet-100" onClick={formatLink} title="Insert Link">
          🔗
        </Button>
      </div>

      {/* Modern Template Section */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Email Templates</h3>
              <p className="text-xs text-gray-500">Choose from professionally crafted templates</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplatePanel(!showTemplatePanel)}
            className="bg-white/80 hover:bg-white border-indigo-200 text-indigo-700 hover:text-indigo-800"
          >
            {showTemplatePanel ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Browse Templates
              </>
            )}
          </Button>
        </div>

        {/* Quick Template Actions */}
        {!showTemplatePanel && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 hover:bg-white/80 border-blue-200 text-blue-700 text-xs"
              onClick={() => {
                const welcomeTemplate = templates?.find(t => t.name.includes('Welcome'));
                if (welcomeTemplate) {
                  setSelectedTemplate(welcomeTemplate);
                  onInsertTemplate(welcomeTemplate.bodyHtml);
                }
              }}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v3.5M3 16.5h18" />
              </svg>
              Welcome
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 hover:bg-white/80 border-green-200 text-green-700 text-xs"
              onClick={() => {
                const eventTemplate = templates?.find(t => t.name.includes('Event'));
                if (eventTemplate) {
                  setSelectedTemplate(eventTemplate);
                  onInsertTemplate(eventTemplate.bodyHtml);
                }
              }}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Event
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/60 hover:bg-white/80 border-purple-200 text-purple-700 text-xs"
              onClick={() => {
                const announcementTemplate = templates?.find(t => t.name.includes('Announcement'));
                if (announcementTemplate) {
                  setSelectedTemplate(announcementTemplate);
                  onInsertTemplate(announcementTemplate.bodyHtml);
                }
              }}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcement
            </Button>
          </div>
        )}

        {/* Expanded Template Panel */}
        {showTemplatePanel && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Search and Filter Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                      placeholder="Search templates..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template Grid */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredTemplates.map((template, index) => (
                    <div
                      key={index}
                      className="group p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
                      onClick={() => {
                        setSelectedTemplate(template);
                        onInsertTemplate(template.bodyHtml);
                        setShowTemplatePanel(false);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-indigo-700 text-sm">
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {template.purpose}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="ml-2 text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {template.category.split(' ')[0]}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-xs text-gray-400">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.99 1.99 0 01-2-2V10a2 2 0 012-2h2" />
                            </svg>
                            {template.tone}
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {template.audience.split(',')[0]}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 h-auto text-xs"
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No templates found matching your search</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setTemplateSearch('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor Area */}
      <div className="p-4">
        <Textarea
          ref={textareaRef}
          className="w-full min-h-[200px] border-0 focus:ring-0 resize-none bg-transparent"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Write your message here..."
        />
      </div>
    </div>
  );
}
