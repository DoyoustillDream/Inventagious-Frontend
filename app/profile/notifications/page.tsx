'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { notificationsApi, Notification } from '@/lib/api/notifications';

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    loadNotifications();
  }, [isAuthenticated, router]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError(err?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="text-xl font-bold">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white border-4 border-black rounded-lg p-6 md:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 px-3 py-1 bg-yellow-400 border-2 border-black rounded-full text-sm">
                    {unreadCount} new
                  </span>
                )}
              </h1>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="hand-drawn px-4 py-2 border-3 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-sm transition hover:scale-105 active:scale-95"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-4 border-red-500 rounded-lg">
                <p className="text-red-800 font-bold">{error}</p>
              </div>
            )}

            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-lg font-bold text-gray-800 mb-4">No notifications yet</p>
                <p className="text-gray-600 mb-6">
                  When you receive notifications about your projects, donations, or activity, they'll
                  appear here.
                </p>
                <Link
                  href="/profile"
                  className="hand-drawn inline-flex items-center px-6 py-3 border-4 border-black !bg-yellow-400 hover:!bg-yellow-500 text-black rounded-lg font-bold transition hover:scale-105 active:scale-95"
                >
                  Back to Profile
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-4 border-black rounded-lg transition hover:scale-[1.02] ${
                      notification.read ? 'bg-white' : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-black">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-800 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(notification.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 text-xs border-2 border-black bg-white hover:bg-yellow-200 rounded font-bold transition"
                          >
                            Mark read
                          </button>
                        )}
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="px-3 py-1 text-xs border-2 border-black bg-yellow-400 hover:bg-yellow-500 rounded font-bold transition text-center"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

