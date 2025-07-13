# Chapel Stack Communication Module

A comprehensive multi-channel communication system for church management, supporting email, SMS, in-app messaging, and push notifications.

## Features Overview

### Completed Features

1. **UI Modernization**:
   - ✅ Redesigned MessageModal with gradient header and improved message details display
   - ✅ Enhanced NewMessageModal with gradient headers based on message type
   - ✅ Updated MessageTypeSelector with gradient buttons and hover effects
   - ✅ Improved MessageScheduler with gradient switch and better date/time pickers
   - ✅ Fixed and modernized TemplateSelector with improved UI and error handling

2. **Basic Messaging Functionality**:
   - ✅ Support for multiple message types (Email, SMS, Notifications)
   - ✅ Message composition interface
   - ✅ Basic recipient selection (individuals and groups)
   - ✅ Message scheduling capabilities
   - ✅ Template selection for emails

### Features In Progress

1. **Advanced Targeting Features**:
   - 🔄 Targeting based on roles (pastors, ushers, elders, members)
   - 🔄 Targeting based on activity level (active, inactive, first-time visitors)
   - 🔄 Targeting based on attendance history and events

2. **Automated Messaging**:
   - 🔄 Automated messages for birthdays, anniversaries, missed services
   - 🔄 Campaign management for events like revivals, conferences, fundraising

3. **Two-way Conversations**:
   - 🔄 Interface for two-way conversations between admin/staff and members
   - 🔄 Conversation history and threading

4. **Media Attachments**:
   - 🔄 Support for uploading and attaching images, PDFs, audio clips

5. **Analytics Dashboard**:
   - 🔄 Comprehensive analytics beyond basic stats
   - 🔄 Detailed open rates, click-throughs, bounce reports
   - 🔄 Visual charts and graphs for message performance

6. **Permissions and Access Control**:
   - 🔄 Role-based permissions for message sending
   - 🔄 Access control for who can message whom

7. **External Integrations**:
   - 🔄 Integration with Twilio (SMS)
   - 🔄 Integration with Mailgun or SendGrid (Email)
   - 🔄 Integration with Firebase Cloud Messaging (Push)
   - 🔄 Optional WhatsApp Business API integration

8. **Audit and Compliance**:
   - 🔄 Audit logs for message sending
   - 🔄 Complete message history and archiving

## Technical Specifications

### Frontend Components

1. **Message Composition**:
   - MessageTypeSelector: Toggle between email, SMS, and notification types
   - RecipientSelector: Select individuals or groups to receive messages
   - MessageComposer: Rich text editor for composing message content
   - TemplateSelector: Select from pre-defined message templates
   - MessageScheduler: Schedule messages for future delivery
   - MediaAttachmentUploader: Upload and attach media files

2. **Message Management**:
   - MessageList: Display sent and scheduled messages
   - MessageModal: View detailed information about a message
   - ConversationView: Two-way messaging interface

3. **Analytics**:
   - MessageStats: Display message performance metrics
   - AnalyticsDashboard: Comprehensive analytics with charts and graphs

4. **Administration**:
   - IntegrationSettings: Configure external service integrations
   - PermissionSettings: Manage role-based access control
   - AutomationRules: Set up automated messaging rules

### Backend Services

1. **Message Processing**:
   - Message queue for scheduled and bulk messages
   - Delivery status tracking and retries
   - Rate limiting to prevent spam

2. **External Integrations**:
   - Twilio API for SMS
   - Mailgun/SendGrid for Email
   - Firebase Cloud Messaging for push notifications
   - WhatsApp Business API (optional)

3. **Data Storage**:
   - Message content and metadata
   - Delivery status and analytics
   - Templates and automation rules
   - Audit logs

## Implementation Roadmap

### Phase 1: Core Messaging (Completed)
- ✅ Basic UI components for message composition
- ✅ Support for multiple message types
- ✅ Basic recipient selection
- ✅ Message scheduling

### Phase 2: Advanced Targeting (Next)
- 🔄 Enhanced recipient selector with role-based filtering
- 🔄 Activity-based targeting
- 🔄 Attendance-based targeting

### Phase 3: Automation and Media
- 🔄 Automated messaging system
- 🔄 Campaign management
- 🔄 Media attachment support

### Phase 4: Two-way Messaging
- 🔄 Conversation interface
- 🔄 Real-time messaging
- 🔄 Message threading

### Phase 5: Analytics and Administration
- 🔄 Enhanced analytics dashboard
- 🔄 Permission management
- 🔄 Audit logging

### Phase 6: External Integrations
- 🔄 Twilio integration
- 🔄 Email service integration
- 🔄 Push notification integration
- 🔄 WhatsApp integration (optional)

## Design Guidelines

- Use gradient headers with colors corresponding to message types:
  - Email: Blue gradients
  - SMS: Purple gradients
  - Notifications: Amber gradients
- Consistent card layouts with proper spacing and shadows
- Interactive elements with hover effects and transitions
- Accessible UI components from Chapel Stack UI library
- Responsive design for all screen sizes

## Usage

The Communication module is accessible from the main dashboard at `/dashboard/communication`. 
Admin settings for the module are available at `/dashboard/settings/communication`.

## Dependencies

- React and React DOM (v19)
- Tailwind CSS for styling
- class-variance-authority for component variants
- date-fns for date formatting and manipulation
- react-day-picker for calendar functionality
- Radix UI primitives for accessible components
- GraphQL for data fetching and mutations
