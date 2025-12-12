'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectsApi, type FeaturedTopic } from '@/lib/api/projects';

interface Topic extends FeaturedTopic {
  imageUrl?: string;
  tagColor?: 'purple' | 'yellow' | 'blue';
}

// Helper function to get background gradient based on topic
const getTopicBackground = (topicId: string): string => {
  const backgrounds: Record<string, string> = {
    solana: 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
    inventors: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    hardware: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
    web3: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 100%)',
  };
  return backgrounds[topicId] || 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E0 100%)';
};

// Arrow icon component
const ArrowIcon = () => (
  <svg
    viewBox="0 0 19 19"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 ml-2 inline-block"
    fill="currentColor"
  >
    <g fill="currentColor" stroke="none">
      <path
        d="M12.043 10.5L5.646 4.104a.5.5 0 1 1 .708-.708l6.75 6.75a.5.5 0 0 1 0 .708l-6.75 6.75a.5.5 0 0 1-.708-.708z"
        fillRule="evenodd"
      />
    </g>
  </svg>
);

export default function TopicsList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getFeaturedTopics();
        
        // Filter out category links - only show actual announcements/posts
        // Category links have hrefs like "/explore?category=..." which are for homepage FeaturedTopics
        const announcementTopics = data.filter((topic) => {
          // Exclude topics that link to explore pages with category filters
          if (topic.href.startsWith('/explore?category=')) {
            return false;
          }
          // Include all other topics (announcements, posts, etc.)
          return true;
        });
        
        // Transform the data to include tagColor
        const topicsWithColors: Topic[] = announcementTopics.map((topic) => ({
          ...topic,
          tagColor: 'purple' as const,
        }));
        
        setTopics(topicsWithColors);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topics');
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black">Loading topics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-2 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-gray-600">
          No topics available at the moment. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <Link
          key={topic.id}
          href={topic.href}
          className="group block h-full transition-all hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            {/* Image Section */}
            <div
              className="relative bg-cover bg-center h-48"
              style={{
                backgroundImage: topic.imageUrl
                  ? `url(${topic.imageUrl})`
                  : getTopicBackground(topic.id),
              }}
            >
              {topic.tag && (
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                      topic.tagColor === 'purple'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : topic.tagColor === 'yellow'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    <strong>{topic.tag}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-6">
              <h3 className="font-semibold text-black mb-3 group-hover:text-yellow-600 transition-colors text-xl">
                {topic.title}
              </h3>
              {topic.description && (
                <p className="text-gray-600 leading-relaxed mb-4 flex-1 text-sm">
                  {topic.description}
                </p>
              )}
              <div className="flex items-center text-sm font-semibold text-black group-hover:text-yellow-600 transition-colors">
                <span>Learn more</span>
                <ArrowIcon />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

