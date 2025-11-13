'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  userCount: number;
  permissionIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface RoleListProps {
  roles: Role[];
  selectedRole?: Role;
  onSelectRole: (role: Role) => void;
  isLoading?: boolean;
}

/**
 * RoleList Component - Displays list of roles with search and filtering
 */
export function RoleList({ roles, selectedRole, onSelectRole, isLoading }: RoleListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const sortedRoles = useMemo(() => {
    return [...filteredRoles].sort((a, b) => a.level - b.level);
  }, [filteredRoles]);

  return (
    <div className="space-y-4">
      <div>
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedRoles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No roles found
          </div>
        ) : (
          sortedRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                selectedRole?.id === role.id
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:bg-muted'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Level {role.level}</Badge>
                    <Badge variant="outline">{role.userCount} users</Badge>
                    <Badge variant="outline">{role.permissionIds.length} permissions</Badge>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
