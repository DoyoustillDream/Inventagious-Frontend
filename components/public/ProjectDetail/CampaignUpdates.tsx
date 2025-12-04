'use client';

import { useState, useEffect } from 'react';
import { projectsApi, type CampaignUpdate, type Project } from '@/lib/api/projects';
import { useAuth } from '@/components/auth/AuthProvider';
import CreateUpdateForm from './CreateUpdateForm';

interface CampaignUpdatesProps {
  project: Project;
}

export default function CampaignUpdates({ project }: CampaignUpdatesProps) {
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const isCreator = user?.id === project.userId;

  useEffect(() => {
    loadUpdates();
  }, [project.id]);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getCampaignUpdates(project.id);
      setUpdates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load updates');
      console.error('Error loading campaign updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCreated = () => {
    setShowCreateForm(false);
    loadUpdates();
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      await projectsApi.deleteCampaignUpdate(project.id, updateId);
      loadUpdates();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete update');
    }
  };

  if (loading) {
    return (
      <div className="browser-window p-6 mb-6">
        <p className="hand-drawn text-base font-semibold text-gray-600">Loading updates...</p>
      </div>
    );
  }

  return (
    <div className="browser-window p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="hand-drawn text-2xl font-bold text-black">Campaign Updates</h2>
        {isCreator && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="hand-drawn px-4 py-2 bg-yellow-400 border-4 border-black text-black font-bold hover:bg-yellow-500 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ New Update'}
          </button>
        )}
      </div>

      {showCreateForm && isCreator && (
        <div className="mb-6">
          <CreateUpdateForm
            projectId={project.id}
            onSuccess={handleUpdateCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-4 border-red-500">
          <p className="hand-drawn text-base font-bold text-red-800">{error}</p>
        </div>
      )}

      {updates.length === 0 ? (
        <div className="text-center py-8">
          <p className="hand-drawn text-base font-semibold text-gray-600">
            {isCreator ? 'No updates yet. Post your first update to keep your supporters informed!' : 'No updates yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {updates.map((update) => (
            <div
              key={update.id}
              className={`p-4 border-4 border-black bg-white ${update.isPinned ? 'bg-yellow-50' : ''}`}
            >
              {update.isPinned && (
                <div className="mb-2">
                  <span className="hand-drawn text-xs font-bold bg-yellow-400 px-2 py-1 border-2 border-black">
                    📌 PINNED
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="hand-drawn text-xl font-bold text-black">{update.title}</h3>
                {isCreator && (
                  <button
                    onClick={() => handleDeleteUpdate(update.id)}
                    className="hand-drawn text-xs px-2 py-1 bg-red-100 border-2 border-red-500 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="hand-drawn text-sm text-gray-700 mb-3 whitespace-pre-wrap">{update.content}</p>
              {update.imageUrl && (
                <div className="mb-3">
                  <img
                    src={update.imageUrl}
                    alt={update.title}
                    className="max-w-full h-auto border-4 border-black"
                  />
                </div>
              )}
              {update.videoUrl && (
                <div className="mb-3">
                  <video
                    src={update.videoUrl}
                    controls
                    className="max-w-full h-auto border-4 border-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <p className="hand-drawn text-xs text-gray-500">
                {new Date(update.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

