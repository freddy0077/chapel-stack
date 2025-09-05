"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  Church,
  Award,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  BarChart3,
  Zap,
  Star,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Sparkles,
} from "lucide-react";
import ModernTemplateSelector from "./ModernTemplateSelector";
import CertificateGenerationWizard from "./CertificateGenerationWizard";
import {
  useCertificateManagementDashboard,
  useTemplateManagement,
} from "@/graphql/hooks/useCertificateManagement";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import { formatDistanceToNow } from "date-fns";

interface CertificateManagementDashboardProps {
  onTemplateSelect?: (templateId: string) => void;
  onGenerateCertificate?: (
    sacramentalRecordId: string,
    templateId: string,
  ) => void;
}

const CertificateManagementDashboard: React.FC<
  CertificateManagementDashboardProps
> = ({ onTemplateSelect, onGenerateCertificate }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDenomination, setSelectedDenomination] = useState<string>("");
  const [selectedSacramentType, setSelectedSacramentType] =
    useState<string>("");
  const [showWizard, setShowWizard] = useState(false);

  // Get current branch for filtering
  const { currentBranch } = useOrganizationBranchFilter();
  const branchId = currentBranch?.id;

  // Fetch real-time data from backend
  const {
    stats,
    recentCertificates,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useCertificateManagementDashboard(branchId);

  const {
    templates,
    denominations,
    sacramentTypes,
    loading: templateLoading,
    error: templateError,
  } = useTemplateManagement(
    searchTerm,
    selectedDenomination,
    selectedSacramentType,
  );

  // Safely extract data with fallbacks
  const templatesData = templates?.data || [];
  const denominationsData = denominations?.data || [];
  const sacramentTypesData = sacramentTypes?.data || [];
  const statsData = stats?.data || {};
  const recentCertificatesData = recentCertificates?.data || [];

  // Mock sacramental records for wizard (in production, this would come from GraphQL)
  const mockSacramentalRecords = [
    {
      id: "1",
      memberName: "John Smith",
      sacramentType: "BAPTISM",
      denomination: "CATHOLIC",
      dateOfSacrament: "2024-01-15",
      location: "St. Mary's Cathedral",
      officiant: "Father Michael Johnson",
    },
    {
      id: "2",
      memberName: "Sarah Williams",
      sacramentType: "CONFIRMATION",
      denomination: "BAPTIST",
      dateOfSacrament: "2024-02-20",
      location: "First Baptist Church",
      officiant: "Pastor David Brown",
    },
    {
      id: "3",
      memberName: "Emily Davis",
      sacramentType: "EUCHARIST_FIRST_COMMUNION",
      denomination: "LUTHERAN",
      dateOfSacrament: "2024-03-10",
      location: "Grace Lutheran Church",
      officiant: "Pastor Lisa Anderson",
    },
  ];

  // Extract stats with fallbacks
  const totalGenerated = statsData.totalGenerated || 0;
  const thisMonth = statsData.thisMonth || 0;
  const totalTemplates = statsData.totalTemplates || 0;
  const totalDenominations = statsData.totalDenominations || 0;

  // Handle certificate generation completion
  const handleCertificateGeneration = (certificateData: any) => {
    console.log("Generating certificate with data:", certificateData);
    // In production, this would call the GraphQL mutation
    if (onGenerateCertificate) {
      onGenerateCertificate(
        certificateData.sacramentalRecordId,
        certificateData.templateId,
      );
    }
    // Show success message and redirect to recent certificates
    setActiveTab("recent");
    // Refetch data to show the new certificate
    refetchDashboard();
  };

  // Handle loading and error states
  if (dashboardLoading || templateLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading certificate management system...</span>
        </div>
      </div>
    );
  }

  if (dashboardError || templateError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">
            Error loading certificate management system
          </p>
          <Button
            variant="outline"
            onClick={() => {
              refetchDashboard();
            }}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
      case "GENERATING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "FAILED":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
      case "GENERATING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Certificate Management
          </h2>
          <p className="text-muted-foreground">
            Professional certificate generation for all Christian denominations
          </p>
        </div>
        <Button onClick={refetchDashboard} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="denominations">Denominations</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Generated
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalGenerated.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{statsData.monthlyGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{thisMonth || "0"}</div>
                <p className="text-xs text-muted-foreground">
                  {statsData.pending || 0} pending generation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTemplates}</div>
                <p className="text-xs text-muted-foreground">
                  Professional designs available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Denominations
                </CardTitle>
                <Church className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDenominations}</div>
                <p className="text-xs text-muted-foreground">
                  Christian traditions supported
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Features */}
          <Card>
            <CardHeader>
              <CardTitle>System Features</CardTitle>
              <CardDescription>
                Comprehensive certificate management for all church needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Universal Compatibility</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Works with all {totalDenominations} major Christian
                    denominations
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Theological Accuracy</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Content reviewed by liturgical experts
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Smart Automation</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Auto-detects denomination and suggests templates
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Professional Quality</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    High-resolution templates for official documents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common certificate management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("generate")}
                  className="justify-start bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/30"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("templates")}
                  className="justify-start"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Templates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("recent")}
                  className="justify-start"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Recent Certificates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("denominations")}
                  className="justify-start"
                >
                  <Church className="h-4 w-4 mr-2" />
                  View Denominations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generate Certificate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <CertificateGenerationWizard
            onComplete={handleCertificateGeneration}
            onCancel={() => setActiveTab("overview")}
            templates={templatesData}
            sacramentalRecords={mockSacramentalRecords}
            loading={dashboardLoading}
          />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <ModernTemplateSelector
            onTemplateSelect={onTemplateSelect}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDenomination={selectedDenomination}
            onDenominationChange={setSelectedDenomination}
            selectedSacramentType={selectedSacramentType}
            onSacramentTypeChange={setSelectedSacramentType}
            templates={templatesData}
            denominations={denominationsData}
            sacramentTypes={sacramentTypesData}
            loading={templateLoading}
          />
        </TabsContent>

        {/* Denominations Tab */}
        <TabsContent value="denominations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Denominations</CardTitle>
              <CardDescription>
                {totalDenominations} major Christian traditions with
                liturgically accurate templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {denominationsData.map((denomination: string) => (
                  <Card key={denomination} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {denomination.replace("_", " ")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Professional templates available
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {
                          templatesData.filter(
                            (t: any) => t.denomination === denomination,
                          ).length
                        }
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Certificates Tab */}
        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Certificates</CardTitle>
              <CardDescription>
                Recently generated certificates and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCertificatesData.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No certificates generated yet
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("templates")}
                      className="mt-2"
                    >
                      Browse Templates
                    </Button>
                  </div>
                ) : (
                  recentCertificatesData.map((certificate: any) => (
                    <div
                      key={certificate.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(certificate.status)}
                        <div>
                          <p className="font-medium">
                            {certificate.memberName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {certificate.sacramentType.replace("_", " ")} •{" "}
                            {certificate.templateName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(certificate.generatedAt),
                              { addSuffix: true },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(certificate.status)}>
                          {certificate.status}
                        </Badge>
                        {certificate.downloadUrl &&
                          certificate.status === "COMPLETED" && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={certificate.downloadUrl} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificateManagementDashboard;
