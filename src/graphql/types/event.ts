/**
 * Event-related TypeScript definitions for the frontend application
 */

/**
 * Possible types of church events
 */
export enum EventType {
  SERVICE = 'SERVICE',
  MEETING = 'MEETING',
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  RETREAT = 'RETREAT',
  OUTREACH = 'OUTREACH',
  SOCIAL = 'SOCIAL',
  YOUTH = 'YOUTH',
  PRAYER = 'PRAYER',
  BIBLE_STUDY = 'BIBLE_STUDY',
  MUSIC = 'MUSIC',
  CHILDREN = 'CHILDREN',
  OTHER = 'OTHER',
}

/**
 * Status values for events and registrations
 */
export enum Status {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
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
  endDate: string | Date;
  location?: string;
  category?: string;
  branchId?: string;
  createdBy?: string;
  updatedBy?: string;
}


/**
 * Event Registration interface
 */
export interface EventRegistration {
  id: string;
  event: Event;
  member: Member;
  status: Status;
  registrationDate?: string | Date;
  checkInTime?: string | Date;
  checkOutTime?: string | Date;
  notes?: string;
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
  endDate: string | Date;
  location?: string;
  category?: string;
  branchId?: string;
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
}

/**
 * Input for creating a new event registration
 */
export interface CreateEventRegistrationInput {
  eventId: string;
  memberId: string;
  notes?: string;
}

/**
 * Helper type for calendar display
 */
export interface CalendarEvent extends Event {
  // Additional properties for calendar UI
  color?: string;
  allDay?: boolean;
  url?: string;
} // No changes needed here, inherits updated Event fields

