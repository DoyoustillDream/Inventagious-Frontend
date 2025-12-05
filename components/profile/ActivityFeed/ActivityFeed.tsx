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
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="hand-drawn text-xl sm:text-2xl font-bold text-black">
          {isOwnProfile ? 'Your Activity' : 'Activity'}
        </h2>
        <button
          className="ml-2 p-1 border-2 border-black rounded-full hover:bg-yellow-200 transition-colors text-black flex-shrink-0"
          aria-label="Activity information"
          title="Recent activity on your profile"
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-2 border-black rounded-lg p-3 sm:p-4 bg-white"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-200 border-2 border-black flex items-center justify-center flex-shrink-0 text-black">
                  {activity.type === 'contribution' && (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
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
                      className="w-4 h-4 sm:w-5 sm:h-5"
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
                      className="w-4 h-4 sm:w-5 sm:h-5"
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
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm mb-1 break-words">{activity.title}</h3>
                  {activity.description && (
                    <p className="text-xs sm:text-sm text-gray-800 mb-1 break-words">
                      {activity.description}
                    </p>
                  )}
                  {activity.projectTitle && (
                    <p className="text-xs text-gray-700 font-semibold break-words">
                      Project: {activity.projectTitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-700 mt-1 font-bold">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-lg py-6 sm:py-8 ${
          isOwnProfile 
            ? '' 
            : 'border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex flex-col items-center text-center">
            {!isOwnProfile && (
              <div className="w-16 h-16 border-2 border-gray-300 rounded-full bg-white flex items-center justify-center mb-3 opacity-60">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
            <p className={`text-center text-sm sm:text-base font-bold ${
              isOwnProfile ? 'text-gray-800' : 'text-gray-600'
            }`}>
              {isOwnProfile 
                ? 'No recent activity to display.'
                : 'No recent activity to show. Follow this creator to stay updated on their latest projects and contributions!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

