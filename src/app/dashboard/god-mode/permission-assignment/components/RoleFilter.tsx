'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleFilterProps {
  onFilter: (search?: string, level?: number) => void;
  isLoading?: boolean;
}

/**
 * RoleFilter Component - Filter roles by name and level
 */
export function RoleFilter({ onFilter, isLoading }: RoleFilterProps) {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<string>('');

  const handleApply = () => {
    onFilter(search || undefined, level ? parseInt(level) : undefined);
  };

  const handleReset = () => {
    setSearch('');
    setLevel('');
    onFilter();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold">Filter Roles</h3>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-1 block">Search</label>
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Level</label>
          <Select value={level} onValueChange={setLevel} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              <SelectItem value="0">Level 0</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} disabled={isLoading} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={isLoading} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
}
