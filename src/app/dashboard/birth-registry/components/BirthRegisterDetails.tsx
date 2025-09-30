import React from 'react';
import {
  X,
  User,
  Calendar,
  MapPin,
  Heart,
  FileText,
  Pencil,
  Printer,
  Share,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  getBirthRegisterDisplayName,
  getParentDisplayName,
  calculateAge,
  calculateAgeInDays,
  getGenderIcon,
  getGenderColor,
  getBaptismStatusColor,
  getBaptismStatusText,
} from '@/graphql/hooks/useBirthRegistry';
import { BirthRegister } from '@/graphql/queries/birthQueries';

interface BirthRegisterDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  birthRegister: BirthRegister | null;
  onEdit?: (birthRegister: BirthRegister) => void;
}

const BirthRegisterDetails: React.FC<BirthRegisterDetailsProps> = ({
  isOpen,
  onClose,
  birthRegister,
  onEdit,
}) => {
  if (!birthRegister) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not specified';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Birth Record - ${getBirthRegisterDisplayName(birthRegister)}`,
          text: `Birth record for ${getBirthRegisterDisplayName(birthRegister)} born on ${formatDate(birthRegister.dateOfBirth)}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Birth Record Details
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              {navigator.share && (
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(birthRegister)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">
                  {getGenderIcon(birthRegister.childGender)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {getBirthRegisterDisplayName(birthRegister)}
                  </h2>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={getGenderColor(birthRegister.childGender)}>
                      {birthRegister.childGender}
                    </Badge>
                    <Badge className={getBaptismStatusColor(birthRegister.baptismPlanned, birthRegister.baptismDate)}>
                      {getBaptismStatusText(birthRegister.baptismPlanned, birthRegister.baptismDate)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Born on {formatDate(birthRegister.dateOfBirth)}</p>
                    <p>{calculateAgeInDays(birthRegister.dateOfBirth)} days old</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Birth Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5" />
                Birth Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Date & Time</h4>
                    <p className="text-gray-600">{formatDate(birthRegister.dateOfBirth)}</p>
                    <p className="text-gray-500 text-sm">at {formatTime(birthRegister.timeOfBirth)}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Place of Birth</h4>
                    <p className="text-gray-600">{birthRegister.placeOfBirth}</p>
                    {birthRegister.hospitalName && (
                      <p className="text-gray-500 text-sm">{birthRegister.hospitalName}</p>
                    )}
                  </div>

                  {birthRegister.attendingPhysician && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Attending Physician</h4>
                      <p className="text-gray-600">{birthRegister.attendingPhysician}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {(birthRegister.birthWeight || birthRegister.birthLength) && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Physical Details</h4>
                      {birthRegister.birthWeight && (
                        <p className="text-gray-600">Weight: {birthRegister.birthWeight} grams</p>
                      )}
                      {birthRegister.birthLength && (
                        <p className="text-gray-600">Length: {birthRegister.birthLength} cm</p>
                      )}
                    </div>
                  )}

                  {birthRegister.birthCircumstances && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Birth Circumstances</h4>
                      <p className="text-gray-600">{birthRegister.birthCircumstances}</p>
                    </div>
                  )}

                  {birthRegister.complications && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Complications</h4>
                      <p className="text-gray-600">{birthRegister.complications}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartIcon className="h-5 w-5" />
                Parent Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mother Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mother</h4>
                    <div className="space-y-2">
                      <p className="text-gray-900 font-medium">
                        {getParentDisplayName(birthRegister.motherFirstName, birthRegister.motherLastName)}
                      </p>
                      {birthRegister.motherAge && (
                        <p className="text-gray-600 text-sm">Age: {birthRegister.motherAge}</p>
                      )}
                      {birthRegister.motherOccupation && (
                        <p className="text-gray-600 text-sm">Occupation: {birthRegister.motherOccupation}</p>
                      )}
                      {birthRegister.motherMember && (
                        <Badge variant="outline" className="text-xs">
                          Church Member
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Father Information */}
                <div className="space-y-4">
                  {(birthRegister.fatherFirstName && birthRegister.fatherLastName) ? (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Father</h4>
                      <div className="space-y-2">
                        <p className="text-gray-900 font-medium">
                          {getParentDisplayName(birthRegister.fatherFirstName, birthRegister.fatherLastName)}
                        </p>
                        {birthRegister.fatherAge && (
                          <p className="text-gray-600 text-sm">Age: {birthRegister.fatherAge}</p>
                        )}
                        {birthRegister.fatherOccupation && (
                          <p className="text-gray-600 text-sm">Occupation: {birthRegister.fatherOccupation}</p>
                        )}
                        {birthRegister.fatherMember && (
                          <Badge variant="outline" className="text-xs">
                            Church Member
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Father</h4>
                      <p className="text-gray-500 text-sm">Information not provided</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Address</h5>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{birthRegister.parentAddress}</p>
                  </div>
                  <div className="space-y-3">
                    {birthRegister.parentPhone && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Phone</h5>
                        <a
                          href={`tel:${birthRegister.parentPhone}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {birthRegister.parentPhone}
                        </a>
                      </div>
                    )}
                    {birthRegister.parentEmail && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Email</h5>
                        <a
                          href={`mailto:${birthRegister.parentEmail}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {birthRegister.parentEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Baptism Information */}
          {birthRegister.baptismPlanned && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  Baptism Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {birthRegister.baptismDate ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Baptism Date</h4>
                        <p className="text-gray-600">{formatDate(birthRegister.baptismDate)}</p>
                      </div>
                      {birthRegister.baptismLocation && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                          <p className="text-gray-600">{birthRegister.baptismLocation}</p>
                        </div>
                      )}
                      {birthRegister.baptismOfficiant && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Officiant</h4>
                          <p className="text-gray-600">{birthRegister.baptismOfficiant}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-1">Baptism Planned</h4>
                      <p className="text-gray-600 text-sm">Date and details to be scheduled</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {(birthRegister.birthCertificateUrl || 
            birthRegister.hospitalRecordUrl || 
            birthRegister.photoUrls.length > 0 || 
            birthRegister.additionalDocuments.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  Documents & Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Official Documents</h4>
                    <div className="space-y-2">
                      {birthRegister.birthCertificateUrl && (
                        <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <span className="text-sm text-gray-600">Birth Certificate</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={birthRegister.birthCertificateUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      )}
                      {birthRegister.hospitalRecordUrl && (
                        <div className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <span className="text-sm text-gray-600">Hospital Record</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={birthRegister.hospitalRecordUrl} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      )}
                      {birthRegister.additionalDocuments.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                          <span className="text-sm text-gray-600">{doc.name || `Document ${index + 1}`}</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {birthRegister.photoUrls.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Photos ({birthRegister.photoUrls.length})</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {birthRegister.photoUrls.slice(0, 4).map((photoUrl, index) => (
                          <div key={index} className="aspect-square border border-gray-200 rounded overflow-hidden">
                            <img
                              src={photoUrl}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                              onClick={() => window.open(photoUrl, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                      {birthRegister.photoUrls.length > 4 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{birthRegister.photoUrls.length - 4} more photos
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <p><strong>Record ID:</strong> {birthRegister.id}</p>
                  <p><strong>Created:</strong> {formatDate(birthRegister.createdAt)}</p>
                </div>
                <div>
                  <p><strong>Last Updated:</strong> {formatDate(birthRegister.updatedAt)}</p>
                  {birthRegister.createdBy && (
                    <p><strong>Created By:</strong> {birthRegister.createdBy.firstName} {birthRegister.createdBy.lastName}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BirthRegisterDetails;
