'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider/AuthProvider';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

interface EmailPreferences {
  receive_marketing: boolean;
  receive_campaign_updates: boolean;
  receive_deadline_reminders: boolean;
  receive_milestone_updates: boolean;
}

export default function EmailPreferencesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch current preferences using API client (goes through /api proxy)
    apiClient
      .get('/email/preferences')
      .then((data: any) => {
        setPreferences(data);
        setLoading(false);
      })
      .catch((err: any) => {
        if (err.status === 401) {
          router.push('/auth/login');
        } else {
          setError('Failed to load preferences.');
        }
        setLoading(false);
      });
  }, [isAuthenticated, router]);

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    setError(null);

    try {
      await apiClient.put('/email/preferences', preferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      if (err.status === 401) {
        router.push('/auth/login');
      } else {
        setError(err.message || 'Failed to update preferences');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="browser-window max-w-md w-full mx-4">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
            </div>
            <div className="flex-1"></div>
            <h2 className="hand-drawn text-lg font-bold text-black">Loading...</h2>
            <div className="flex-1"></div>
          </div>
          <div className="p-6 text-center">
            <p>Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="browser-window max-w-md w-full">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red"></div>
            <div className="browser-dot yellow"></div>
            <div className="browser-dot green"></div>
          </div>
          <div className="flex-1"></div>
          <h2 className="hand-drawn text-lg font-bold text-black">Email Preferences</h2>
          <div className="flex-1"></div>
        </div>

        <div className="p-6">
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg text-green-700">
              Your preferences have been saved!
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-4">
              Manage which emails you'd like to receive from Inventagious.
            </p>

            {preferences && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 border-2 border-black rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={preferences.receive_campaign_updates}
                    onChange={(e) =>
                      setPreferences({ ...preferences, receive_campaign_updates: e.target.checked })
                    }
                    className="w-5 h-5 border-2 border-black rounded"
                  />
                  <div>
                    <div className="hand-drawn font-bold text-black">Campaign Updates</div>
                    <div className="text-xs text-gray-600">
                      Get notified when campaigns you support have updates
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 border-black rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={preferences.receive_deadline_reminders}
                    onChange={(e) =>
                      setPreferences({ ...preferences, receive_deadline_reminders: e.target.checked })
                    }
                    className="w-5 h-5 border-2 border-black rounded"
                  />
                  <div>
                    <div className="hand-drawn font-bold text-black">Deadline Reminders</div>
                    <div className="text-xs text-gray-600">
                      Reminders when campaigns are approaching their deadline
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 border-black rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={preferences.receive_milestone_updates}
                    onChange={(e) =>
                      setPreferences({ ...preferences, receive_milestone_updates: e.target.checked })
                    }
                    className="w-5 h-5 border-2 border-black rounded"
                  />
                  <div>
                    <div className="hand-drawn font-bold text-black">Milestone Achievements</div>
                    <div className="text-xs text-gray-600">
                      Celebrate when campaigns reach funding milestones
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 border-black rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={preferences.receive_marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, receive_marketing: e.target.checked })
                    }
                    className="w-5 h-5 border-2 border-black rounded"
                  />
                  <div>
                    <div className="hand-drawn font-bold text-black">Marketing Emails</div>
                    <div className="text-xs text-gray-600">
                      Platform announcements and promotional content
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !preferences}
            className="hand-drawn w-full rounded-lg border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>

          <div className="mt-6 pt-4 border-t-2 border-black text-xs text-gray-600">
            <p>
              <strong>Note:</strong> Transactional emails (receipts, security alerts) are always
              sent for account security and legal compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

