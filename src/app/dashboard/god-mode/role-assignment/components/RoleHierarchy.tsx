'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  userCount: number;
  permissionIds: string[];
}

interface RoleHierarchyProps {
  roles: Role[];
  selectedRole?: Role;
  isLoading?: boolean;
}

/**
 * RoleHierarchy Component - Visualizes role hierarchy by level
 */
export function RoleHierarchy({ roles, selectedRole, isLoading }: RoleHierarchyProps) {
  const groupedByLevel = useMemo(() => {
    const groups: Record<number, Role[]> = {};
    roles.forEach((role) => {
      if (!groups[role.level]) {
        groups[role.level] = [];
      }
      groups[role.level].push(role);
    });
    return groups;
  }, [roles]);

  const levels = useMemo(() => {
    return Object.keys(groupedByLevel)
      .map(Number)
      .sort((a, b) => a - b);
  }, [groupedByLevel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold text-lg">Role Hierarchy</h3>

      {levels.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No roles available
        </div>
      ) : (
        <div className="space-y-4">
          {levels.map((level) => (
            <div key={level} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Level {level}</Badge>
                <span className="text-sm text-muted-foreground">
                  {groupedByLevel[level].length} role(s)
                </span>
              </div>

              <div className="space-y-2 ml-4">
                {groupedByLevel[level].map((role) => (
                  <div
                    key={role.id}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedRole?.id === role.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-background'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{role.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {role.userCount} users
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {role.permissionIds.length} perms
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
