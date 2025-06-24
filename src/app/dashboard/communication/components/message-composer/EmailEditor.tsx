"use client";

import { useState } from "react";
import { PaperClipIcon, DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BoldIcon, ItalicIcon, UnderlineIcon, ListBulletIcon, QueueListIcon, LinkIcon } from "@heroicons/react/24/solid";

// Simple toolbar button component
interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolbarButton = ({ icon, label, onClick, isActive }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-indigo-600' : 'text-gray-700'}`}
    title={label}
  >
    {icon}
  </button>
);

// Mock email templates
const emailTemplates = [
  { id: 1, name: "Welcome Email", subject: "Welcome to Our Church!", content: "<p>Dear [Name],</p><p>Welcome to our church community! We're delighted to have you join us.</p><p>Best regards,<br/>Church Team</p>" },
  { id: 2, name: "Event Invitation", subject: "You're Invited: [Event Name]", content: "<p>Dear [Name],</p><p>We'd like to invite you to our upcoming event: [Event Name].</p><p>Date: [Date]<br/>Time: [Time]<br/>Location: [Location]</p><p>We hope to see you there!</p><p>Best regards,<br/>Church Team</p>" },
  { id: 3, name: "Thank You", subject: "Thank You for Your Contribution", content: "<p>Dear [Name],</p><p>Thank you for your generous contribution to our church. Your support helps us continue our mission.</p><p>With gratitude,<br/>Church Team</p>" },
];

interface EmailEditorProps {
  subject: string;
  content: string;
  onChangeSubject: (subject: string) => void;
  onChangeContent: (content: string) => void;
}

export default function EmailEditor({ subject, content, onChangeSubject, onChangeContent }: EmailEditorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = parseInt(e.target.value);
    if (templateId) {
      const template = emailTemplates.find(t => t.id === templateId);
      if (template) {
        onChangeSubject(template.subject);
        onChangeContent(template.content);
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Track if the user is adding a link
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  
  // Helper function to insert text at cursor position or replace selection
  const insertTextAtCursor = (textBefore: string, textAfter: string = '') => {
    const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = textarea.value.substring(0, start) + 
                    textBefore + 
                    selectedText + 
                    textAfter + 
                    textarea.value.substring(end);
    
    onChangeContent(newText);
    
    // Set cursor position after the operation
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + textBefore.length + selectedText.length,
        start + textBefore.length + selectedText.length
      );
    }, 0);
  };
  
  // Format handlers
  const handleBold = () => insertTextAtCursor('<strong>', '</strong>');
  const handleItalic = () => insertTextAtCursor('<em>', '</em>');
  const handleUnderline = () => insertTextAtCursor('<u>', '</u>');
  const handleBulletList = () => insertTextAtCursor('<ul>\n<li>', '</li>\n</ul>');
  const handleOrderedList = () => insertTextAtCursor('<ol>\n<li>', '</li>\n</ol>');
  
  const handleAddLink = () => {
    if (isAddingLink) {
      // Insert the link
      if (linkUrl) {
        const linkHtml = `<a href="${linkUrl}">${linkText || linkUrl}</a>`;
        insertTextAtCursor(linkHtml);
      }
      // Reset link state
      setIsAddingLink(false);
      setLinkUrl('');
      setLinkText('');
    } else {
      // Start adding a link
      setIsAddingLink(true);
      // Get selected text for link text
      const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
      if (textarea) {
        const selectedText = textarea.value.substring(
          textarea.selectionStart,
          textarea.selectionEnd
        );
        if (selectedText) {
          setLinkText(selectedText);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Template selector */}
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-gray-700">
          Email Template
        </label>
        <select
          id="template"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleTemplateSelect}
          defaultValue=""
        >
          <option value="">Select a template</option>
          {emailTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Subject line */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => onChangeSubject(e.target.value)}
          required
        />
      </div>
      
      {/* Simple rich text editor */}
      <div>
        <label htmlFor="email-content" className="block text-sm font-medium text-gray-700 mb-1">
          Message Content
        </label>
        
        {/* Formatting toolbar */}
        <div className="flex items-center space-x-1 p-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md">
          <ToolbarButton 
            icon={<BoldIcon className="h-4 w-4" />} 
            label="Bold" 
            onClick={handleBold} 
          />
          <ToolbarButton 
            icon={<ItalicIcon className="h-4 w-4" />} 
            label="Italic" 
            onClick={handleItalic} 
          />
          <ToolbarButton 
            icon={<UnderlineIcon className="h-4 w-4" />} 
            label="Underline" 
            onClick={handleUnderline} 
          />
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <ToolbarButton 
            icon={<ListBulletIcon className="h-4 w-4" />} 
            label="Bullet List" 
            onClick={handleBulletList} 
          />
          <ToolbarButton 
            icon={<QueueListIcon className="h-4 w-4" />} 
            label="Numbered List" 
            onClick={handleOrderedList} 
          />
          <div className="h-4 w-px bg-gray-300 mx-1"></div>
          <ToolbarButton 
            icon={<LinkIcon className="h-4 w-4" />} 
            label="Insert Link" 
            onClick={handleAddLink}
            isActive={isAddingLink} 
          />
        </div>
        
        {/* Link insertion UI */}
        {isAddingLink && (
          <div className="p-2 bg-indigo-50 border border-indigo-200 border-b-0">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Link text"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <input
                type="url"
                placeholder="https://example.com"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <button
                type="button"
                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                onClick={handleAddLink}
              >
                Insert
              </button>
            </div>
          </div>
        )}
        
        {/* Text area for content */}
        <textarea
          id="email-content"
          className="block w-full rounded-t-none rounded-b-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[200px]"
          placeholder="Compose your email message..."
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
        />
        
        <p className="mt-1 text-xs text-gray-500">
          You can use HTML tags for formatting. The email will be rendered with proper formatting when sent.
        </p>
      </div>
      
      {/* Attachments */}
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attachments
        </label>
        <div className="flex items-center">
          <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PaperClipIcon className="h-4 w-4 inline mr-1" />
            Attach File
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
          {selectedFile && (
            <div className="ml-3 flex items-center text-sm text-gray-500">
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              {selectedFile.name}
              <button 
                type="button" 
                className="ml-1 text-gray-400 hover:text-gray-500"
                onClick={() => setSelectedFile(null)}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
