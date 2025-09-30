import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  HomeIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  UsersIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  UserPlusIcon,
  UserMinusIcon,
} from 'lucide-react';
import { Family } from '@/graphql/queries/familyQueries';
import { formatDistanceToNow, format } from 'date-fns';

interface FamilyDetailModalProps {
  family: Family;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const FamilyDetailModal: React.FC<FamilyDetailModalProps> = ({
  family,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'relationships'>('overview');

  const formatAddress = () => {
    const parts = [
      family.address,
      family.city,
      family.state,
      family.postalCode,
      family.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  const getMemberInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-yellow-100 text-yellow-800',
      SUSPENDED: 'bg-orange-100 text-orange-800',
      TRANSFERRED: 'bg-blue-100 text-blue-800',
      DECEASED: 'bg-gray-100 text-gray-800',
      REMOVED: 'bg-red-100 text-red-800',
    };

    return (
      <Badge
        variant="secondary"
        className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
      >
        {status || 'Active'}
      </Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">{family.name}</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={onEdit} variant="outline" size="sm">
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={onDelete} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: HomeIcon },
            { id: 'members', label: 'Members', icon: UsersIcon },
            { id: 'relationships', label: 'Relationships', icon: UserPlusIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HomeIcon className="mr-2 h-5 w-5" />
                    Family Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Family Name</label>
                      <p className="text-lg font-semibold">{family.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Members</label>
                      <p className="text-lg font-semibold">
                        {family.members?.length || 0} member{(family.members?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                      <MapPinIcon className="mr-1 h-4 w-4" />
                      Address
                    </label>
                    <p className="text-gray-900">{formatAddress()}</p>
                  </div>

                  {family.phoneNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center mb-2">
                        <PhoneIcon className="mr-1 h-4 w-4" />
                        Phone Number
                      </label>
                      <p className="text-gray-900">{family.phoneNumber}</p>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center mb-1">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Created
                      </label>
                      <p>{format(new Date(family.createdAt), 'PPP')}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(family.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center mb-1">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        Last Updated
                      </label>
                      <p>{format(new Date(family.updatedAt), 'PPP')}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(family.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Fields */}
              {family.customFields && Object.keys(family.customFields).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(family.customFields).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm font-medium text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="text-gray-900">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Family Members</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </div>

              {family.members && family.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {family.members.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.profileImageUrl} />
                            <AvatarFallback>
                              {getMemberInitials(member.firstName, member.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {member.firstName} {member.lastName}
                              </h4>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                <UserMinusIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-1 space-y-1">
                              {member.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MailIcon className="mr-1 h-3 w-3" />
                                  <span className="truncate">{member.email}</span>
                                </div>
                              )}
                              {member.phoneNumber && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <PhoneIcon className="mr-1 h-3 w-3" />
                                  <span>{member.phoneNumber}</span>
                                </div>
                              )}
                              <div className="mt-2">
                                {getStatusBadge(member.membershipStatus)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
                    <p className="text-gray-600 mb-4">Add members to this family to get started</p>
                    <Button>
                      <UserPlusIcon className="mr-2 h-4 w-4" />
                      Add First Member
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Family Relationships</h3>
                <Button size="sm" variant="outline">
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  Add Relationship
                </Button>
              </div>

              <Card>
                <CardContent className="p-8 text-center">
                  <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Relationship management</h3>
                  <p className="text-gray-600 mb-4">
                    Family relationships will be displayed here once implemented
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
