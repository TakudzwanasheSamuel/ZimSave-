
"use client";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationItem, type Notification } from "@/components/notifications/notification-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BellRing, CheckCheck } from "lucide-react";
import Image from "next/image";

const mockNotifications: Notification[] = [
  { id: "1", type: "group_invite", title: "Mukando Invite", message: "You've been invited to join 'Sunrise Savers'.", timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: "2", type: "success", title: "Contribution Confirmed", message: "Your $5.00 USD contribution to 'Micro Venture Fund' was successful.", timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), read: false },
  { id: "3", type: "warning", title: "Policy Renewal Due", message: "Your Basic Health Cover renews in 7 days. Premium: $2.00 USD.", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), read: true },
  { id: "4", type: "info", title: "New Feature: Savings Goals", message: "You can now set and track targeted savings goals in your wallet!", timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), read: true },
  { id: "5", type: "error", title: "Failed Transaction", message: "Your transfer of $2.50 USD to J. Moyo failed. Please try again.", timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), read: false },
];


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`}
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
          ) : null
        }
      />

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
             <CardTitle className="text-xl text-primary">Recent Alerts</CardTitle>
             <BellRing className="h-6 w-6 text-primary"/>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-18rem)] md:h-[calc(100vh-20rem)]"> {/* Adjust height */}
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <Image src="https://placehold.co/300x200.png" alt="No notifications placeholder" width={300} height={200} className="mx-auto rounded-md mb-4" data-ai-hint="empty notification" />
                <p>No notifications yet.</p>
                <p>We'll let you know when something important happens.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
