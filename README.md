# Church Management System

A comprehensive church management solution built for Catholic churches using Next.js, designed to streamline administrative tasks, improve member engagement, and enhance ministry operations across multiple church branches/parishes.

## Objectives of the System

The Church Management System aims to:

1. **Centralize member records and attendance tracking across all branches**
2. **Simplify event and service scheduling for multiple parishes/branches**
3. **Streamline tithes, offerings, and financial reporting with branch-specific accounting**
4. **Facilitate communication with members** (SMS, email, etc.) at both diocesan and branch levels
5. **Manage volunteer and ministry team activities across all locations**
6. **Provide secure access** for staff, leaders, and members with branch-specific permissions
7. **Track baptism, first communion & marriage records with standardized formats across branches**
8. **Manage children & youth ministry check-ins at each location**
9. **Provide analytics & reporting** for attendance, giving, and engagement with comparison across branches

## Core Features

### Multi-Branch Management
- Centralized administration with branch-specific access controls
- Branch/parish profile management and customization
- Resource sharing and coordination between branches
- Transfer of members between branches with complete record history
- Consolidated reporting across all branches with branch filtering
- Diocese-level, regional, and branch-level administrative roles

### Member Database
- Member profiles (contact info, birthdays, family connections)
- Branch affiliation with ability to track members who attend multiple branches
- Attendance history and spiritual milestones across all branches
- Family and household grouping
- Member status tracking (active, inactive, visitor, etc.)
- Transfer protocols for members moving between branches


### Attendance Tracking
- Monitor attendance for services, events, and small groups across all branches
- Branch-specific and consolidated attendance reports
- Comparative attendance metrics between branches
- Check-in/check-out system (especially for children's ministry) for each location
- Track visitor flow between different branches

### Sacramental Records
- Baptism, First Communion, and Confirmation tracking
- Marriage records with certificate uploads
- Anniversary tracking for all spiritual milestones
- Standardized sacramental record formats across all branches
- Certificate generation with branch-specific letterheads
- Centralized record repository with access controls by branch

### Financial Management
- Record tithes and offerings with branch-specific accounting
- Generate giving statements and reports for each branch
- Consolidated financial reporting at diocesan/organizational level
- Track pledges and fundraising campaigns by branch or across multiple branches
- Branch-specific budgeting and expense tracking
- Offering count and bank reconciliation for each location
- Financial reporting and audit-ready records with branch segmentation
- Resource allocation and fund distribution between branches

### Event & Service Management
- Unified calendar showing events for all branches with filtering options
- Branch-specific calendars for local events and services
- Cross-branch event coordination and promotion
- Volunteer sign-ups and team scheduling for each location
- Resource booking (rooms, equipment) with inventory tracking per branch
- Event templates that can be shared across branches

### Communication Tools
- Mass email and SMS functionality with branch targeting options
- Organization-wide and branch-specific communication channels
- Notifications and reminders for events and meetings
- Birthday and anniversary reminders customizable by branch
- Group or individual messaging within or across branches
- Newsletter integration with branch-specific templates
- Inter-branch communication tools for staff collaboration

### Volunteer & Staff Management
- Track roles, availability, and participation across all branches
- Branch-specific volunteer teams with potential for sharing across locations
- Background checks and training status tracking with centralized records
- Assign and manage responsibilities with branch context
- Staff directory for all branches with role-based filtering
- Volunteer recognition and service tracking across multiple branches

### Reports & Analytics
- Membership growth trends with branch comparisons
- Consolidated and branch-specific giving and attendance reports
- Cross-branch ministry engagement tracking
- Customizable dashboards for each branch and for organizational leadership
- Branch performance metrics and benchmarking
- Migration patterns of members between branches

### Security & Access Control
- Multi-tiered access: organizational admins, branch admins, pastoral staff, ministry leaders, and members
- Branch-specific role-based access control for privacy and security
- Cross-branch access permissions for diocesan/organizational leadership
- Audit trails for sensitive actions with branch context
- Data isolation between branches where appropriate
- Configurable data sharing policies between branches

### Authentication & User Management
- Modern, secure authentication system with multi-factor authentication support
- Role-based access control with granular permissions
- Branch-specific login and access management
- Secure password management with password history and complexity requirements
- Social login integration options (Google, Facebook, Apple)
- Single Sign-On (SSO) capabilities for organizational integration
- Self-service password reset and account recovery
- Email verification and secure invitation workflow
- Session management with idle timeout and device tracking
- Fine-grained permission controls for different user types
- Comprehensive user activity logging and suspicious activity alerts

## Advanced Features

### Small Groups / Ministry Management
- Create and manage small groups or ministries
- Assign leaders and track attendance
- Communication tools for group leaders

### Sermon Archive / Media Library
- Upload and manage sermon videos, audio, and notes
- Categorize by series, speaker, or date
- Stream or download options for members

### Visitor & Follow-Up Management
- Track visitor information and visits
- Automated follow-up sequences
- Assign follow-up tasks to pastors or leaders

### Mobile App Integration
- Access member directories, sermons, events, and giving tools on mobile
- Member login with personalized access

### Website Integration
- Sync events, sermons, and giving options with church website
- Online forms for registration, prayer requests, etc.

### Content Management System
- Multi-content type support for sermons, events, announcements, and ministry information
- Rich media management with centralized asset library and automated transcoding
- Branch-specific content permissions and publishing workflows
- Visitor information and follow-up sequence management
- Mobile-optimized content delivery with personalized member access
- Small group resource libraries and curriculum management
- Sacramental records content types with certificate templates
- Ministry-specific content collections with leader access controls
- Two-way website synchronization for events, sermons, and forms
- Content performance metrics focused on ministry impact

## Onboarding Experience

An interactive onboarding flow guides new users through key features of the system:

### Core System Features

1. **Multi-Branch Management**
   - Introduction to branch-specific dashboards
   - How to navigate between different church locations
   - Setting branch-specific permissions

2. **Member Directory**
   - How to add and manage member profiles
   - Family relationship mapping
   - Member communication preferences
   - Custom fields for member data

3. **Attendance Tracking**
   - Event and service attendance recording
   - Child check-in/check-out system
   - Statistical reporting and trends
   - Member card scanning system with wall-mounted devices
   - Real-time attendance registration upon scan
   - Family check-in capabilities (scan once for multiple members)
   - Personalized RFID/NFC cards for members
   - QR code alternatives for visitors
   - Multi-location and branch-specific attendance tracking
   - Absence alerts for regular members missing multiple services
   - Attendance pattern analysis and visualizations
   - Late arrival and early departure tracking
   - Offline mode during network disruptions
   - Self-service check-in kiosks for high-traffic areas
   - Progressive Web App for mobile card scanning:
     - Modern, minimalist interface optimized for touch
     - Works across devices (mobile, tablet, desktop)
     - Uses Web NFC API for compatible devices
     - Camera-based QR code scanning fallback
     - Offline queue for attendance records during connectivity issues
     - Immediate visual feedback with member information
     - Support for continuous scanning mode
     - Installable on home screens for quick access

4. **Group Management**
   - Creating and managing small groups
   - Group leader assignment
   - Group attendance tracking
   - Group communication tools

### Media & Communication

5. **Sermon Archive**
   - Uploading and categorizing sermon media
   - Managing video, audio, and notes
   - Series and speaker organization
   - Media delivery options

6. **Media Asset Library**
   - Centralized media management
   - Automatic media transcoding
   - Asset organization and tagging
   - Branch-specific media access

7. **Communication Tools**
   - Multi-channel messaging (email, SMS, app)
   - Targeted audience selection
   - Communication templates
   - Automated follow-up sequences

### Administration

8. **Calendar & Events**
   - Event creation and registration
   - Room booking and resource allocation
   - Event check-in and attendance

9. **Volunteer Management**
   - Volunteer recruitment and scheduling
   - Skill and interest matching
   - Background check tracking
   - Service hour tracking

10. **Finances**
    - Donation tracking and reporting
    - Budget management
    - Financial reporting
    - Donor statements

11. **Security & Access Control**
    - Role-based permissions
    - Multi-tiered authentication
    - Branch-specific access controls
    - Audit logging

### Integration Features

12. **Mobile App Integration**
    - Member app access
    - Mobile content delivery
    - Push notifications
    - Mobile giving

13. **Website Integration**
    - Content synchronization
    - Event publishing
    - Sermon publishing
    - Online forms

## Implementation Timeline

1. **Phase 1 – Needs Assessment & Planning**
2. **Phase 2 – Design & Development**
3. **Phase 3 – Testing & Feedback**
4. **Phase 4 – Training & Deployment**
5. **Phase 5 – Ongoing Support & Updates**

## Benefits to the Church

1. Improved administrative efficiency
2. Better member care and engagement
3. Transparent and accountable financial tracking
4. Empowered ministry teams
5. A modern and scalable digital infrastructure

## Technical Details

This is a [Next.js](https://nextjs.org) project with:
- TypeScript for type safety
- Tailwind CSS for styling
- Modern component-based architecture
- Responsive design for all devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
