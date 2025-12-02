'use client';

import { useState } from 'react';
import { SupportTicket, TicketStatus, TicketCategory, TicketPriority } from '@/lib/api/support';
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

interface TicketListProps {
  tickets: SupportTicket[];
  onTicketClick: (ticket: SupportTicket) => void;
  selectedTicketId?: string;
}

const statusColors: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [TicketStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-300',
  [TicketStatus.RESOLVED]: 'bg-green-100 text-green-800 border-green-300',
  [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-800 border-gray-300',
};

const priorityColors: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: 'bg-gray-100 text-gray-700',
  [TicketPriority.MEDIUM]: 'bg-blue-100 text-blue-700',
  [TicketPriority.HIGH]: 'bg-orange-100 text-orange-700',
  [TicketPriority.URGENT]: 'bg-red-100 text-red-700',
};

const categoryLabels: Record<TicketCategory, string> = {
  [TicketCategory.TECHNICAL]: '🔧 Technical',
  [TicketCategory.BILLING]: '💳 Billing',
  [TicketCategory.ACCOUNT]: '👤 Account',
  [TicketCategory.FEATURE_REQUEST]: '💡 Feature Request',
  [TicketCategory.BUG_REPORT]: '🐛 Bug Report',
  [TicketCategory.GENERAL]: '📋 General',
  [TicketCategory.PAYMENT]: '💰 Payment',
  [TicketCategory.PROJECT]: '🚀 Project',
  [TicketCategory.OTHER]: '❓ Other',
};

export default function TicketList({ tickets, onTicketClick, selectedTicketId }: TicketListProps) {
  return (
    <div className="space-y-2">
      {tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p className="text-lg font-semibold">No tickets found</p>
          <p className="text-sm mt-2">Create your first support ticket to get started</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onTicketClick(ticket)}
            className={`w-full text-left p-4 rounded-lg border-2 border-black transition-all hover:shadow-lg ${
              selectedTicketId === ticket.id
                ? 'bg-yellow-100 border-yellow-500'
                : 'bg-white hover:bg-yellow-50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-bold text-lg text-black truncate">{ticket.subject}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${statusColors[ticket.status]}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${priorityColors[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.message}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span>{categoryLabels[ticket.category]}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                  {ticket.aiAnalysis && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        🤖 AI: {ticket.aiAnalysis.sentiment} ({Math.round(ticket.aiAnalysis.sentimentScore * 100)}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
              {ticket.messages && ticket.messages.length > 1 && (
                <div className="flex-shrink-0">
                  <span className="text-xs font-bold text-gray-600">
                    {ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}
                  </span>
                </div>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );
}

