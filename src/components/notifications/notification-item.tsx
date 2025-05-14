
import { cn } from "@/lib/utils";
import { Bell, AlertCircle, CheckCircle, Info, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error" | "group_invite";
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const getNotificationIcon = (type: Notification["type"]): LucideIcon => {
  switch (type) {
    case "success":
      return CheckCircle;
    case "warning":
      return AlertCircle;
    case "error":
      return AlertCircle; // Or a different error icon
    case "group_invite":
      return Users;
    case "info":
    default:
      return Info;
  }
};

const getIconColor = (type: Notification["type"]): string => {
  switch (type) {
    case "success":
      return "text-green-500";
    case "warning":
      return "text-yellow-500";
    case "error":
      return "text-red-500";
    case "group_invite":
      return "text-blue-500";
    case "info":
    default:
      return "text-primary";
  }
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type);
  const iconColor = getIconColor(notification.type);

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 border-b last:border-b-0 transition-colors",
        notification.read ? "bg-background" : "bg-muted/60 hover:bg-muted",
        onMarkAsRead ? "cursor-pointer" : ""
      )}
      onClick={() => onMarkAsRead?.(notification.id)}
    >
      <div className={cn("p-1 rounded-full mt-1", notification.read ? "opacity-60" : "")}>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>
      <div className="flex-1">
        <p className={cn("font-semibold text-card-foreground", notification.read && "font-normal")}>
          {notification.title}
        </p>
        <p className={cn("text-sm text-muted-foreground", notification.read && "opacity-70")}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(notification.timestamp).toLocaleString()}
        </p>
      </div>
      {!notification.read && (
        <div className="h-2.5 w-2.5 rounded-full bg-secondary mt-1.5" aria-label="Unread notification"></div>
      )}
    </div>
  );
}
