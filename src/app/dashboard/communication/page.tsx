"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashboardHeader from "@/components/DashboardHeader";
import EmptyState from "./components/EmptyState";
import NewMessageModal from "./components/messages/NewMessageModal";
import RecentMessages from "./components/messages/RecentMessages";
import MessageStats from "./components/analytics/MessageStats";

export default function CommunicationDashboard() {
  const router = useRouter();
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock message statistics since the backend doesn't have messageStats query yet
  const stats = {
    totalSent: 245,
    emailStats: { sent: 150, opened: 98, clicked: 45 },
    smsStats: { sent: 75, delivered: 72 },
    notificationStats: { sent: 20, opened: 15 }
  };
  
  // Navigation handlers
  const navigateTo = (path: string) => {
    router.push(`/dashboard/communication/${path}`);
  };
  
  return (
    <>
      <DashboardHeader
        title="Communication"
        subtitle="Manage all your church communications in one place"
        action={
          <Button 
            onClick={() => setIsNewMessageModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Message
          </Button>
        }
      />
      
      <div className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Overview</TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Messages</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Templates</TabsTrigger>
            <TabsTrigger value="scheduled" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Scheduled</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                    <EnvelopeIcon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalSent}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Messages sent across all channels
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
                  <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                    <EnvelopeIcon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-600">
                    {stats.emailStats.sent > 0 
                      ? `${Math.round((stats.emailStats.opened / stats.emailStats.sent) * 100)}%` 
                      : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.emailStats.opened} of {stats.emailStats.sent} emails opened
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SMS Delivery Rate</CardTitle>
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.smsStats.sent > 0 
                      ? `${Math.round((stats.smsStats.delivered / stats.smsStats.sent) * 100)}%` 
                      : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.smsStats.delivered} of {stats.smsStats.sent} SMS delivered
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="h-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notification Open Rate</CardTitle>
                  <div className="rounded-full bg-pink-100 p-2 text-pink-600">
                    <BellIcon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-600">
                    {stats.notificationStats.sent > 0 
                      ? `${Math.round((stats.notificationStats.opened / stats.notificationStats.sent) * 100)}%` 
                      : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.notificationStats.opened} of {stats.notificationStats.sent} notifications opened
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-200" onClick={() => navigateTo('messages')}>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-200">
                    <EnvelopeIcon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <CardDescription>View and manage all messages</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-blue-600 transition-colors duration-200">
                    View Messages
                    <ArrowRightIcon className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-200" onClick={() => navigateTo('templates')}>
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform duration-200">
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Templates</CardTitle>
                  <CardDescription>Create and manage message templates</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-indigo-600 transition-colors duration-200">
                    View Templates
                    <ArrowRightIcon className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-200" onClick={() => navigateTo('scheduled')}>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform duration-200">
                    <ClockIcon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Scheduled</CardTitle>
                  <CardDescription>Manage scheduled messages</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-purple-600 transition-colors duration-200">
                    View Scheduled
                    <ArrowRightIcon className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-200" onClick={() => navigateTo('analytics')}>
                <div className="h-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-pink-100 p-3 w-12 h-12 flex items-center justify-center text-pink-600 mb-3 group-hover:scale-110 transition-transform duration-200">
                    <ChartBarIcon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <CardDescription>View message performance analytics</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full justify-between group-hover:text-pink-600 transition-colors duration-200">
                    View Analytics
                    <ArrowRightIcon className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Recent Messages */}
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <CardHeader>
                <CardTitle className="text-xl">Recent Messages</CardTitle>
                <CardDescription>Your most recently sent messages</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentMessages limit={5} />
              </CardContent>
              <CardFooter className="border-t bg-slate-50 py-3">
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-slate-100 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => navigateTo('messages')}
                >
                  View All Messages
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader>
                <CardTitle className="text-xl">All Messages</CardTitle>
                <CardDescription>View and manage all your messages</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('messages')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Go to Messages
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
              <CardHeader>
                <CardTitle className="text-xl">Message Templates</CardTitle>
                <CardDescription>Create and manage message templates</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('templates')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Go to Templates
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <CardHeader>
                <CardTitle className="text-xl">Scheduled Messages</CardTitle>
                <CardDescription>View and manage scheduled messages</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('scheduled')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Go to Scheduled Messages
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="h-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
              <CardHeader>
                <CardTitle className="text-xl">Message Analytics</CardTitle>
                <CardDescription>View detailed message performance analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigateTo('analytics')}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Go to Analytics
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Message Modal */}
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onSuccess={() => {
          setIsNewMessageModalOpen(false);
          // Optionally refresh data
        }}
      />
    </>
  );
}
