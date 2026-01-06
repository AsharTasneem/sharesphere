import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNotificationStore } from "@/stores/notificationStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getRelativeTime } from "@/lib/utils";
import { BellIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const groupedNotifications = {
    today: notifications.filter((n) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(n.createdAt) >= today;
    }),
    yesterday: notifications.filter((n) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const notifDate = new Date(n.createdAt);
      notifDate.setHours(0, 0, 0, 0);
      return notifDate.getTime() === yesterday.getTime();
    }),
    thisWeek: notifications.filter((n) => {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return (
        new Date(n.createdAt) >= weekAgo &&
        new Date(n.createdAt) < new Date().setHours(0, 0, 0, 0) - 86400000
      );
    }),
    older: notifications.filter((n) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(n.createdAt) < weekAgo;
    }),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Notifications
          </h1>
          <p className="text-gray-600">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckIcon className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notifications yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedNotifications.today.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Today
              </h2>
              <div className="space-y-2">
                {groupedNotifications.today.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {groupedNotifications.yesterday.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Yesterday
              </h2>
              <div className="space-y-2">
                {groupedNotifications.yesterday.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {groupedNotifications.thisWeek.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                This Week
              </h2>
              <div className="space-y-2">
                {groupedNotifications.thisWeek.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {groupedNotifications.older.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Older
              </h2>
              <div className="space-y-2">
                {groupedNotifications.older.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: any;
  onMarkAsRead: () => void;
}) {
  return (
    <Card
      className={!notification.read ? "bg-primary-50 border-primary-200" : ""}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              {notification.title}
            </h3>
            {!notification.read && (
              <Badge variant="info" size="sm">
                New
              </Badge>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
          <p className="text-xs text-gray-500">
            {getRelativeTime(notification.createdAt)}
          </p>
          {notification.actionUrl && (
            <Link to={notification.actionUrl} onClick={onMarkAsRead}>
              <Button variant="ghost" size="sm" className="mt-2">
                {notification.actionText || "View"}
              </Button>
            </Link>
          )}
        </div>
        {!notification.read && (
          <button
            onClick={onMarkAsRead}
            className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Mark as read"
          >
            <CheckIcon className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
    </Card>
  );
}
