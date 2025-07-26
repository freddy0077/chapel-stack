"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  Zap, 
  Workflow,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  Users,
  Mail,
  MessageSquare,
  Bell,
  ArrowRight,
  Lightbulb,
  Target,
  Sparkles,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Wand2,
  Rocket,
  Heart,
  Gift,
  UserPlus,
  DollarSign,
  Send,
  Timer,
  CheckSquare,
  ArrowDown,
  MousePointer,
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { 
  GET_WORKFLOW_TEMPLATES, 
  GET_WORKFLOW_EXECUTIONS,
  DELETE_WORKFLOW_TEMPLATE,
  CREATE_PREDEFINED_WORKFLOWS,
  WorkflowTemplate,
  WorkflowExecution
} from '@/graphql/workflows';
import WorkflowTemplateModal from '@/components/workflows/WorkflowTemplateModal';
import WorkflowExecutionsList from '@/components/workflows/WorkflowExecutionsList';
import WorkflowStats from '@/components/workflows/WorkflowStats';

// Workflow templates for quick start
const WORKFLOW_SUGGESTIONS = [
  {
    id: 'welcome-new-members',
    title: 'Welcome New Members',
    description: 'Automatically send a warm welcome message and information packet to new members',
    icon: <UserPlus className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-600',
    category: 'Member Care',
    estimatedTime: '2 min setup',
    popularity: 95,
    trigger: 'When someone joins',
    actions: ['Send welcome email', 'Add to newcomers group', 'Schedule follow-up']
  },
  {
    id: 'event-reminders',
    title: 'Event Reminders',
    description: 'Send timely reminders for upcoming services, events, and activities',
    icon: <Calendar className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-600',
    category: 'Events',
    estimatedTime: '3 min setup',
    popularity: 88,
    trigger: 'Before events',
    actions: ['Email reminder', 'SMS notification', 'Calendar update']
  },
  {
    id: 'donation-thanks',
    title: 'Thank Donors',
    description: 'Express gratitude and provide receipts for donations automatically',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-pink-500 to-rose-600',
    category: 'Giving',
    estimatedTime: '2 min setup',
    popularity: 92,
    trigger: 'After donations',
    actions: ['Thank you email', 'Generate receipt', 'Update records']
  },
  {
    id: 'birthday-wishes',
    title: 'Birthday Celebrations',
    description: 'Never miss a birthday - send personalized wishes to members',
    icon: <Gift className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-600',
    category: 'Member Care',
    estimatedTime: '1 min setup',
    popularity: 85,
    trigger: 'On birthdays',
    actions: ['Birthday email', 'Add to prayer list', 'Send card']
  },
  {
    id: 'follow-up-visitors',
    title: 'Follow Up Visitors',
    description: 'Nurture first-time visitors with thoughtful follow-up communications',
    icon: <Smile className="h-6 w-6" />,
    color: 'from-orange-500 to-amber-600',
    category: 'Outreach',
    estimatedTime: '3 min setup',
    popularity: 78,
    trigger: 'After first visit',
    actions: ['Welcome message', 'Information packet', 'Invitation to connect']
  },
  {
    id: 'membership-renewal',
    title: 'Membership Renewal',
    description: 'Gentle reminders for membership renewals and updates',
    icon: <Timer className="h-6 w-6" />,
    color: 'from-indigo-500 to-blue-600',
    category: 'Administration',
    estimatedTime: '2 min setup',
    popularity: 71,
    trigger: 'Before expiration',
    actions: ['Renewal reminder', 'Update form', 'Schedule meeting']
  }
];

export default function WorkflowsPage() {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId, hasAccess } = useOrganisationBranch();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreatingTemplates, setIsCreatingTemplates] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // GraphQL queries
  const { data: templatesData, loading: templatesLoading, refetch: refetchTemplates } = useQuery(
    GET_WORKFLOW_TEMPLATES,
    {
      variables: {
        organisationId,
        branchId,
      },
      skip: !organisationId,
    }
  );

  const { data: executionsData, loading: executionsLoading } = useQuery(
    GET_WORKFLOW_EXECUTIONS,
    {
      variables: {
        organisationId,
        branchId,
      },
      skip: !organisationId,
    }
  );

  // GraphQL mutations
  const [deleteTemplate] = useMutation(DELETE_WORKFLOW_TEMPLATE);
  const [createPredefinedWorkflows] = useMutation(CREATE_PREDEFINED_WORKFLOWS);

  const templates = templatesData?.workflowTemplates || [];
  const executions = executionsData?.workflowExecutions || [];

  // Check if user is new to workflows
  useEffect(() => {
    if (templates.length === 0 && !templatesLoading) {
      setShowOnboarding(true);
    }
  }, [templates.length, templatesLoading]);

  // Filter templates based on search and status
  const filteredTemplates = templates.filter((template: WorkflowTemplate) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePredefinedWorkflows = async () => {
    if (isCreatingTemplates) return;
    setIsCreatingTemplates(true);

    try {
      if (organisationId) {
        await createPredefinedWorkflows({
          variables: {
            organisationId,
            branchId: branchId || null,
          },
        });
      } else {
        await createPredefinedWorkflows();
      }
      
      toast({
        title: '🎉 Success!',
        description: 'Your workflow templates are ready to use!',
      });
      
      await refetchTemplates();
      setShowOnboarding(false);
      
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTemplates(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate({
        variables: { 
          id,
          organisationId,
          branchId,
        },
      });
      toast({
        title: 'Deleted',
        description: 'Workflow template removed successfully',
      });
      refetchTemplates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete workflow template',
        variant: 'destructive',
      });
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', template?: WorkflowTemplate) => {
    setModalMode(mode);
    setSelectedTemplate(template || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
    refetchTemplates();
  };

  // Calculate stats
  const activeTemplates = templates.filter((t: WorkflowTemplate) => t.status === 'ACTIVE').length;
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter((e: WorkflowExecution) => e.status === 'COMPLETED').length;
  const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0;

  // Onboarding Experience
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Workflow Automation! ✨
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your church operations with intelligent automation. 
              Save hours every week by automating repetitive tasks and never miss important follow-ups again.
            </p>
          </div>

          {/* Quick Start Options */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <span className="text-lg font-medium text-gray-700">Choose your starting point</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-all duration-200 cursor-pointer group"
                    onClick={handleCreatePredefinedWorkflows}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Wand2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Setup</h3>
                  <p className="text-gray-600 mb-4">
                    Get started instantly with pre-built workflow templates for common church activities
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    disabled={isCreatingTemplates}
                  >
                    {isCreatingTemplates ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full"></div>
                        Setting up...
                      </div>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Create Templates
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed border-green-200 hover:border-green-400 transition-all duration-200 cursor-pointer group"
                    onClick={() => openModal('create')}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Build</h3>
                  <p className="text-gray-600 mb-4">
                    Create a completely custom workflow tailored to your specific needs
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Build Custom
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Popular Workflow Ideas */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Workflow Ideas</h2>
              <p className="text-gray-600">See what other churches are automating</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WORKFLOW_SUGGESTIONS.map((suggestion) => (
                <Card key={suggestion.id} 
                      className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-0 ${
                        selectedSuggestion === suggestion.id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${suggestion.color} rounded-lg text-white`}>
                        {suggestion.icon}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.popularity}% use this
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{suggestion.estimatedTime}</span>
                      <span>{suggestion.category}</span>
                    </div>
                    
                    {selectedSuggestion === suggestion.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Zap className="h-3 w-3 mr-2 text-indigo-500" />
                            <span className="font-medium">Trigger:</span>
                            <span className="ml-1">{suggestion.trigger}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <CheckSquare className="h-3 w-3 mr-2 text-green-500" />
                              <span className="font-medium">Actions:</span>
                            </div>
                            {suggestion.actions.map((action, index) => (
                              <div key={index} className="flex items-center text-sm text-gray-500 ml-5">
                                <ArrowRight className="h-3 w-3 mr-2" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-4">
                  <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Need Help Getting Started?</h3>
                </div>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our team is here to help you set up workflows that will transform your church operations. 
                  We can guide you through the process step by step.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Guide
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Get Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard (after onboarding)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
                <p className="text-sm text-gray-600">
                  {activeTemplates} active • {totalExecutions} total runs • {successRate}% success rate
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => openModal('create')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white shadow-sm border">
              <TabsTrigger value="templates">
                <Workflow className="h-4 w-4 mr-2" />
                Templates ({templates.length})
              </TabsTrigger>
              <TabsTrigger value="executions">
                <Play className="h-4 w-4 mr-2" />
                Activity ({executions.length})
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
            </div>
          </div>

          <TabsContent value="templates">
            {filteredTemplates.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No workflows yet</h3>
                  <p className="text-gray-600 mb-6">Create your first workflow to get started</p>
                  <Button onClick={() => openModal('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template: WorkflowTemplate) => (
                  <Card key={template.id} className="hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                            <Workflow className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <Badge className={`mt-1 ${
                              template.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              template.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {template.status}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openModal('view', template)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openModal('edit', template)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{template.actions?.length || 0} actions</span>
                        <span>{template.triggerType.replace('_', ' ').toLowerCase()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="executions">
            <WorkflowExecutionsList executions={executions} loading={executionsLoading} />
          </TabsContent>

          <TabsContent value="analytics">
            <WorkflowStats templates={templates} executions={executions} loading={templatesLoading || executionsLoading} />
          </TabsContent>
        </Tabs>
      </div>

      <WorkflowTemplateModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        template={selectedTemplate}
        organisationId={organisationId}
        branchId={branchId}
      />
    </div>
  );
}
