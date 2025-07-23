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
  MoreHorizontal,
  Edit,
  Trash2,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Settings,
  FileText,
  Repeat
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  GET_COUNSELING_SESSIONS, 
  CREATE_COUNSELING_SESSION, 
  UPDATE_COUNSELING_SESSION, 
  DELETE_COUNSELING_SESSION,
  CounselingSession 
} from '@/graphql/pastoral-care';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';

interface CounselingSessionsManagementProps {
  className?: string;
}

export function CounselingSessionsManagement({ className }: CounselingSessionsManagementProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CounselingSession | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sessionDate: '',
    sessionType: 'INDIVIDUAL',
    status: 'SCHEDULED',
    sessionNotes: '',
    privateNotes: '',
    homework: '',
    nextSteps: '',
    sessionNumber: 1,
    totalSessions: 1,
    progressNotes: '',
    isConfidential: false,
    followUpDate: '',
    primaryMemberId: '',
    counselorId: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_COUNSELING_SESSIONS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { sessionType: typeFilter }),
        ...(searchTerm && { title: searchTerm })
      },
      skip: currentPage * pageSize,
      take: pageSize
    },
    skip: !organisationId,
  });

  const [createSession, { loading: createLoading }] = useMutation(CREATE_COUNSELING_SESSION, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Counseling session created successfully",
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

  const [updateSession, { loading: updateLoading }] = useMutation(UPDATE_COUNSELING_SESSION, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Counseling session updated successfully",
      });
      setIsEditModalOpen(false);
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

  const [deleteSession] = useMutation(DELETE_COUNSELING_SESSION, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Counseling session deleted successfully",
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
      sessionDate: '',
      sessionType: 'INDIVIDUAL',
      status: 'SCHEDULED',
      sessionNotes: '',
      privateNotes: '',
      homework: '',
      nextSteps: '',
      sessionNumber: 1,
      totalSessions: 1,
      progressNotes: '',
      isConfidential: false,
      followUpDate: '',
      primaryMemberId: '',
      counselorId: ''
    });
    setSelectedSession(null);
  };

  const handleCreateSession = async () => {
    try {
      await createSession({
        variables: {
          input: {
            ...formData,
            organisationId,
            branchId,
            sessionDate: new Date(formData.sessionDate).toISOString(),
            ...(formData.followUpDate && { followUpDate: new Date(formData.followUpDate).toISOString() }),
          }
        }
      });
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleUpdateSession = async () => {
    if (!selectedSession) return;
    
    try {
      await updateSession({
        variables: {
          input: {
            id: selectedSession.id,
            ...formData,
            sessionDate: new Date(formData.sessionDate).toISOString(),
            ...(formData.followUpDate && { followUpDate: new Date(formData.followUpDate).toISOString() }),
          }
        }
      });
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this counseling session?')) {
      try {
        await deleteSession({ variables: { id } });
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const handleEditSession = (session: CounselingSession) => {
    setSelectedSession(session);
    setFormData({
      title: session.title,
      description: session.description || '',
      sessionDate: format(new Date(session.sessionDate), 'yyyy-MM-dd'),
      sessionType: session.sessionType,
      status: session.status,
      sessionNotes: session.sessionNotes || '',
      privateNotes: session.privateNotes || '',
      homework: session.homework || '',
      nextSteps: session.nextSteps || '',
      sessionNumber: session.sessionNumber || 1,
      totalSessions: session.totalSessions || 1,
      progressNotes: session.progressNotes || '',
      isConfidential: session.isConfidential,
      followUpDate: session.followUpDate ? format(new Date(session.followUpDate), 'yyyy-MM-dd') : '',
      primaryMemberId: session.primaryMemberId,
      counselorId: session.counselorId || ''
    });
    setIsEditModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS':
        return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      case 'CANCELLED':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
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
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
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
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Sessions</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const sessions = data?.getCounselingSessions?.sessions || [];
  const totalSessions = data?.getCounselingSessions?.total || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Counseling Sessions</h2>
          <p className="text-gray-600 mt-1">Manage and track counseling sessions with members</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-600 rounded-t-lg"></div>
              <div className="relative pt-8 pb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <DialogHeader className="text-center">
                  <DialogTitle className="text-2xl font-bold text-white mb-2">Schedule Counseling Session</DialogTitle>
                  <p className="text-pink-100">Create a new counseling session for member support</p>
                </DialogHeader>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Session Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <Label className="text-sm font-semibold text-blue-900">Session Information</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm text-gray-700 mb-1 block">Session Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Session title"
                      className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionDate" className="text-sm text-gray-700 mb-1 block">Session Date</Label>
                    <Input
                      id="sessionDate"
                      type="date"
                      value={formData.sessionDate}
                      onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                      className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Session Configuration */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <Settings className="w-5 h-5 text-purple-600 mr-2" />
                  <Label className="text-sm font-semibold text-purple-900">Session Configuration</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sessionType" className="text-sm text-gray-700 mb-1 block">Session Type</Label>
                    <Select value={formData.sessionType} onValueChange={(value) => setFormData({ ...formData, sessionType: value })}>
                      <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INDIVIDUAL">👤 Individual</SelectItem>
                        <SelectItem value="COUPLE">💑 Couple</SelectItem>
                        <SelectItem value="FAMILY">👨‍👩‍👧‍👦 Family</SelectItem>
                        <SelectItem value="GROUP">👥 Group</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm text-gray-700 mb-1 block">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">📅 Scheduled</SelectItem>
                        <SelectItem value="IN_PROGRESS">⏳ In Progress</SelectItem>
                        <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                        <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-sm text-gray-700 mb-1 block">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      placeholder="60"
                      className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="location" className="text-sm text-gray-700 mb-1 block">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Session location"
                    className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <Label className="text-sm font-semibold text-green-900">Session Details</Label>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description" className="text-sm text-gray-700 mb-1 block">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the session purpose..."
                      rows={3}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionNotes" className="text-sm text-gray-700 mb-1 block">Session Notes</Label>
                    <Textarea
                      id="sessionNotes"
                      value={formData.sessionNotes}
                      onChange={(e) => setFormData({ ...formData, sessionNotes: e.target.value })}
                      placeholder="Session notes and observations..."
                      rows={3}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Options */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Repeat className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <Label className="text-sm font-semibold text-orange-900">Recurring Session</Label>
                      <p className="text-xs text-orange-600 mt-1">Enable for regular recurring sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="w-5 h-5 text-orange-600 bg-white border-orange-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </div>
                </div>
                {formData.isRecurring && (
                  <div className="mt-4">
                    <Label htmlFor="recurringPattern" className="text-sm text-gray-700 mb-1 block">Recurring Pattern</Label>
                    <Select value={formData.recurringPattern} onValueChange={(value) => setFormData({ ...formData, recurringPattern: value })}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEEKLY">📅 Weekly</SelectItem>
                        <SelectItem value="BIWEEKLY">📆 Bi-weekly</SelectItem>
                        <SelectItem value="MONTHLY">🗓️ Monthly</SelectItem>
                      </SelectContent>
                    </Select>
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
                  onClick={handleCreateSession}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
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
              placeholder="Search sessions..."
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
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
            <SelectItem value="COUPLE">Couple</SelectItem>
            <SelectItem value="FAMILY">Family</SelectItem>
            <SelectItem value="GROUP">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardContent className="p-0">
          {sessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Session Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Session #</TableHead>
                  <TableHead>Confidential</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session: CounselingSession) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        {session.description && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {session.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(session.sessionDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {session.sessionType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <Badge className={getStatusColor(session.status)}>
                          {session.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {session.sessionNumber} of {session.totalSessions}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {session.isConfidential ? (
                          <Lock className="h-4 w-4 text-red-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm">
                          {session.isConfidential ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(session.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSession(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
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
                icon={<MessageSquare />}
                title="No counseling sessions found"
                description="Schedule your first counseling session to get started"
                action={
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal - Similar structure to create modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Counseling Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as create modal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Session title"
                />
              </div>
              <div>
                <Label htmlFor="edit-sessionDate">Session Date</Label>
                <Input
                  id="edit-sessionDate"
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-sessionType">Session Type</Label>
                <Select value={formData.sessionType} onValueChange={(value) => setFormData({ ...formData, sessionType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="COUPLE">Couple</SelectItem>
                    <SelectItem value="FAMILY">Family</SelectItem>
                    <SelectItem value="GROUP">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-followUpDate">Follow-up Date (Optional)</Label>
                <Input
                  id="edit-followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-sessionNumber">Session Number</Label>
                <Input
                  id="edit-sessionNumber"
                  type="number"
                  min="1"
                  value={formData.sessionNumber}
                  onChange={(e) => setFormData({ ...formData, sessionNumber: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-totalSessions">Total Sessions</Label>
                <Input
                  id="edit-totalSessions"
                  type="number"
                  min="1"
                  value={formData.totalSessions}
                  onChange={(e) => setFormData({ ...formData, totalSessions: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Session description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-sessionNotes">Session Notes</Label>
              <Textarea
                id="edit-sessionNotes"
                value={formData.sessionNotes}
                onChange={(e) => setFormData({ ...formData, sessionNotes: e.target.value })}
                placeholder="Session notes"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-privateNotes">Private Notes</Label>
              <Textarea
                id="edit-privateNotes"
                value={formData.privateNotes}
                onChange={(e) => setFormData({ ...formData, privateNotes: e.target.value })}
                placeholder="Private notes (confidential)"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-homework">Homework</Label>
                <Textarea
                  id="edit-homework"
                  value={formData.homework}
                  onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                  placeholder="Homework assignments"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="edit-nextSteps">Next Steps</Label>
                <Textarea
                  id="edit-nextSteps"
                  value={formData.nextSteps}
                  onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                  placeholder="Next steps"
                  rows={2}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-progressNotes">Progress Notes</Label>
              <Textarea
                id="edit-progressNotes"
                value={formData.progressNotes}
                onChange={(e) => setFormData({ ...formData, progressNotes: e.target.value })}
                placeholder="Progress notes"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isConfidential"
                checked={formData.isConfidential}
                onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-isConfidential">Mark as confidential</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSession} disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update Session'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
