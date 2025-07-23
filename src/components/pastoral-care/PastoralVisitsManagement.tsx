'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  MapPin,
  FileText,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  GET_PASTORAL_VISITS, 
  CREATE_PASTORAL_VISIT, 
  UPDATE_PASTORAL_VISIT, 
  DELETE_PASTORAL_VISIT,
  PastoralVisit 
} from '@/graphql/pastoral-care';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';

interface PastoralVisitsManagementProps {
  className?: string;
}

export function PastoralVisitsManagement({ className }: PastoralVisitsManagementProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<PastoralVisit | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visitDate: '',
    visitType: 'HOME_VISIT',
    status: 'SCHEDULED',
    notes: '',
    followUpNeeded: false,
    memberId: '',
    pastorId: '',
    actualDate: '',
    location: '',
    followUpDate: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_PASTORAL_VISITS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { title: searchTerm })
      },
      skip: currentPage * pageSize,
      take: pageSize
    },
    skip: !organisationId,
  });

  const [createVisit] = useMutation(CREATE_PASTORAL_VISIT, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Pastoral visit created successfully",
      });
      setIsCreateModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [updateVisit] = useMutation(UPDATE_PASTORAL_VISIT, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Pastoral visit updated successfully",
      });
      setIsEditModalOpen(false);
      setSelectedVisit(null);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [deleteVisit] = useMutation(DELETE_PASTORAL_VISIT, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Pastoral visit deleted successfully",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      visitDate: '',
      visitType: 'HOME_VISIT',
      status: 'SCHEDULED',
      notes: '',
      followUpNeeded: false,
      memberId: '',
      pastorId: '',
      actualDate: '',
      location: '',
      followUpDate: ''
    });
    setSelectedVisit(null);
  };

  const handleCreateVisit = async () => {
    try {
      await createVisit({
        variables: {
          input: {
            ...formData,
            organisationId,
            branchId,
            visitDate: new Date(formData.visitDate).toISOString(),
          }
        }
      });
    } catch (error) {
      console.error('Error creating visit:', error);
    }
  };

  const handleUpdateVisit = async () => {
    if (!selectedVisit) return;
    
    try {
      await updateVisit({
        variables: {
          input: {
            id: selectedVisit.id,
            ...formData,
            visitDate: new Date(formData.visitDate).toISOString(),
          }
        }
      });
    } catch (error) {
      console.error('Error updating visit:', error);
    }
  };

  const handleDeleteVisit = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pastoral visit?')) {
      try {
        await deleteVisit({ variables: { id } });
      } catch (error) {
        console.error('Error deleting visit:', error);
      }
    }
  };

  const handleEditVisit = (visit: PastoralVisit) => {
    setSelectedVisit(visit);
    setFormData({
      title: visit.title,
      description: visit.description || '',
      visitDate: format(new Date(visit.visitDate), 'yyyy-MM-dd'),
      visitType: visit.visitType,
      status: visit.status,
      notes: visit.notes || '',
      followUpNeeded: visit.followUpNeeded,
      memberId: visit.memberId,
      pastorId: visit.pastorId || '',
      actualDate: visit.actualDate || '',
      location: visit.location || '',
      followUpDate: visit.followUpDate || ''
    });
    setIsEditModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Visits</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const visits = data || [];
  const totalVisits = visits.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pastoral Visits</h2>
          <p className="text-gray-600 mt-1">Manage and track pastoral visits to members</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-t-lg"></div>
              <div className="relative pt-8 pb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <DialogHeader className="text-center">
                  <DialogTitle className="text-2xl font-bold text-white mb-2">Schedule Pastoral Visit</DialogTitle>
                  <p className="text-blue-100">Create a new pastoral visit to connect with members</p>
                </DialogHeader>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Member Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <Label className="text-sm font-semibold text-blue-900">Member Information</Label>
                </div>
                <Select value={formData.memberId} onValueChange={(value) => setFormData({ ...formData, memberId: value })}>
                  <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* members?.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.firstName} {member.lastName}
                      </SelectItem>
                    )) */}
                  </SelectContent>
                </Select>
              </div>

              {/* Visit Details */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                  <Label className="text-sm font-semibold text-purple-900">Visit Details</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visitDate" className="text-sm text-gray-700 mb-1 block">Visit Date</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={formData.visitDate}
                      onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                      className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="actualDate" className="text-sm text-gray-700 mb-1 block">Actual Date</Label>
                    <Input
                      id="actualDate"
                      type="date"
                      value={formData.actualDate}
                      onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                      className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Visit Configuration */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  <Label className="text-sm font-semibold text-green-900">Visit Configuration</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="visitType" className="text-sm text-gray-700 mb-1 block">Visit Type</Label>
                    <Select value={formData.visitType} onValueChange={(value) => setFormData({ ...formData, visitType: value })}>
                      <SelectTrigger className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400">
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOME_VISIT">🏠 Home Visit</SelectItem>
                        <SelectItem value="HOSPITAL_VISIT">🏥 Hospital Visit</SelectItem>
                        <SelectItem value="OFFICE_VISIT">🏢 Office Visit</SelectItem>
                        <SelectItem value="PHONE_CALL">📞 Phone Call</SelectItem>
                        <SelectItem value="OTHER">📋 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm text-gray-700 mb-1 block">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                        <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                        <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="location" className="text-sm text-gray-700 mb-1 block">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Visit location"
                    className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Description and Notes */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-orange-600 mr-2" />
                  <Label className="text-sm font-semibold text-orange-900">Additional Information</Label>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description" className="text-sm text-gray-700 mb-1 block">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the visit purpose..."
                      rows={3}
                      className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400 resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm text-gray-700 mb-1 block">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes or observations..."
                      rows={3}
                      className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Follow-up Options */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-indigo-600 mr-2" />
                    <div>
                      <Label className="text-sm font-semibold text-indigo-900">Follow-up Required</Label>
                      <p className="text-xs text-indigo-600 mt-1">Enable if this visit requires follow-up action</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="followUpNeeded"
                      checked={formData.followUpNeeded}
                      onChange={(e) => setFormData({ ...formData, followUpNeeded: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 bg-white border-indigo-300 rounded focus:ring-indigo-500 focus:ring-2"
                    />
                  </div>
                </div>
                {formData.followUpNeeded && (
                  <div className="mt-4">
                    <Label htmlFor="followUpDate" className="text-sm text-gray-700 mb-1 block">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                      className="bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateVisit}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Visit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search visits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Visits Table */}
      <Card>
        <CardContent className="p-0">
          {visits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit: PastoralVisit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{visit.title}</p>
                        {visit.description && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {visit.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(visit.visitDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {visit.visitType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(visit.status)}
                        <Badge className={getStatusColor(visit.status)}>
                          {visit.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {visit.followUpNeeded ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Required
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(visit.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVisit(visit)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVisit(visit.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={<Users />}
                title="No pastoral visits found"
                description="Schedule your first pastoral visit to get started"
                action={
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Visit
                  </Button>
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Visit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-t-lg"></div>
            <div className="relative pt-8 pb-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg">
                <Edit className="w-8 h-8 text-emerald-600" />
              </div>
              <DialogHeader className="text-center">
                <DialogTitle className="text-2xl font-bold text-white mb-2">Edit Pastoral Visit</DialogTitle>
                <p className="text-teal-100">Update visit details and progress</p>
              </DialogHeader>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Visit Details */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <Label className="text-sm font-semibold text-purple-900">Visit Details</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title" className="text-sm text-gray-700 mb-1 block">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Visit title"
                    className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-visitDate" className="text-sm text-gray-700 mb-1 block">Visit Date</Label>
                  <Input
                    id="edit-visitDate"
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="edit-actualDate" className="text-sm text-gray-700 mb-1 block">Actual Date</Label>
                  <Input
                    id="edit-actualDate"
                    type="date"
                    value={formData.actualDate}
                    onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                    className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location" className="text-sm text-gray-700 mb-1 block">Location</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Visit location"
                    className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Visit Configuration */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center mb-3">
                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                <Label className="text-sm font-semibold text-green-900">Visit Configuration</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-visitType" className="text-sm text-gray-700 mb-1 block">Visit Type</Label>
                  <Select value={formData.visitType} onValueChange={(value) => setFormData({ ...formData, visitType: value })}>
                    <SelectTrigger className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOME_VISIT">🏠 Home Visit</SelectItem>
                      <SelectItem value="HOSPITAL_VISIT">🏥 Hospital Visit</SelectItem>
                      <SelectItem value="OFFICE_VISIT">🏢 Office Visit</SelectItem>
                      <SelectItem value="PHONE_CALL">📞 Phone Call</SelectItem>
                      <SelectItem value="OTHER">📋 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status" className="text-sm text-gray-700 mb-1 block">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                      <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                      <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Description and Notes */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-orange-600 mr-2" />
                <Label className="text-sm font-semibold text-orange-900">Additional Information</Label>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-description" className="text-sm text-gray-700 mb-1 block">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Visit description"
                    rows={3}
                    className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400 resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-notes" className="text-sm text-gray-700 mb-1 block">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Visit notes"
                    rows={3}
                    className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Follow-up Options */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-indigo-600 mr-2" />
                  <div>
                    <Label className="text-sm font-semibold text-indigo-900">Follow-up Required</Label>
                    <p className="text-xs text-indigo-600 mt-1">Enable if this visit requires follow-up action</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-followUpNeeded"
                    checked={formData.followUpNeeded}
                    onChange={(e) => setFormData({ ...formData, followUpNeeded: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 bg-white border-indigo-300 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                </div>
              </div>
              {formData.followUpNeeded && (
                <div className="mt-4">
                  <Label htmlFor="edit-followUpDate" className="text-sm text-gray-700 mb-1 block">Follow-up Date</Label>
                  <Input
                    id="edit-followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateVisit}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Visit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
