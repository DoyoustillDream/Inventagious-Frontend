'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/email/newsletter/subscribe', { email, source: 'footer' });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="hand-drawn mb-4 text-base font-bold text-white">Newsletter</h4>
      <p className="text-sm text-white mb-3">
        Stay updated with the latest innovations and campaigns
      </p>
      <div className="mb-3">
        <a
          href="https://x.com/Inventagiousapp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-yellow-400 transition-colors inline-flex items-center gap-2 text-sm"
          aria-label="Follow us on X (Twitter)"
        >
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Follow us on X</span>
        </a>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 border-2 border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="hand-drawn px-4 py-2 border-2 border-white rounded-lg bg-white text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Subscribe'}
          </button>
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-400">Thanks for subscribing!</p>
        )}
      </form>
    </div>
  );
}

