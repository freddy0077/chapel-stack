"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Bell,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import {
  GET_FOLLOW_UP_REMINDERS,
  CREATE_FOLLOW_UP_REMINDER,
  UPDATE_FOLLOW_UP_REMINDER,
  COMPLETE_FOLLOW_UP_REMINDER,
  FollowUpReminder,
} from "@/graphql/pastoral-care";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

interface FollowUpRemindersManagementProps {
  className?: string;
}

export function FollowUpRemindersManagement({
  className,
}: FollowUpRemindersManagementProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] =
    useState<FollowUpReminder | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    followUpType: "PASTORAL_VISIT",
    dueDate: "",
    reminderDate: "",
    status: "PENDING",
    notes: "",
    actionRequired: "",
    memberId: "",
    assignedToId: "",
  });

  const { data, loading, error, refetch } = useQuery(GET_FOLLOW_UP_REMINDERS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { followUpType: typeFilter }),
        ...(searchTerm && { title: searchTerm }),
      },
      skip: currentPage * pageSize,
      take: pageSize,
    },
    skip: !organisationId,
  });

  const [createReminder, { loading: createLoading }] = useMutation(
    CREATE_FOLLOW_UP_REMINDER,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Follow-up reminder created successfully",
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
    },
  );

  const [updateReminder, { loading: updateLoading }] = useMutation(
    UPDATE_FOLLOW_UP_REMINDER,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Follow-up reminder updated successfully",
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
    },
  );

  const [completeReminder] = useMutation(COMPLETE_FOLLOW_UP_REMINDER, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Follow-up reminder completed successfully",
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
      title: "",
      description: "",
      followUpType: "PASTORAL_VISIT",
      dueDate: "",
      reminderDate: "",
      status: "PENDING",
      notes: "",
      actionRequired: "",
      memberId: "",
      assignedToId: "",
    });
    setSelectedReminder(null);
  };

  const handleCreateReminder = async () => {
    try {
      await createReminder({
        variables: {
          input: {
            ...formData,
            organisationId,
            branchId,
            dueDate: new Date(formData.dueDate).toISOString(),
            ...(formData.reminderDate && {
              reminderDate: new Date(formData.reminderDate).toISOString(),
            }),
          },
        },
      });
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  const handleUpdateReminder = async () => {
    if (!selectedReminder) return;

    try {
      await updateReminder({
        variables: {
          input: {
            id: selectedReminder.id,
            ...formData,
            dueDate: new Date(formData.dueDate).toISOString(),
            ...(formData.reminderDate && {
              reminderDate: new Date(formData.reminderDate).toISOString(),
            }),
          },
        },
      });
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  const handleCompleteReminder = async (id: string) => {
    const notes = prompt("Add completion notes (optional):");
    try {
      await completeReminder({
        variables: {
          id,
          ...(notes && { notes }),
        },
      });
    } catch (error) {
      console.error("Error completing reminder:", error);
    }
  };

  const handleEditReminder = (reminder: FollowUpReminder) => {
    setSelectedReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description || "",
      followUpType: reminder.followUpType,
      dueDate: format(new Date(reminder.dueDate), "yyyy-MM-dd"),
      reminderDate: reminder.reminderDate
        ? format(new Date(reminder.reminderDate), "yyyy-MM-dd")
        : "",
      status: reminder.status,
      notes: reminder.notes || "",
      actionRequired: reminder.actionRequired || "",
      memberId: reminder.memberId || "",
      assignedToId: reminder.assignedToId || "",
    });
    setIsEditModalOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "OVERDUE":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== "COMPLETED" && new Date(dueDate) < new Date();
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Reminders
          </h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const reminders = data?.getFollowUpReminders?.reminders || [];
  const totalReminders = data?.getFollowUpReminders?.total || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Follow-up Reminders
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and track follow-up reminders for pastoral care
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-600 rounded-t-lg"></div>
              <div className="relative pt-8 pb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg">
                  <Bell className="w-8 h-8 text-indigo-600" />
                </div>
                <DialogHeader className="text-center">
                  <DialogTitle className="text-2xl font-bold text-white mb-2">
                    Create Follow-up Reminder
                  </DialogTitle>
                  <p className="text-blue-100">
                    Set up a new follow-up reminder for pastoral care
                  </p>
                </DialogHeader>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Reminder Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <Label className="text-sm font-semibold text-blue-900">
                    Reminder Information
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Reminder Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Reminder title"
                      className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="followUpType"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Follow-up Type
                    </Label>
                    <Select
                      value={formData.followUpType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, followUpType: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PASTORAL_VISIT">
                          🏠 Pastoral Visit
                        </SelectItem>
                        <SelectItem value="COUNSELING_SESSION">
                          💬 Counseling Session
                        </SelectItem>
                        <SelectItem value="PHONE_CALL">
                          📞 Phone Call
                        </SelectItem>
                        <SelectItem value="EMAIL">📧 Email</SelectItem>
                        <SelectItem value="PRAYER_REQUEST">
                          🙏 Prayer Request
                        </SelectItem>
                        <SelectItem value="OTHER">📋 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Schedule Configuration */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                  <Label className="text-sm font-semibold text-purple-900">
                    Schedule Configuration
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="dueDate"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="reminderDate"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Reminder Date
                    </Label>
                    <Input
                      id="reminderDate"
                      type="date"
                      value={formData.reminderDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reminderDate: e.target.value,
                        })
                      }
                      className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label
                    htmlFor="status"
                    className="text-sm text-gray-700 mb-1 block"
                  >
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">⏳ Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        🔄 In Progress
                      </SelectItem>
                      <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                      <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reminder Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <Label className="text-sm font-semibold text-green-900">
                    Reminder Details
                  </Label>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Detailed description of the follow-up reminder..."
                      rows={3}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="notes"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Additional notes or context..."
                      rows={3}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="actionRequired"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Action Required
                    </Label>
                    <Textarea
                      id="actionRequired"
                      value={formData.actionRequired}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actionRequired: e.target.value,
                        })
                      }
                      placeholder="Specific actions that need to be taken..."
                      rows={2}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                </div>
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
                  onClick={handleCreateReminder}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Reminder
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
              placeholder="Search reminders..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PASTORAL_VISIT">Pastoral Visit</SelectItem>
            <SelectItem value="COUNSELING_SESSION">
              Counseling Session
            </SelectItem>
            <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="PRAYER_REQUEST">Prayer Request</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reminders Table */}
      <Card>
        <CardContent className="p-0">
          {reminders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Required</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((reminder: FollowUpReminder) => (
                  <TableRow
                    key={reminder.id}
                    className={
                      isOverdue(reminder.dueDate, reminder.status)
                        ? "bg-red-50"
                        : ""
                    }
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        {reminder.description && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {reminder.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {reminder.followUpType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span
                          className={
                            isOverdue(reminder.dueDate, reminder.status)
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(reminder.status)}
                        <Badge className={getStatusColor(reminder.status)}>
                          {reminder.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reminder.actionRequired ? (
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {reminder.actionRequired}
                        </p>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reminder.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {reminder.status !== "COMPLETED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCompleteReminder(reminder.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditReminder(reminder)}
                        >
                          <Edit className="h-4 w-4" />
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
                icon={<Bell />}
                title="No follow-up reminders found"
                description="Create your first follow-up reminder to get started"
                action={
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Reminder
                  </Button>
                }
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Follow-up Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Reminder title"
                />
              </div>
              <div>
                <Label htmlFor="edit-followUpType">Follow-up Type</Label>
                <Select
                  value={formData.followUpType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, followUpType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASTORAL_VISIT">
                      Pastoral Visit
                    </SelectItem>
                    <SelectItem value="COUNSELING_SESSION">
                      Counseling Session
                    </SelectItem>
                    <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="PRAYER_REQUEST">
                      Prayer Request
                    </SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-dueDate">Due Date</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-reminderDate">
                  Reminder Date (Optional)
                </Label>
                <Input
                  id="edit-reminderDate"
                  type="date"
                  value={formData.reminderDate}
                  onChange={(e) =>
                    setFormData({ ...formData, reminderDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Reminder description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-actionRequired">Action Required</Label>
              <Textarea
                id="edit-actionRequired"
                value={formData.actionRequired}
                onChange={(e) =>
                  setFormData({ ...formData, actionRequired: e.target.value })
                }
                placeholder="What action needs to be taken?"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional notes"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateReminder} disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update Reminder"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
