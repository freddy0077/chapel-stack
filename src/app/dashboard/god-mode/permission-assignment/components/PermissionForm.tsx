'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';

interface Permission {
  id?: string;
  action: string;
  subject: string;
  description?: string;
  category?: string;
}

interface PermissionFormProps {
  permission?: Permission;
  categories: string[];
  onSubmit: (data: Permission) => Promise<void>;
  isLoading?: boolean;
}

/**
 * PermissionForm Component - Form to create/edit permissions
 */
export function PermissionForm({
  permission,
  categories,
  onSubmit,
  isLoading,
}: PermissionFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm<Permission>({
    defaultValues: permission || {
      action: '',
      subject: '',
      description: '',
      category: 'general',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const category = watch('category');

  const onSubmitForm = async (data: Permission) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(permission ? 'Permission updated' : 'Permission created');
    } catch (error) {
      toast.error('Failed to save permission');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">
        {permission ? 'Edit Permission' : 'Create Permission'}
      </h3>

      <div>
        <label className="text-sm font-medium mb-1 block">Action *</label>
        <Input
          placeholder="e.g., CREATE, READ, UPDATE, DELETE"
          {...register('action', { required: true })}
          disabled={isSubmitting || isLoading}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Subject *</label>
        <Input
          placeholder="e.g., User, Role, Permission"
          {...register('subject', { required: true })}
          disabled={isSubmitting || isLoading}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <Input
          placeholder="Description of this permission"
          {...register('description')}
          disabled={isSubmitting || isLoading}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Category</label>
        <Select value={category} onValueChange={(value) => setValue('category', value)}>
          <SelectTrigger disabled={isSubmitting || isLoading}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting || isLoading} className="w-full">
        {isSubmitting ? 'Saving...' : permission ? 'Update Permission' : 'Create Permission'}
      </Button>
    </form>
  );
}
