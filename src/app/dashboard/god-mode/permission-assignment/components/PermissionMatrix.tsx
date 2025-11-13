'use client';

import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
  level: number;
}

interface Permission {
  id: string;
  action: string;
  subject: string;
  category: string;
}

interface PermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
  matrix: Record<string, Record<string, boolean>>;
  onAssign: (roleId: string, permissionId: string) => Promise<void>;
  onRemove: (roleId: string, permissionId: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * PermissionMatrix Component - Displays role-permission matrix with checkboxes
 */
export function PermissionMatrix({
  roles,
  permissions,
  matrix,
  onAssign,
  onRemove,
  isLoading,
}: PermissionMatrixProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach((perm) => {
      if (!groups[perm.category]) {
        groups[perm.category] = [];
      }
      groups[perm.category].push(perm);
    });
    return groups;
  }, [permissions]);

  const categories = useMemo(() => {
    return Object.keys(groupedByCategory).sort();
  }, [groupedByCategory]);

  const handleToggle = async (roleId: string, permissionId: string) => {
    const key = `${roleId}-${permissionId}`;
    setIsUpdating(key);

    try {
      const hasPermission = matrix[roleId]?.[permissionId];
      if (hasPermission) {
        await onRemove(roleId, permissionId);
        toast.success('Permission removed');
      } else {
        await onAssign(roleId, permissionId);
        toast.success('Permission assigned');
      }
    } catch (error) {
      toast.error('Failed to update permission');
      console.error(error);
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-muted/50 overflow-x-auto">
      <h3 className="font-semibold text-lg">Permission Matrix</h3>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No permissions available
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {groupedByCategory[category].length} permission(s)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Permission</th>
                      {roles.map((role) => (
                        <th key={role.id} className="text-center p-2 font-semibold">
                          <div className="text-xs">{role.name}</div>
                          <div className="text-xs text-muted-foreground">L{role.level}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByCategory[category].map((perm) => (
                      <tr key={perm.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div className="font-medium">{perm.action}</div>
                          <div className="text-xs text-muted-foreground">{perm.subject}</div>
                        </td>
                        {roles.map((role) => (
                          <td key={`${role.id}-${perm.id}`} className="text-center p-2">
                            <Checkbox
                              checked={matrix[role.id]?.[perm.id] || false}
                              onCheckedChange={() => handleToggle(role.id, perm.id)}
                              disabled={isUpdating === `${role.id}-${perm.id}` || isLoading}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
