import { Branch, Reminder, Newsletter, NewsletterTemplate, InterBranchMessage } from './types';

// Mock branches for demonstration purposes
export const mockBranches: Branch[] = [
  {
    id: 1,
    name: 'Main Campus',
    location: '123 Main Street, Cityville',
    contactEmail: 'main@churchdomain.com',
    contactPhone: '(555) 123-4567'
  },
  {
    id: 2,
    name: 'East Side Campus',
    location: '456 East Avenue, Cityville',
    contactEmail: 'eastside@churchdomain.com',
    contactPhone: '(555) 234-5678'
  },
  {
    id: 3,
    name: 'West Side Campus',
    location: '789 West Boulevard, Cityville',
    contactEmail: 'westside@churchdomain.com',
    contactPhone: '(555) 345-6789'
  },
  {
    id: 4,
    name: 'North County Campus',
    location: '101 North Road, Northtown',
    contactEmail: 'north@churchdomain.com',
    contactPhone: '(555) 456-7890'
  }
];

// Mock reminders for birthday and anniversary notifications
export const mockReminders: Reminder[] = [
  {
    id: 1,
    title: 'Member Birthday Reminders',
    type: 'Birthday',
    description: 'Send birthday wishes to church members',
    date: 'Daily at 8:00 AM',
    recurring: true,
    for: 'Member',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    notificationChannel: ['Email', 'SMS'],
    daysInAdvance: 1,
    status: 'Active',
    customMessage: 'Happy Birthday from your church family! May God bless you abundantly in the coming year.'
  },
  {
    id: 2,
    title: 'Wedding Anniversary Reminders',
    type: 'Anniversary',
    description: 'Send anniversary congratulations to married couples',
    date: 'Daily at 8:00 AM',
    recurring: true,
    for: 'Member',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    notificationChannel: ['Email'],
    daysInAdvance: 3,
    status: 'Active',
    customMessage: 'Happy Anniversary! Congratulations on another year of marriage. May God continue to bless your union.'
  },
  {
    id: 3,
    title: 'Staff Meeting Reminder',
    type: 'Meeting',
    description: 'Weekly staff meeting reminder',
    date: 'Every Monday at 9:00 AM',
    recurring: true,
    for: 'Staff',
    targetBranches: ['Main Campus'],
    notificationChannel: ['Email', 'App'],
    daysInAdvance: 1,
    status: 'Active'
  },
  {
    id: 4,
    title: 'Volunteer Appreciation Event',
    type: 'Event',
    description: 'Annual volunteer appreciation dinner',
    date: '2023-06-15T18:00:00',
    recurring: false,
    for: 'Group',
    memberGroup: 'Volunteers',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    notificationChannel: ['Email', 'SMS', 'App'],
    daysInAdvance: 7,
    status: 'Active'
  },
  {
    id: 5,
    title: 'Baptism Anniversary',
    type: 'Anniversary',
    description: 'Celebrate baptism anniversaries',
    date: 'Daily at 8:00 AM',
    recurring: true,
    for: 'Member',
    targetBranches: ['East Side Campus'],
    notificationChannel: ['Email'],
    daysInAdvance: 5,
    status: 'Active',
    customMessage: 'Happy Baptism Anniversary! Remembering the day you publicly declared your faith in Christ.'
  }
];

// Mock newsletters
export const mockNewsletters: Newsletter[] = [
  {
    id: 1,
    title: 'Weekly Church Update',
    content: '<p>This week at our church...</p><p>Join us for special services...</p>',
    author: 'Communications Team',
    templateId: 1,
    createdDate: '2023-05-10',
    scheduledDate: '2023-05-12',
    sentDate: '2023-05-12',
    status: 'Sent',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    recipients: {
      count: 450,
      groups: ['All Members']
    },
    openRate: 68,
    clickRate: 32
  },
  {
    id: 2,
    title: 'East Side Campus Summer Activities',
    content: '<p>Summer activities at East Side Campus...</p><p>Sign up for vacation bible school...</p>',
    author: 'East Side Pastor',
    templateId: 2,
    createdDate: '2023-05-15',
    scheduledDate: '2023-05-20',
    status: 'Scheduled',
    targetBranches: ['East Side Campus'],
    recipients: {
      count: 120,
      groups: ['East Side Members', 'East Side Visitors']
    }
  },
  {
    id: 3,
    title: 'Youth Ministry Newsletter',
    content: '<p>Youth events coming up...</p><p>Youth camp registration now open...</p>',
    author: 'Youth Pastor',
    templateId: 3,
    createdDate: '2023-05-08',
    status: 'Draft',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    recipients: {
      count: 85,
      groups: ['Youth Group', 'Parents']
    }
  },
  {
    id: 4,
    title: 'Missions Update',
    content: '<p>Our recent mission trip to Guatemala...</p><p>Upcoming mission opportunities...</p>',
    author: 'Missions Director',
    templateId: 1,
    createdDate: '2023-05-01',
    scheduledDate: '2023-05-05',
    sentDate: '2023-05-05',
    status: 'Sent',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    recipients: {
      count: 320,
      groups: ['All Members']
    },
    openRate: 75,
    clickRate: 45
  }
];

// Mock newsletter templates
export const mockNewsletterTemplates: NewsletterTemplate[] = [
  {
    id: 1,
    name: 'Standard Weekly Update',
    description: 'Template for weekly church updates',
    layout: 'single-column',
    createdBy: 'Admin',
    createdDate: '2023-01-15',
    lastModified: '2023-03-20',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    sections: [
      {
        id: 1,
        name: 'Header',
        type: 'Image',
        imageUrl: '/images/newsletters/header.jpg'
      },
      {
        id: 2,
        name: 'Welcome Message',
        type: 'Text',
        content: '<h2>Welcome to our weekly update!</h2><p>Stay informed about what\'s happening at our church.</p>'
      },
      {
        id: 3,
        name: 'Main Content',
        type: 'Text',
        content: '<h3>This Week\'s Events</h3><p>Content goes here...</p>'
      },
      {
        id: 4,
        name: 'Call to Action',
        type: 'Button',
        content: 'Register Now'
      },
      {
        id: 5,
        name: 'Footer',
        type: 'Text',
        content: '<p>Contact us at info@church.com | (555) 123-4567</p>'
      }
    ]
  },
  {
    id: 2,
    name: 'Branch Specific Template',
    description: 'Template for branch-specific announcements',
    layout: 'two-column',
    createdBy: 'Admin',
    createdDate: '2023-02-10',
    lastModified: '2023-04-15',
    targetBranches: ['East Side Campus', 'West Side Campus', 'North County Campus'],
    sections: [
      {
        id: 1,
        name: 'Branch Header',
        type: 'Image',
        imageUrl: '/images/newsletters/branch-header.jpg'
      },
      {
        id: 2,
        name: 'Branch Welcome',
        type: 'Text',
        content: '<h2>News from [Branch Name]</h2><p>Stay connected with your local campus.</p>'
      },
      {
        id: 3,
        name: 'Left Column',
        type: 'Text',
        content: '<h3>Upcoming Events</h3><p>Content goes here...</p>'
      },
      {
        id: 4,
        name: 'Right Column',
        type: 'Text',
        content: '<h3>Branch Announcements</h3><p>Content goes here...</p>'
      },
      {
        id: 5,
        name: 'Branch Contact',
        type: 'Text',
        content: '<p>Contact your branch at [branch_email] | [branch_phone]</p>'
      }
    ]
  },
  {
    id: 3,
    name: 'Ministry Specific Template',
    description: 'Template for ministry departments',
    layout: 'single-column',
    createdBy: 'Admin',
    createdDate: '2023-03-01',
    lastModified: '2023-04-01',
    targetBranches: ['Main Campus', 'East Side Campus', 'West Side Campus', 'North County Campus'],
    sections: [
      {
        id: 1,
        name: 'Ministry Header',
        type: 'Image',
        imageUrl: '/images/newsletters/ministry-header.jpg'
      },
      {
        id: 2,
        name: 'Ministry Title',
        type: 'Text',
        content: '<h2>[Ministry Name] Updates</h2>'
      },
      {
        id: 3,
        name: 'Ministry Content',
        type: 'Text',
        content: '<p>Content goes here...</p>'
      },
      {
        id: 4,
        name: 'Ministry Contact',
        type: 'Text',
        content: '<p>Contact [ministry_leader] at [email]</p>'
      }
    ]
  }
];

// Mock inter-branch messages for staff collaboration
export const mockInterBranchMessages: InterBranchMessage[] = [
  {
    id: 1,
    subject: 'Coordinating Easter Services',
    content: 'We need to coordinate the Easter service times across all branches to ensure consistent messaging in our marketing materials.',
    sender: {
      name: 'Pastor Johnson',
      branch: 'Main Campus',
      role: 'Senior Pastor'
    },
    recipients: {
      branches: ['East Side Campus', 'West Side Campus', 'North County Campus'],
      roles: ['Campus Pastor', 'Worship Director']
    },
    dateSent: '2023-05-10T09:15:00',
    dateRead: '2023-05-10T10:30:00',
    status: 'Read',
    priority: 'High',
    responses: [
      {
        id: 101,
        content: 'East Side Campus can do 9:00 AM and 11:00 AM services.',
        sender: {
          name: 'Pastor Williams',
          branch: 'East Side Campus',
          role: 'Campus Pastor'
        },
        dateSent: '2023-05-10T10:45:00'
      },
      {
        id: 102,
        content: 'West Side Campus can do 8:30 AM, 10:00 AM, and 11:30 AM services.',
        sender: {
          name: 'Pastor Davis',
          branch: 'West Side Campus',
          role: 'Campus Pastor'
        },
        dateSent: '2023-05-10T11:20:00'
      }
    ]
  },
  {
    id: 2,
    subject: 'Volunteer Sharing for Summer Event',
    content: 'We need additional volunteers for the summer festival. Can any branches share volunteers for this all-church event?',
    sender: {
      name: 'Sarah Thompson',
      branch: 'Main Campus',
      role: 'Events Coordinator'
    },
    recipients: {
      branches: ['East Side Campus', 'West Side Campus', 'North County Campus'],
      roles: ['Volunteer Coordinator']
    },
    dateSent: '2023-05-12T14:30:00',
    status: 'Delivered',
    priority: 'Medium',
    attachments: [
      {
        name: 'volunteer-needs.pdf',
        type: 'application/pdf',
        url: '/attachments/volunteer-needs.pdf'
      }
    ]
  },
  {
    id: 3,
    subject: 'Shared Resources for VBS',
    content: 'We have extra VBS materials at North County Campus. Let me know if any other branches can use them.',
    sender: {
      name: 'Michael Brown',
      branch: 'North County Campus',
      role: 'Children\'s Director'
    },
    recipients: {
      branches: ['Main Campus', 'East Side Campus', 'West Side Campus'],
      roles: ['Children\'s Director']
    },
    dateSent: '2023-05-14T11:00:00',
    dateRead: '2023-05-14T13:15:00',
    status: 'Read',
    priority: 'Low',
    attachments: [
      {
        name: 'vbs-inventory.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/attachments/vbs-inventory.xlsx'
      }
    ],
    responses: [
      {
        id: 201,
        content: 'East Side Campus could use the extra craft supplies if they\'re still available.',
        sender: {
          name: 'Jessica Miller',
          branch: 'East Side Campus',
          role: 'Children\'s Director'
        },
        dateSent: '2023-05-14T13:45:00'
      }
    ]
  },
  {
    id: 4,
    subject: 'Budget Coordination for Q3',
    content: 'Please submit your Q3 budget requests by the end of this week so we can finalize the all-church budget.',
    sender: {
      name: 'Robert Taylor',
      branch: 'Main Campus',
      role: 'Finance Director'
    },
    recipients: {
      branches: ['East Side Campus', 'West Side Campus', 'North County Campus'],
      roles: ['Campus Pastor', 'Finance Manager']
    },
    dateSent: '2023-05-15T09:00:00',
    status: 'Sent',
    priority: 'Urgent',
    attachments: [
      {
        name: 'budget-template-q3.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/attachments/budget-template-q3.xlsx'
      }
    ]
  }
];
