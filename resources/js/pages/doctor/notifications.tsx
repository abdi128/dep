import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Doctor Dashboard', href: '/doctor/dashboard' },
];

export default function DoctorNotifications({ incoming, read }) {
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('incoming');

  function handleMarkAsRead(notification) {
    router.post(
      route('doctor.notifications.read', { notification: notification.id }),
      {},
      {
        preserveScroll: true,
        onSuccess: () => setViewOpen(false),
      }
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border relative min-h-[70vh] flex-1 overflow-auto rounded-xl p-6 bg-background shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setTab('incoming')}
                className={`px-6 py-2 rounded-full transition-all text-sm font-medium ${
                  tab === 'incoming'
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              >
                Incoming
              </button>
              <button
                onClick={() => setTab('read')}
                className={`px-6 py-2 rounded-full transition-all text-sm font-medium ${
                  tab === 'read'
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              >
                Read
              </button>
            </div>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <NotificationList
              notifications={tab === 'incoming' ? incoming : read}
              onView={n => {
                setSelected(n);
                setViewOpen(true);
              }}
              onMarkAsRead={handleMarkAsRead}
              showMarkAsRead={tab === 'incoming'}
            />
          </div>
        </div>
      </div>

      {/* View Notification Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Notification</DialogTitle>
          </DialogHeader>
          {selected && (
            <div>
              <div className="font-semibold text-lg mb-2">{selected.title}</div>
              <div className="mb-4">{selected.body}</div>
              <div className="text-xs text-gray-400 mb-2">{new Date(selected.created_at).toLocaleString()}</div>
              {!selected.pivot?.read && (
                <Button size="sm" onClick={() => handleMarkAsRead(selected)}>
                  Mark as Read
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// Notification List Component
function NotificationList({ notifications, onView, onMarkAsRead, showMarkAsRead }) {
  if (!notifications || notifications.length === 0) {
    return <div className="text-gray-500 text-center py-8">No notifications.</div>;
  }
  return (
    <div className="divide-y divide-gray-200 bg-white rounded-xl shadow">
      {notifications.map(notification => (
        <div key={notification.id} className="py-4 px-6 flex justify-between items-center hover:bg-blue-50 transition">
          <div>
            <div className="font-semibold">{notification.title}</div>
            <div className="text-sm text-gray-600">{notification.body}</div>
            <div className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onView(notification)}>
              <Eye className="h-5 w-5" />
            </Button>
            {showMarkAsRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkAsRead(notification)}
              >
                Mark as Read
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
