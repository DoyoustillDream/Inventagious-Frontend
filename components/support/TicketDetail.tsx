'use client';

import { useState } from 'react';
import { SupportTicket, supportApi, AddMessageDto } from '@/lib/api/support';
// Simple date formatting function
function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
}

interface TicketDetailProps {
  ticket: SupportTicket;
  onUpdate: () => void;
  onReanalyze?: () => void;
}

export default function TicketDetail({ ticket, onUpdate, onReanalyze }: TicketDetailProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const messageDto: AddMessageDto = { message: newMessage };
      await supportApi.addMessage(ticket.id, messageDto);
      setNewMessage('');
      onUpdate();
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Failed to add message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Ticket Header */}
      <div className="border-2 border-black rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-black mb-2">{ticket.subject}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded text-sm font-bold border-2 border-black bg-yellow-100">
                {ticket.status.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded text-sm font-bold border-2 border-black bg-blue-100">
                {ticket.priority}
              </span>
              <span className="px-3 py-1 rounded text-sm font-bold border-2 border-black bg-gray-100">
                {ticket.category.replace('_', ' ')}
              </span>
            </div>
          </div>
          {onReanalyze && (
            <button
              onClick={onReanalyze}
              className="px-4 py-2 border-2 border-black rounded-lg bg-purple-100 hover:bg-purple-200 font-bold text-sm transition-colors"
            >
              🤖 Re-analyze with AI
            </button>
          )}
        </div>

        {/* AI Analysis */}
        {ticket.aiAnalysis && (
          <div className="mt-4 p-4 border-2 border-purple-300 rounded-lg bg-purple-50">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
              🤖 AI Analysis
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-semibold">Sentiment:</span>{' '}
                <span className="capitalize">{ticket.aiAnalysis.sentiment}</span>
                {' '}({Math.round(ticket.aiAnalysis.sentimentScore * 100)}%)
              </div>
              <div>
                <span className="font-semibold">Urgency:</span>{' '}
                {Math.round(ticket.aiAnalysis.urgency * 100)}%
              </div>
              {ticket.aiAnalysis.keywords.length > 0 && (
                <div className="col-span-2">
                  <span className="font-semibold">Keywords:</span>{' '}
                  {ticket.aiAnalysis.keywords.slice(0, 5).join(', ')}
                </div>
              )}
            </div>
            {ticket.aiAnalysis.suggestedResponse && (
              <div className="mt-3 p-3 bg-white border border-purple-200 rounded">
                <p className="text-xs font-semibold mb-1">💡 Suggested Response:</p>
                <p className="text-xs text-gray-700">{ticket.aiAnalysis.suggestedResponse}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Created: {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</p>
          {ticket.updatedAt !== ticket.createdAt && (
            <p>Updated: {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="border-2 border-black rounded-lg p-6 bg-white">
        <h3 className="font-bold text-lg mb-4">Conversation</h3>
        <div className="space-y-4">
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border-2 ${
                message.sender === 'support'
                  ? 'bg-blue-50 border-blue-300 ml-8'
                  : 'bg-yellow-50 border-yellow-300 mr-8'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">
                  {message.sender === 'support' ? '👨‍💼 Support Team' : '👤 You'}
                </span>
                <span className="text-xs text-gray-600">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Message */}
      <div className="border-2 border-black rounded-lg p-6 bg-white">
        <h3 className="font-bold text-lg mb-4">Add a Message</h3>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-3 border-2 border-black rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
          rows={4}
        />
        <button
          onClick={handleAddMessage}
          disabled={isSubmitting || !newMessage.trim()}
          className="mt-3 px-6 py-2 border-2 border-black rounded-lg bg-yellow-400 hover:bg-yellow-500 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
}

