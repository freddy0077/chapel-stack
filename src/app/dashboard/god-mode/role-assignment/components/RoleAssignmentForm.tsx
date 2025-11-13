'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
  level: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface RoleAssignmentFormProps {
  user?: User;
  role?: Role;
  userRoles?: Role[];
  onAssign: (userId: string, roleId: string) => Promise<void>;
  onRemove: (userId: string, roleId: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * RoleAssignmentForm Component - Form to assign/remove roles from users
 */
export function RoleAssignmentForm({
  user,
  role,
  userRoles = [],
  onAssign,
  onRemove,
  isLoading,
}: RoleAssignmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasRole = user && role && userRoles.some((r) => r.id === role.id);

  const handleAssign = async () => {
    if (!user || !role) {
      toast.error('Please select both user and role');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAssign(user.id, role.id);
      toast.success(`Role "${role.name}" assigned to ${user.firstName} ${user.lastName}`);
    } catch (error) {
      toast.error('Failed to assign role');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    if (!user || !role) {
      toast.error('Please select both user and role');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRemove(user.id, role.id);
      toast.success(`Role "${role.name}" removed from ${user.firstName} ${user.lastName}`);
    } catch (error) {
      toast.error('Failed to remove role');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div>
        <h3 className="font-semibold mb-2">Selected User</h3>
        {user ? (
          <div className="p-3 bg-background rounded border">
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        ) : (
          <div className="p-3 bg-background rounded border text-muted-foreground">
            No user selected
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Selected Role</h3>
        {role ? (
          <div className="p-3 bg-background rounded border">
            <p className="font-medium">{role.name}</p>
            <p className="text-sm text-muted-foreground">Level {role.level}</p>
          </div>
        ) : (
          <div className="p-3 bg-background rounded border text-muted-foreground">
            No role selected
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">User's Current Roles</h3>
        {user && userRoles.length > 0 ? (
          <div className="space-y-2">
            {userRoles.map((r) => (
              <div key={r.id} className="p-2 bg-background rounded border text-sm">
                {r.name} (Level {r.level})
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-background rounded border text-muted-foreground text-sm">
            No roles assigned
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleAssign}
          disabled={!user || !role || hasRole || isSubmitting || isLoading}
          className="flex-1"
        >
          {isSubmitting ? 'Assigning...' : 'Assign Role'}
        </Button>
        <Button
          onClick={handleRemove}
          disabled={!user || !role || !hasRole || isSubmitting || isLoading}
          variant="destructive"
          className="flex-1"
        >
          {isSubmitting ? 'Removing...' : 'Remove Role'}
        </Button>
      </div>
    </div>
  );
}
