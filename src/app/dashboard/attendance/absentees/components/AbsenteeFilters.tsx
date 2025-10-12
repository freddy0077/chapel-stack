'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface AbsenteeFiltersProps {
  filters: {
    regularAttendersOnly: boolean;
    minConsecutiveAbsences: number;
  };
  onChange: (filters: any) => void;
  onClose: () => void;
}

export default function AbsenteeFilters({
  filters,
  onChange,
  onClose,
}: AbsenteeFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Regular Attenders Only */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Regular Attenders Only</Label>
                <p className="text-sm text-gray-500">
                  Show only members with 75%+ attendance rate
                </p>
              </div>
              <Switch
                checked={filters.regularAttendersOnly}
                onCheckedChange={(checked) =>
                  onChange({ ...filters, regularAttendersOnly: checked })
                }
              />
            </div>

            {/* Minimum Consecutive Absences */}
            <div className="space-y-2">
              <Label>Minimum Consecutive Absences</Label>
              <Input
                type="number"
                min="1"
                value={filters.minConsecutiveAbsences}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minConsecutiveAbsences: parseInt(e.target.value) || 1,
                  })
                }
              />
              <p className="text-sm text-gray-500">
                Show members absent for at least this many weeks
              </p>
            </div>

            {/* Reset Filters */}
            <Button
              variant="outline"
              onClick={() =>
                onChange({
                  regularAttendersOnly: false,
                  minConsecutiveAbsences: 1,
                })
              }
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
