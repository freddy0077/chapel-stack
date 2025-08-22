'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemberMarriageHistory } from '@/graphql/hooks/useMarriageAnalytics';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  User, 
  Download,
  RefreshCw,
  ExternalLink,
  Gift
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

interface MemberMarriageHistoryCardProps {
  memberId: string;
  branchId?: string;
  onClose?: () => void;
}

const MemberMarriageHistoryCard: React.FC<MemberMarriageHistoryCardProps> = ({ 
  memberId, 
  branchId, 
  onClose 
}) => {
  const { data, loading, error, refetch } = useMemberMarriageHistory({
    memberId,
    branchId,
  });

  const marriageHistory = data?.memberMarriageHistory;

  const handleRefresh = () => {
    refetch();
  };

  const handleDownloadCertificate = () => {
    if (marriageHistory?.certificateUrl) {
      window.open(marriageHistory.certificateUrl, '_blank');
    }
  };

  const getDaysUntilAnniversary = (nextAnniversary: string) => {
    try {
      const anniversaryDate = parseISO(nextAnniversary);
      const today = new Date();
      return differenceInDays(anniversaryDate, today);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Marriage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading marriage history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Marriage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading marriage history: {error.message}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marriageHistory) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Marriage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No marriage record found for this member.</p>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysUntilAnniversary = getDaysUntilAnniversary(marriageHistory.nextAnniversary);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Marriage History
          </CardTitle>
          <div className="flex items-center gap-2">
            {marriageHistory.certificateUrl && (
              <Button onClick={handleDownloadCertificate} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Certificate
              </Button>
            )}
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="ghost" size="sm">
                Close
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Member and Spouse Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Member</Label>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{marriageHistory.memberName}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Spouse</Label>
            <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
              <Heart className="h-4 w-4 text-pink-600" />
              <span className="font-medium">{marriageHistory.spouseName}</span>
              {marriageHistory.spouseMemberId && (
                <Badge variant="secondary" className="ml-2">Member</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-4" />

        {/* Marriage Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Marriage Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Marriage Date</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span>{format(parseISO(marriageHistory.marriageDate), 'MMMM dd, yyyy')}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Years Married</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Gift className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{marriageHistory.yearsMarried} years</span>
              </div>
            </div>
          </div>

          {marriageHistory.marriageLocation && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Location</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span>{marriageHistory.marriageLocation}</span>
              </div>
            </div>
          )}

          {marriageHistory.officiantName && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Officiant</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span>{marriageHistory.officiantName}</span>
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200 my-4" />

        {/* Anniversary Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Anniversary Information</h3>
          
          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Next Anniversary</p>
                <p className="text-lg font-bold text-pink-600">
                  {format(parseISO(marriageHistory.nextAnniversary), 'MMMM dd, yyyy')}
                </p>
                {daysUntilAnniversary !== null && (
                  <p className="text-sm text-gray-600">
                    {daysUntilAnniversary === 0 
                      ? 'Today!' 
                      : daysUntilAnniversary === 1 
                      ? 'Tomorrow' 
                      : `${daysUntilAnniversary} days away`
                    }
                  </p>
                )}
              </div>
              <Calendar className="h-8 w-8 text-pink-500" />
            </div>
          </div>

          {daysUntilAnniversary !== null && daysUntilAnniversary <= 30 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Anniversary coming up! Consider sending congratulations.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Section */}
        {marriageHistory.certificateUrl && (
          <>
            <div className="h-px bg-gray-200 my-4" />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Certificate</h3>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-green-600" />
                  <span className="text-green-800 font-medium">Marriage Certificate Available</span>
                </div>
                <Button onClick={handleDownloadCertificate} size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Helper Label component
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <label className={className}>{children}</label>
);

export default MemberMarriageHistoryCard;
