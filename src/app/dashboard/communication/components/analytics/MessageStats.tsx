"use client";

import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  BellIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MessageStats() {
  // Mock message statistics since the backend doesn't have messageStats query yet
  const stats = {
    totalSent: 245,
    emailStats: { sent: 150, opened: 98, clicked: 45 },
    smsStats: { sent: 75, delivered: 72 },
    notificationStats: { sent: 20, opened: 15 }
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Email Stats */}
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
              <EnvelopeIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.emailStats.sent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total emails sent
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
            <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
              <EyeIcon className="h-4 w-4" />
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
            <div className="mt-3">
              <Progress 
                value={stats.emailStats.sent > 0 ? (stats.emailStats.opened / stats.emailStats.sent) * 100 : 0} 
                className="h-1.5 bg-indigo-100" 
                indicatorClassName="bg-gradient-to-r from-indigo-500 to-indigo-600"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Click Rate</CardTitle>
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <CursorArrowRaysIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.emailStats.opened > 0 
                ? `${Math.round((stats.emailStats.clicked / stats.emailStats.opened) * 100)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.emailStats.clicked} of {stats.emailStats.opened} emails clicked
            </p>
            <div className="mt-3">
              <Progress 
                value={stats.emailStats.opened > 0 ? (stats.emailStats.clicked / stats.emailStats.opened) * 100 : 0} 
                className="h-1.5 bg-purple-100" 
                indicatorClassName="bg-gradient-to-r from-purple-500 to-purple-600"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* SMS Stats */}
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="h-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
            <div className="rounded-full bg-pink-100 p-2 text-pink-600">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-600">{stats.smsStats.sent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total SMS messages sent
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Email Performance</CardTitle>
              <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                <EnvelopeIcon className="h-5 w-5" />
              </div>
            </div>
            <CardDescription>Detailed email metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Sent</span>
                </div>
                <span className="text-sm font-bold">{stats.emailStats.sent}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></div>
                  <span className="text-sm font-medium">Opened</span>
                </div>
                <span className="text-sm font-bold">{stats.emailStats.opened}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium">Clicked</span>
                </div>
                <span className="text-sm font-bold">{stats.emailStats.clicked}</span>
              </div>
              <div className="pt-2">
                <Progress 
                  value={100} 
                  className="h-2 bg-slate-100" 
                  indicatorClassName="bg-blue-500"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1 bg-gradient-to-r from-pink-500 to-pink-600"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">SMS Performance</CardTitle>
              <div className="rounded-full bg-pink-100 p-2 text-pink-600">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </div>
            </div>
            <CardDescription>Detailed SMS metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-pink-500"></div>
                  <span className="text-sm font-medium">Sent</span>
                </div>
                <span className="text-sm font-bold">{stats.smsStats.sent}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Delivered</span>
                </div>
                <span className="text-sm font-bold">{stats.smsStats.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium">Delivery Rate</span>
                </div>
                <span className="text-sm font-bold">
                  {stats.smsStats.sent > 0 
                    ? `${Math.round((stats.smsStats.delivered / stats.smsStats.sent) * 100)}%` 
                    : '0%'}
                </span>
              </div>
              <div className="pt-2">
                <Progress 
                  value={stats.smsStats.sent > 0 ? (stats.smsStats.delivered / stats.smsStats.sent) * 100 : 0} 
                  className="h-2 bg-slate-100" 
                  indicatorClassName="bg-gradient-to-r from-pink-500 to-pink-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Notification Stats</CardTitle>
              <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                <BellIcon className="h-5 w-5" />
              </div>
            </div>
            <CardDescription>In-app notification metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium">Sent</span>
                </div>
                <span className="text-sm font-bold">{stats.notificationStats.sent}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Opened</span>
                </div>
                <span className="text-sm font-bold">{stats.notificationStats.opened}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">Open Rate</span>
                </div>
                <span className="text-sm font-bold">
                  {stats.notificationStats.sent > 0 
                    ? `${Math.round((stats.notificationStats.opened / stats.notificationStats.sent) * 100)}%` 
                    : '0%'}
                </span>
              </div>
              <div className="pt-2">
                <Progress 
                  value={stats.notificationStats.sent > 0 ? (stats.notificationStats.opened / stats.notificationStats.sent) * 100 : 0} 
                  className="h-2 bg-slate-100" 
                  indicatorClassName="bg-gradient-to-r from-amber-500 to-amber-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
