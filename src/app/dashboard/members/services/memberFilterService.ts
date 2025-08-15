import { Member, MemberFilters } from '../types/member.types';

export class MemberFilterService {
  /**
   * Extract filters that should be sent to the backend API
   * ALL filters are now backend-powered for better performance and scalability
   */
  static extractBackendFilters(filters: MemberFilters): any {
    const backendFilters: any = {};

    // Only add non-empty, non-null values
    if (filters.branchId) backendFilters.branchId = filters.branchId;
    if (filters.organisationId) backendFilters.organisationId = filters.organisationId;
    if (filters.hasMemberId !== undefined) backendFilters.hasMemberId = filters.hasMemberId;
    if (filters.search) backendFilters.search = filters.search;
    
    // Handle array filters - only include if array has valid, non-null values
    if (filters.gender && filters.gender.length > 0) {
      const validGender = filters.gender.filter(g => g != null && g !== '');
      if (validGender.length > 0) backendFilters.gender = validGender;
    }
    
    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      const validMaritalStatus = filters.maritalStatus.filter(ms => ms != null && ms !== '');
      if (validMaritalStatus.length > 0) backendFilters.maritalStatus = validMaritalStatus;
    }
    
    if (filters.membershipStatus && filters.membershipStatus.length > 0) {
      const validMembershipStatus = filters.membershipStatus.filter(ms => ms != null && ms !== '');
      if (validMembershipStatus.length > 0) backendFilters.membershipStatus = validMembershipStatus;
    }
    
    if (filters.memberStatus && filters.memberStatus.length > 0) {
      const validMemberStatus = filters.memberStatus.filter(ms => ms != null && ms !== '');
      if (validMemberStatus.length > 0) backendFilters.memberStatus = validMemberStatus;
    }

    // Handle boolean filters
    if (filters.hasProfileImage !== undefined) backendFilters.hasProfileImage = filters.hasProfileImage;
    if (filters.hasEmail !== undefined) backendFilters.hasEmail = filters.hasEmail;
    if (filters.hasPhone !== undefined) backendFilters.hasPhone = filters.hasPhone;
    if (filters.isRegularAttendee !== undefined) backendFilters.isRegularAttendee = filters.isRegularAttendee;

    // Handle age range
    if (filters.ageRange) {
      if (filters.ageRange.min !== undefined) {
        backendFilters.minAge = filters.ageRange.min;
      }
      if (filters.ageRange.max !== undefined) {
        backendFilters.maxAge = filters.ageRange.max;
      }
    }

    // Handle date range
    if (filters.dateRange) {
      if (filters.dateRange.joinedAfter) {
        backendFilters.joinedAfter = filters.dateRange.joinedAfter;
      }
      if (filters.dateRange.joinedBefore) {
        backendFilters.joinedBefore = filters.dateRange.joinedBefore;
      }
    }

    return backendFilters;
  }

  /**
   * Client-side filtering is no longer used - all filtering is done server-side
   * This method is kept for backward compatibility but returns members unchanged
   */
  static applyClientFilters(members: Member[], filters: Partial<MemberFilters>): Member[] {
    // All filtering is now done server-side, so just return members as-is
    return members;
  }

  /**
   * Generate filter statistics from members array
   * This is still useful for UI display purposes
   */
  static generateFilterStats(members: Member[]) {
    const stats = {
      gender: new Map<string, number>(),
      maritalStatus: new Map<string, number>(),
      membershipStatus: new Map<string, number>(),
      memberStatus: new Map<string, number>(),
      hasProfileImage: { true: 0, false: 0 },
      hasEmail: { true: 0, false: 0 },
      hasPhone: { true: 0, false: 0 },
      isRegularAttendee: { true: 0, false: 0 },
      totalMembers: members.length
    };

    members.forEach(member => {
      // Gender stats
      const gender = member.gender || 'Not Specified';
      stats.gender.set(gender, (stats.gender.get(gender) || 0) + 1);

      // Marital status stats
      const maritalStatus = member.maritalStatus || 'Not Specified';
      stats.maritalStatus.set(maritalStatus, (stats.maritalStatus.get(maritalStatus) || 0) + 1);

      // Membership status stats
      const membershipStatus = member.membershipStatus || 'Not Specified';
      stats.membershipStatus.set(membershipStatus, (stats.membershipStatus.get(membershipStatus) || 0) + 1);

      // Member status stats
      const memberStatus = member.memberStatus || 'ACTIVE';
      stats.memberStatus.set(memberStatus, (stats.memberStatus.get(memberStatus) || 0) + 1);

      // Profile completeness stats
      stats.hasProfileImage[member.profileImageUrl ? 'true' : 'false']++;
      stats.hasEmail[member.email ? 'true' : 'false']++;
      stats.hasPhone[member.phoneNumber ? 'true' : 'false']++;
      stats.isRegularAttendee[member.isRegularAttendee ? 'true' : 'false']++;
    });

    return stats;
  }

  /**
   * Check if any filters are currently active
   */
  static hasActiveFilters(filters: MemberFilters): boolean {
    return !!(
      filters.search ||
      filters.hasMemberId !== undefined ||
      (filters.gender && filters.gender.length > 0) ||
      (filters.maritalStatus && filters.maritalStatus.length > 0) ||
      (filters.membershipStatus && filters.membershipStatus.length > 0) ||
      (filters.memberStatus && filters.memberStatus.length > 0) ||
      filters.ageRange?.min !== undefined ||
      filters.ageRange?.max !== undefined ||
      filters.dateRange?.joinedAfter ||
      filters.dateRange?.joinedBefore ||
      filters.hasProfileImage !== undefined ||
      filters.hasEmail !== undefined ||
      filters.hasPhone !== undefined ||
      filters.isRegularAttendee !== undefined
    );
  }

  /**
   * Clear all filters
   */
  static clearAllFilters(): MemberFilters {
    return {
      branchId: undefined,
      organisationId: undefined,
      hasMemberId: undefined,
      search: undefined,
      gender: undefined,
      maritalStatus: undefined,
      membershipStatus: undefined,
      memberStatus: undefined,
      ageRange: undefined,
      dateRange: undefined,
      hasProfileImage: undefined,
      hasEmail: undefined,
      hasPhone: undefined,
      isRegularAttendee: undefined,
    };
  }

  /**
   * Get count of active filters
   */
  static getActiveFilterCount(filters: MemberFilters): number {
    let count = 0;
    
    if (filters.search) count++;
    if (filters.hasMemberId !== undefined) count++;
    if (filters.gender && filters.gender.length > 0) count++;
    if (filters.maritalStatus && filters.maritalStatus.length > 0) count++;
    if (filters.membershipStatus && filters.membershipStatus.length > 0) count++;
    if (filters.memberStatus && filters.memberStatus.length > 0) count++;
    if (filters.ageRange?.min !== undefined || filters.ageRange?.max !== undefined) count++;
    if (filters.dateRange?.joinedAfter || filters.dateRange?.joinedBefore) count++;
    if (filters.hasProfileImage !== undefined) count++;
    if (filters.hasEmail !== undefined) count++;
    if (filters.hasPhone !== undefined) count++;
    if (filters.isRegularAttendee !== undefined) count++;
    
    return count;
  }
}
