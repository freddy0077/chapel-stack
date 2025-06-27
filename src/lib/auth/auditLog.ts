"use server";

import { UserAuditEvent } from './types';

// In a real application, this would connect to your database
// For now, we'll use an in-memory store for demonstration
const auditEvents: UserAuditEvent[] = [];

/**
 * Logs an action performed by a user for audit purposes
 */
export async function logAuditEvent({
  userId,
  action,
  resource,
  resourceId,
  branchId,
  metadata = {}
}: {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  branchId?: string;
  metadata?: Record<string, unknown>;
}): Promise<UserAuditEvent> {
  // Create audit event object
  const event: UserAuditEvent = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    action,
    resource,
    resourceId,
    branchId,
    timestamp: new Date(),
    metadata,
    // In a real implementation, these would come from the request
    ipAddress: '127.0.0.1',
    userAgent: 'Example Browser'
  };

  // In a real app, this would be stored in your database
  auditEvents.push(event);
  
  // For demonstration, log to console
  console.log('AUDIT EVENT:', event);

  return event;
}

/**
 * Retrieves audit logs with filtering options
 */
export async function getAuditLogs({
  userId,
  resource,
  branchId,
  fromDate,
  toDate,
  limit = 100,
  offset = 0
}: {
  userId?: string;
  resource?: string;
  branchId?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}): Promise<UserAuditEvent[]> {
  // Filter events based on criteria
  let filtered = auditEvents;
  
  if (userId) {
    filtered = filtered.filter(event => event.userId === userId);
  }
  
  if (resource) {
    filtered = filtered.filter(event => event.resource === resource);
  }
  
  if (branchId) {
    filtered = filtered.filter(event => event.branchId === branchId);
  }
  
  if (fromDate) {
    filtered = filtered.filter(event => event.timestamp >= fromDate);
  }
  
  if (toDate) {
    filtered = filtered.filter(event => event.timestamp <= toDate);
  }
  
  // Sort by timestamp (newest first)
  filtered = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Apply pagination
  return filtered.slice(offset, offset + limit);
}

// Common audit actions
export const AuditActions = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  GRANT_ACCESS: 'grant_access',
  REVOKE_ACCESS: 'revoke_access',
  VIEW_SENSITIVE: 'view_sensitive',
  CHANGE_SETTING: 'change_setting',
};
