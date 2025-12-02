'use client';

import { useState } from 'react';
import { CreateTicketDto, TicketCategory, supportApi } from '@/lib/api/support';

interface CreateTicketFormProps {
  onTicketCreated: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  { value: TicketCategory.TECHNICAL, label: '🔧 Technical Issue' },
  { value: TicketCategory.BILLING, label: '💳 Billing Question' },
  { value: TicketCategory.ACCOUNT, label: '👤 Account Problem' },
  { value: TicketCategory.FEATURE_REQUEST, label: '💡 Feature Request' },
  { value: TicketCategory.BUG_REPORT, label: '🐛 Bug Report' },
  { value: TicketCategory.PAYMENT, label: '💰 Payment Issue' },
  { value: TicketCategory.PROJECT, label: '🚀 Project Question' },
  { value: TicketCategory.GENERAL, label: '📋 General Inquiry' },
  { value: TicketCategory.OTHER, label: '❓ Other' },
];

export default function CreateTicketForm({ onTicketCreated, onCancel }: CreateTicketFormProps) {
  const [formData, setFormData] = useState<CreateTicketDto>({
    subject: '',
    message: '',
    category: TicketCategory.GENERAL,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await supportApi.createTicket(formData);
      setFormData({ subject: '', message: '', category: TicketCategory.GENERAL });
      onTicketCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 border-2 border-red-500 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="category" className="block text-sm font-bold mb-2">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
          className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-bold mb-2">
          Subject *
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Brief description of your issue"
          className="w-full p-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-bold mb-2">
          Message *
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please provide as much detail as possible. Our AI will automatically analyze your ticket and suggest a response."
          rows={6}
          className="w-full p-3 border-2 border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <p className="text-xs text-gray-600 mt-1">
          💡 Our AI will automatically categorize your ticket, analyze sentiment, and suggest a response.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 border-2 border-black rounded-lg bg-yellow-400 hover:bg-yellow-500 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-black rounded-lg bg-gray-100 hover:bg-gray-200 font-bold transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

