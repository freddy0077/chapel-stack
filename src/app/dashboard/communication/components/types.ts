// Define types for our components
export interface Message {
  id: number;
  subject: string;
  content: string;
  sender: string;
  recipients: string[];
  dateSent: string;
  status: 'Read' | 'Unread';
  date: string; // For UI display
  channel: string; // Communication channel
  type: string; // Message type
  count: number; // Message count
  deliveryRate: number; // Delivery success rate
  targetBranches?: string[]; // For branch-specific targeting
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  startDate?: string;
  endDate?: string;
  status: 'Active' | 'Scheduled' | 'Archived';
  priority?: 'Low' | 'Medium' | 'High';
  visibleTo?: string[];
  targetBranches?: string[]; // For branch-specific targeting
}

export interface PrayerRequest {
  id: number;
  title: string;
  content: string;
  requester: string;
  date: string;
  status: 'New' | 'Praying' | 'Answered';
  prayingCount?: number;
  type?: string; // Prayer request type
  category?: string; // Prayer request category
  isPrivate?: boolean;
  prayerCount?: number;
}

export interface HeaderProps {
  onSearch: (query: string) => void;
  onNewMessage?: () => void;
  onNewAnnouncement?: () => void;
}

export interface StatsProps {
  stats: {
    totalMessages: number;
    totalAnnouncements: number;
    prayerRequests: number;
    deliveryRate: number;
  };
}

export interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface MessagesListProps {
  messages: Message[];
  onViewMessage: (message: Message) => void;
  onNewMessage: () => void;
}

export interface AnnouncementsListProps {
  announcements: Announcement[];
  onViewAnnouncement: (announcement: Announcement) => void;
  onNewAnnouncement: () => void;
}

export interface PrayerRequestsListProps {
  prayerRequests: PrayerRequest[];
  onViewPrayerRequest: (prayerRequest: PrayerRequest) => void;
  onNewPrayerRequest: () => void;
}

export interface MessageModalProps {
  message: Message | null;
  onClose: () => void;
}

export interface AnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
}

export interface PrayerRequestModalProps {
  prayerRequest: PrayerRequest | null;
  onClose: () => void;
}

// New interfaces for branch targeting and reminders
export interface Branch {
  id: number;
  name: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
}

export interface Reminder {
  id: number;
  title: string;
  type: 'Birthday' | 'Anniversary' | 'Event' | 'Meeting' | 'Other';
  description: string;
  date: string;
  recurring: boolean;
  for: 'Member' | 'Group' | 'Staff' | 'All';
  memberName?: string;
  memberGroup?: string;
  targetBranches: string[];
  notificationChannel: ('Email' | 'SMS' | 'App')[];
  daysInAdvance: number;
  status: 'Active' | 'Paused' | 'Completed';
  customMessage?: string;
}

export interface Newsletter {
  id: number;
  title: string;
  content: string;
  author: string;
  templateId?: number;
  createdDate: string;
  scheduledDate?: string;
  sentDate?: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  targetBranches: string[];
  recipients: {
    count: number;
    groups: string[];
  };
  openRate?: number;
  clickRate?: number;
}

export interface NewsletterTemplate {
  id: number;
  name: string;
  description: string;
  layout: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  targetBranches: string[];
  sections: {
    id: number;
    name: string;
    type: 'Text' | 'Image' | 'Button' | 'Divider' | 'Spacer';
    content?: string;
    imageUrl?: string;
  }[];
}

export interface InterBranchMessage {
  id: number;
  subject: string;
  content: string;
  sender: {
    name: string;
    branch: string;
    role: string;
  };
  recipients: {
    branches: string[];
    roles?: string[];
  };
  dateSent: string;
  dateRead?: string;
  status: 'Sent' | 'Delivered' | 'Read';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  responses?: {
    id: number;
    content: string;
    sender: {
      name: string;
      branch: string;
      role: string;
    };
    dateSent: string;
  }[];
}
