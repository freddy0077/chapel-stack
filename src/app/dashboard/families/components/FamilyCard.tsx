import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  HomeIcon, 
  PhoneIcon, 
  UsersIcon, 
  CalendarIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Family } from '@/graphql/queries/familyQueries';
import { formatDistanceToNow } from 'date-fns';

interface FamilyCardProps {
  family: Family;
  onEdit?: (family: Family) => void;
  onDelete?: (family: Family) => void;
  onView?: (family: Family) => void;
}

export const FamilyCard: React.FC<FamilyCardProps> = ({
  family,
  onEdit,
  onDelete,
  onView,
}) => {
  const formatAddress = () => {
    const parts = [family.address, family.city, family.state].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  const getDisplayName = () => {
    // Enhanced differentiation: Show family name with context
    const address = family.city || family.address;
    const memberCount = family.members?.length || 0;
    
    if (address && memberCount > 0) {
      return `${family.name} • ${address} • ${memberCount} member${memberCount !== 1 ? 's' : ''}`;
    } else if (address) {
      return `${family.name} • ${address}`;
    } else if (memberCount > 0) {
      return `${family.name} • ${memberCount} member${memberCount !== 1 ? 's' : ''}`;
    }
    
    return family.name;
  };

  const getMemberInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1" onClick={() => onView?.(family)}>
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {family.name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {getDisplayName()}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(family)}>
                <HomeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(family)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Family
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(family)}
                className="text-red-600 focus:text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Family
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          {/* Address */}
          {(family.address || family.city) && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatAddress()}</span>
            </div>
          )}

          {/* Phone */}
          {family.phoneNumber && (
            <div className="flex items-center text-sm text-gray-600">
              <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{family.phoneNumber}</span>
            </div>
          )}

          {/* Members */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{family.members?.length || 0} member{(family.members?.length || 0) !== 1 ? 's' : ''}</span>
            </div>

            {/* Member Avatars */}
            {family.members && family.members.length > 0 && (
              <div className="flex -space-x-2">
                {family.members.slice(0, 4).map((member, index) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={member.profileImageUrl} />
                    <AvatarFallback className="text-xs">
                      {getMemberInitials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {family.members.length > 4 && (
                  <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-medium">
                      +{family.members.length - 4}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Created {formatDistanceToNow(new Date(family.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
