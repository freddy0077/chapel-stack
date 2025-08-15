/**
 * Event-related TypeScript definitions for the frontend application
 */

/**
 * Enhanced event types matching backend EventType enum
 */
export enum EventType {
  WORSHIP_SERVICE = 'WORSHIP_SERVICE',
  WEDDING = 'WEDDING',
  FUNERAL = 'FUNERAL',
  BAPTISM = 'BAPTISM',
  GRADUATION = 'GRADUATION',
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  RETREAT = 'RETREAT',
  FELLOWSHIP = 'FELLOWSHIP',
  YOUTH_EVENT = 'YOUTH_EVENT',
  CHILDREN_EVENT = 'CHILDREN_EVENT',
  PRAYER_MEETING = 'PRAYER_MEETING',
  BIBLE_STUDY = 'BIBLE_STUDY',
  COMMUNITY_SERVICE = 'COMMUNITY_SERVICE',
  FUNDRAISER = 'FUNDRAISER',
  CELEBRATION = 'CELEBRATION',
  MEETING = 'MEETING',
  OTHER = 'OTHER',
}

/**
 * Event status values matching backend EventStatus enum
 */
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * RSVP status values matching backend RSVPStatus enum
 */
export enum RSVPStatus {
  YES = 'YES',
  NO = 'NO',
  MAYBE = 'MAYBE',
  PENDING = 'PENDING',
}

/**
 * Event registration status values
 */
export enum EventRegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ATTENDING = 'ATTENDING',
  NOT_ATTENDING = 'NOT_ATTENDING',
  CANCELLED = 'CANCELLED',
}

/**
 * Member basic information
 */
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

/**
 * Branch information
 */
export interface Branch {
  id: string;
  name: string;
  location?: string;
}

/**
 * Main Event interface matching backend model
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string | Date;
  endDate?: string | Date;
  location?: string;
  category?: string;
  branchId?: string;
  organisationId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Enhanced event fields
  eventType: EventType;
  status: EventStatus;
  capacity?: number;
  registrationRequired: boolean;
  registrationDeadline?: string | Date;
  isPublic: boolean;
  requiresApproval: boolean;
  eventImageUrl?: string;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  isFree: boolean;
  ticketPrice?: number;
  currency?: string;

  // Relations
  branch?: Branch;
  attendanceRecords?: any[];
  eventRegistrations?: EventRegistration[];
  eventRSVPs?: EventRSVP[];
}

/**
 * Event Registration interface
 */
export interface EventRegistration {
  id: string;
  eventId: string;
  event?: Event;
  memberId?: string;
  member?: Member;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: EventRegistrationStatus;
  registrationDate: string | Date;
  numberOfGuests: number;
  specialRequests?: string;

  // Payment info (for paid events)
  amountPaid?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;

  // Approval workflow
  approvalStatus?: string;
  approvedBy?: string;
  approvalDate?: string | Date;
  rejectionReason?: string;

  // Metadata
  registrationSource?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Event RSVP interface for simple yes/no/maybe responses
 */
export interface EventRSVP {
  id: string;
  eventId: string;
  event?: Event;
  memberId?: string;
  member?: Member;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: RSVPStatus;
  rsvpDate: string | Date;
  numberOfGuests: number;
  message?: string;

  // Metadata
  rsvpSource?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Input for creating a new event
 */
export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: string | Date;
  endDate?: string | Date;
  location?: string;
  category?: string;
  branchId?: string;
  organisationId?: string;
  eventType: EventType;
  status: EventStatus;
  capacity?: number;
  registrationRequired: boolean;
  registrationDeadline?: string | Date;
  isPublic: boolean;
  requiresApproval: boolean;
  eventImageUrl?: string;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  isFree: boolean;
  ticketPrice?: number;
  currency?: string;
}

export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  location?: string;
  category?: string;
  branchId?: string;
  organisationId?: string;
  eventType?: EventType;
  status?: EventStatus;
  capacity?: number;
  registrationRequired?: boolean;
  registrationDeadline?: string | Date;
  isPublic?: boolean;
  requiresApproval?: boolean;
  eventImageUrl?: string;
  tags?: string[];
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  isFree?: boolean;
  ticketPrice?: number;
  currency?: string;
}

/**
 * Input for creating a new event registration
 */
export interface CreateEventRegistrationInput {
  eventId: string;
  memberId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  numberOfGuests: number;
  specialRequests?: string;
  registrationSource?: string;
  notes?: string;
}

/**
 * Input for updating an event registration
 */
export interface UpdateEventRegistrationInput {
  id: string;
  status?: EventRegistrationStatus;
  numberOfGuests?: number;
  specialRequests?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  approvalStatus?: string;
  rejectionReason?: string;
  notes?: string;
}

/**
 * Input for creating a new event RSVP
 */
export interface CreateEventRSVPInput {
  eventId: string;
  memberId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: RSVPStatus;
  numberOfGuests: number;
  message?: string;
  rsvpSource?: string;
}

/**
 * Input for updating an event RSVP
 */
export interface UpdateEventRSVPInput {
  id: string;
  status?: RSVPStatus;
  numberOfGuests?: number;
  message?: string;
}

/**
 * Helper type for calendar display
 */
export interface CalendarEvent extends Event {
  // Additional properties for calendar UI
  color?: string;
  allDay?: boolean;
  url?: string;
}
