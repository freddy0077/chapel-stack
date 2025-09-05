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
  Heart,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Settings,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import {
  GET_CARE_REQUESTS,
  CREATE_CARE_REQUEST,
  UPDATE_CARE_REQUEST,
  DELETE_CARE_REQUEST,
  CareRequest,
} from "@/graphql/pastoral-care";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";

interface CareRequestsManagementProps {
  className?: string;
}

export function CareRequestsManagement({
  className,
}: CareRequestsManagementProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CareRequest | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestType: "COUNSELING",
    priority: "MEDIUM",
    status: "SUBMITTED",
    notes: "",
    requestDate: new Date().toISOString().split("T")[0],
    requesterId: "",
    assignedPastorId: "",
    expectedCompletionDate: "",
    completionDate: "",
  });

  const { data, loading, error, refetch } = useQuery(GET_CARE_REQUESTS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
        ...(searchTerm && { title: searchTerm }),
      },
      skip: currentPage * pageSize,
      take: pageSize,
    },
    skip: !organisationId,
  });

  const [createRequest, { loading: createLoading }] = useMutation(
    CREATE_CARE_REQUEST,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Care request created successfully",
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

  const [updateRequest, { loading: updateLoading }] = useMutation(
    UPDATE_CARE_REQUEST,
    {
      onCompleted: () => {
        toast({
          title: "Success",
          description: "Care request updated successfully",
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

  const [deleteRequest] = useMutation(DELETE_CARE_REQUEST, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Care request deleted successfully",
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
      requestType: "COUNSELING",
      priority: "MEDIUM",
      status: "SUBMITTED",
      notes: "",
      requestDate: new Date().toISOString().split("T")[0],
      requesterId: "",
      assignedPastorId: "",
      expectedCompletionDate: "",
      completionDate: "",
    });
    setSelectedRequest(null);
  };

  const handleCreateRequest = async () => {
    try {
      await createRequest({
        variables: {
          input: {
            ...formData,
            organisationId,
            branchId,
            requestDate: new Date(formData.requestDate).toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      await updateRequest({
        variables: {
          input: {
            id: selectedRequest.id,
            ...formData,
            requestDate: new Date(formData.requestDate).toISOString(),
          },
        },
      });
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this care request?")) {
      try {
        await deleteRequest({ variables: { id } });
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleEditRequest = (request: CareRequest) => {
    setSelectedRequest(request);
    setFormData({
      title: request.title,
      description: request.description || "",
      requestType: request.requestType,
      priority: request.priority,
      status: request.status,
      notes: request.notes || "",
      requestDate: format(new Date(request.requestDate), "yyyy-MM-dd"),
      requesterId: request.requesterId,
      assignedPastorId: request.assignedPastorId || "",
      expectedCompletionDate: request.expectedCompletionDate || "",
      completionDate: request.completionDate || "",
    });
    setIsEditModalOpen(true);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "HIGH":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "MEDIUM":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "LOW":
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "SUBMITTED":
        return <User className="h-4 w-4 text-purple-500" />;
      case "CANCELLED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "SUBMITTED":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Care Requests
          </h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const requests = data?.getCareRequests?.requests || [];
  const totalRequests = data?.getCareRequests?.total || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Care Requests</h2>
          <p className="text-gray-600 mt-1">
            Manage and track care requests from members
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header with gradient background */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 rounded-t-lg"></div>
              <div className="relative pt-8 pb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg">
                  <Heart className="w-8 h-8 text-rose-600" />
                </div>
                <DialogHeader className="text-center">
                  <DialogTitle className="text-2xl font-bold text-white mb-2">
                    Create Care Request
                  </DialogTitle>
                  <p className="text-pink-100">
                    Submit a new care request for member support
                  </p>
                </DialogHeader>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-6">
              {/* Request Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <Label className="text-sm font-semibold text-blue-900">
                    Request Information
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Request Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Request title"
                      className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="requestDate"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Request Date
                    </Label>
                    <Input
                      id="requestDate"
                      type="date"
                      value={formData.requestDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestDate: e.target.value,
                        })
                      }
                      className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Request Configuration */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <Settings className="w-5 h-5 text-purple-600 mr-2" />
                  <Label className="text-sm font-semibold text-purple-900">
                    Request Configuration
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label
                      htmlFor="requestType"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Request Type
                    </Label>
                    <Select
                      value={formData.requestType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, requestType: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COUNSELING">
                          💬 Counseling
                        </SelectItem>
                        <SelectItem value="PRAYER">🙏 Prayer</SelectItem>
                        <SelectItem value="HOSPITAL_VISIT">
                          🏥 Hospital Visit
                        </SelectItem>
                        <SelectItem value="HOME_VISIT">
                          🏠 Home Visit
                        </SelectItem>
                        <SelectItem value="FINANCIAL_ASSISTANCE">
                          💰 Financial Assistance
                        </SelectItem>
                        <SelectItem value="SPIRITUAL_GUIDANCE">
                          ✨ Spiritual Guidance
                        </SelectItem>
                        <SelectItem value="OTHER">📋 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="priority"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Priority
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="URGENT">🔴 Urgent</SelectItem>
                        <SelectItem value="HIGH">🟠 High</SelectItem>
                        <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                        <SelectItem value="LOW">🟢 Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
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
                        <SelectItem value="SUBMITTED">📝 Submitted</SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          ⏳ In Progress
                        </SelectItem>
                        <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                        <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <Label className="text-sm font-semibold text-green-900">
                    Request Details
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
                      placeholder="Detailed description of the care request..."
                      rows={4}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="notes"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Any additional notes or context..."
                      rows={3}
                      className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Completion Information */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  <Label className="text-sm font-semibold text-orange-900">
                    Completion Information
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="expectedCompletionDate"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Expected Completion Date
                    </Label>
                    <Input
                      id="expectedCompletionDate"
                      type="date"
                      value={formData.expectedCompletionDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedCompletionDate: e.target.value,
                        })
                      }
                      className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="completionDate"
                      className="text-sm text-gray-700 mb-1 block"
                    >
                      Actual Completion Date
                    </Label>
                    <Input
                      id="completionDate"
                      type="date"
                      value={formData.completionDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          completionDate: e.target.value,
                        })
                      }
                      className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400"
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
                  onClick={handleCreateRequest}
                  className="px-6 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
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
              placeholder="Search requests..."
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
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          {requests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request: CareRequest) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.title}</p>
                        {request.description && (
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {request.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {request.requestType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(request.priority)}
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.requestDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRequest(request)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRequest(request.id)}
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
                icon={<Heart />}
                title="No care requests found"
                description="Create your first care request to get started"
                action={
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Request
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
            <DialogTitle>Edit Care Request</DialogTitle>
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
                  placeholder="Request title"
                />
              </div>
              <div>
                <Label htmlFor="edit-requestDate">Request Date</Label>
                <Input
                  id="edit-requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={(e) =>
                    setFormData({ ...formData, requestDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-requestType">Request Type</Label>
                <Select
                  value={formData.requestType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, requestType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COUNSELING">Counseling</SelectItem>
                    <SelectItem value="PRAYER">Prayer</SelectItem>
                    <SelectItem value="HOSPITAL_VISIT">
                      Hospital Visit
                    </SelectItem>
                    <SelectItem value="HOME_VISIT">Home Visit</SelectItem>
                    <SelectItem value="FINANCIAL_ASSISTANCE">
                      Financial Assistance
                    </SelectItem>
                    <SelectItem value="SPIRITUAL_GUIDANCE">
                      Spiritual Guidance
                    </SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
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
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
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
                placeholder="Request description"
                rows={3}
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
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateRequest} disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
