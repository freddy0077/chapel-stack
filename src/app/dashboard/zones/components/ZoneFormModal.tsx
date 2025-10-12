'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ZoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  zone?: any;
}

export default function ZoneFormModal({
  isOpen,
  onClose,
  onSubmit,
  zone,
}: ZoneFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    leaderName: '',
    leaderPhone: '',
    leaderEmail: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name || '',
        description: zone.description || '',
        location: zone.location || '',
        leaderName: zone.leaderName || '',
        leaderPhone: zone.leaderPhone || '',
        leaderEmail: zone.leaderEmail || '',
        status: zone.status || 'ACTIVE',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        location: '',
        leaderName: '',
        leaderPhone: '',
        leaderEmail: '',
        status: 'ACTIVE',
      });
    }
  }, [zone, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {zone ? 'Edit Zone' : 'Create New Zone'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zone Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Zone Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., North Zone, Downtown Community"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the zone..."
              rows={3}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location/Area</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., North District, Downtown Area"
            />
          </div>

          {/* Zone Leader Information */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Zone Leader Information</h3>

            <div className="space-y-2">
              <Label htmlFor="leaderName">Leader Name</Label>
              <Input
                id="leaderName"
                value={formData.leaderName}
                onChange={(e) =>
                  setFormData({ ...formData, leaderName: e.target.value })
                }
                placeholder="Full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leaderPhone">Phone Number</Label>
                <Input
                  id="leaderPhone"
                  value={formData.leaderPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, leaderPhone: e.target.value })
                  }
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaderEmail">Email Address</Label>
                <Input
                  id="leaderEmail"
                  type="email"
                  value={formData.leaderEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, leaderEmail: e.target.value })
                  }
                  placeholder="leader@example.com"
                />
              </div>
            </div>
          </div>

          {/* Status - Only show when editing */}
          {zone && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {zone ? 'Update Zone' : 'Create Zone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
