interface DealCardProps {
  id: string;
  projectId: string;
  amount: number;
  netAmount: number;
  platformFee: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  terms?: string;
  createdAt: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  isInventor?: boolean;
}

export default function DealCard({
  id,
  amount,
  netAmount,
  platformFee,
  status,
  message,
  terms,
  createdAt,
  onAccept,
  onReject,
  onComplete,
  isInventor = false,
}: DealCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="border-4 border-black rounded-lg p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2 text-black">Deal Offer</h3>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-black">
              Amount: <span className="text-green-700">${amount.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-700">
              You receive: <span className="font-semibold text-black">${netAmount.toLocaleString()}</span>
            </p>
            <p className="text-xs text-gray-600">
              Platform fee: ${platformFee.toLocaleString()} (5%)
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[status]}`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      {message && (
        <div className="mb-4">
          <p className="text-sm text-gray-800">{message}</p>
        </div>
      )}

      {terms && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-1 text-black">Terms:</p>
          <p className="text-sm text-gray-800">{terms}</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {isInventor && status === 'pending' && (
          <>
            {onAccept && (
              <button
                onClick={() => onAccept(id)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
              >
                Accept Deal
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject(id)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Reject
              </button>
            )}
          </>
        )}
        {isInventor && status === 'accepted' && onComplete && (
          <button
            onClick={() => onComplete(id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Mark as Completed
          </button>
        )}
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Created: {new Date(createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

