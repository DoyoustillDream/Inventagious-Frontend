'use client';

import { useState } from 'react';
import { projectsApi, type CreateCampaignUpdateData } from '@/lib/api/projects';

interface CreateUpdateFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateUpdateForm({ projectId, onSuccess, onCancel }: CreateUpdateFormProps) {
  const [formData, setFormData] = useState<CreateCampaignUpdateData>({
    title: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    isPinned: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data: CreateCampaignUpdateData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: formData.imageUrl?.trim() || undefined,
        videoUrl: formData.videoUrl?.trim() || undefined,
        isPinned: formData.isPinned || false,
      };

      await projectsApi.createCampaignUpdate(projectId, data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create update');
      console.error('Error creating update:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border-4 border-black bg-white">
      <h3 className="hand-drawn text-xl font-bold text-black mb-4">Post a New Update</h3>

      {error && (
        <div className="p-3 bg-red-50 border-4 border-red-500">
          <p className="hand-drawn text-sm font-bold text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label className="hand-drawn block text-base font-bold mb-2 text-black">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Update title"
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="hand-drawn block text-base font-bold mb-2 text-black">
          Content <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={6}
          placeholder="Share your progress, milestones, or news with your supporters..."
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
        />
      </div>

      <div>
        <label className="hand-drawn block text-base font-bold mb-2 text-black">
          Image URL (optional)
        </label>
        <input
          type="url"
          value={formData.imageUrl || ''}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="hand-drawn block text-base font-bold mb-2 text-black">
          Video URL (optional)
        </label>
        <input
          type="url"
          value={formData.videoUrl || ''}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          placeholder="https://example.com/video.mp4"
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPinned"
          checked={formData.isPinned}
          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
          className="w-5 h-5 border-4 border-black text-yellow-400 focus:ring-4 focus:ring-yellow-400"
        />
        <label htmlFor="isPinned" className="hand-drawn ml-2 text-base font-bold text-black">
          Pin this update to the top
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="hand-drawn flex-1 px-6 py-3 bg-yellow-400 border-4 border-black text-black font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : 'Post Update'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="hand-drawn px-6 py-3 bg-gray-200 border-4 border-black text-black font-bold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

