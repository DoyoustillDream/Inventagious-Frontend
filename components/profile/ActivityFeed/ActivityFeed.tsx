'use client';

interface Activity {
  id: string;
  type: 'contribution' | 'project_created' | 'update';
  title: string;
  description?: string;
  timestamp: string;
  projectId?: string;
  projectTitle?: string;
}

interface ActivityFeedProps {
  activities?: Activity[];
  isOwnProfile?: boolean;
}

export default function ActivityFeed({
  activities = [],
  isOwnProfile = false,
}: ActivityFeedProps) {
  const hasActivities = activities && activities.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center px-3 mb-4">
        <h2 className="text-lg font-bold text-black mb-0">Your activity</h2>
        <button
          className="ml-2 p-1 border-2 border-black rounded-full hover:bg-yellow-200 transition-colors"
          aria-label="Activity information"
          title="Recent activity on your profile"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {hasActivities ? (
        <div className="px-3 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-2 border-black rounded-lg p-4 bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                  {activity.type === 'contribution' && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  {activity.type === 'project_created' && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                  {activity.type === 'update' && (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-1">{activity.title}</h3>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mb-1">
                      {activity.description}
                    </p>
                  )}
                  {activity.projectTitle && (
                    <p className="text-xs text-gray-500">
                      Project: {activity.projectTitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-3">
          <p className="text-center text-gray-500 my-0 py-4">
            No recent activity to display.
          </p>
        </div>
      )}
    </div>
  );
}

