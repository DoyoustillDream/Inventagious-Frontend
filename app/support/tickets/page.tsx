'use client';

import { useState, useEffect } from 'react';
import { SupportTicket, TicketStatus, TicketCategory, supportApi } from '@/lib/api/support';
import TicketList from '@/components/support/TicketList';
import TicketDetail from '@/components/support/TicketDetail';
import CreateTicketForm from '@/components/support/CreateTicketForm';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const response = await supportApi.getTickets(params);
      setTickets(response.tickets);

      const statsResponse = await supportApi.getTicketStats();
      setStats(statsResponse);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter, categoryFilter]);

  const handleTicketCreated = () => {
    setShowCreateForm(false);
    loadTickets();
  };

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
  };

  const handleReanalyze = async () => {
    if (!selectedTicket) return;
    try {
      const updated = await supportApi.reanalyzeTicket(selectedTicket.id);
      setSelectedTicket(updated);
      loadTickets();
    } catch (error) {
      console.error('Error reanalyzing ticket:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <section className="halftone-gray py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h1 className="hand-drawn mb-4 text-5xl font-bold text-black">
                Support Tickets
              </h1>
              <p className="text-lg font-semibold text-gray-800">
                Get help with AI-powered support ticket system
              </p>
              <div className="squiggly-underline inline-block mt-4" />
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="border-2 border-black rounded-lg p-4 bg-white text-center">
                  <div className="text-2xl font-bold text-black">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Tickets</div>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-yellow-100 text-center">
                  <div className="text-2xl font-bold text-black">{stats.open}</div>
                  <div className="text-sm text-gray-600">Open</div>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-blue-100 text-center">
                  <div className="text-2xl font-bold text-black">{stats.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="border-2 border-black rounded-lg p-4 bg-green-100 text-center">
                  <div className="text-2xl font-bold text-black">{stats.resolved}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
              </div>
            )}

            {/* Filters and Create Button */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
                  className="px-4 py-2 border-2 border-black rounded-lg bg-white font-bold text-sm"
                >
                  <option value="all">All Status</option>
                  <option value={TicketStatus.OPEN}>Open</option>
                  <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                  <option value={TicketStatus.RESOLVED}>Resolved</option>
                  <option value={TicketStatus.CLOSED}>Closed</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | 'all')}
                  className="px-4 py-2 border-2 border-black rounded-lg bg-white font-bold text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value={TicketCategory.TECHNICAL}>Technical</option>
                  <option value={TicketCategory.BILLING}>Billing</option>
                  <option value={TicketCategory.ACCOUNT}>Account</option>
                  <option value={TicketCategory.FEATURE_REQUEST}>Feature Request</option>
                  <option value={TicketCategory.BUG_REPORT}>Bug Report</option>
                  <option value={TicketCategory.PAYMENT}>Payment</option>
                  <option value={TicketCategory.PROJECT}>Project</option>
                  <option value={TicketCategory.GENERAL}>General</option>
                </select>
              </div>

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="ml-auto px-6 py-2 border-2 border-black rounded-lg bg-yellow-400 hover:bg-yellow-500 font-bold transition-colors"
              >
                {showCreateForm ? 'Cancel' : '+ Create New Ticket'}
              </button>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <div className="mb-8 border-2 border-black rounded-lg p-6 bg-white">
                <h2 className="text-2xl font-bold mb-4">Create Support Ticket</h2>
                <CreateTicketForm
                  onTicketCreated={handleTicketCreated}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            {/* Main Content */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-lg font-semibold">Loading tickets...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Ticket List */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Your Tickets</h2>
                  <TicketList
                    tickets={tickets}
                    onTicketClick={handleTicketClick}
                    selectedTicketId={selectedTicket?.id}
                  />
                </div>

                {/* Ticket Detail */}
                <div className="space-y-4">
                  {selectedTicket ? (
                    <>
                      <h2 className="text-xl font-bold">Ticket Details</h2>
                      <TicketDetail
                        ticket={selectedTicket}
                        onUpdate={loadTickets}
                        onReanalyze={handleReanalyze}
                      />
                    </>
                  ) : (
                    <div className="border-2 border-black rounded-lg p-12 bg-white text-center">
                      <p className="text-gray-600">Select a ticket to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

