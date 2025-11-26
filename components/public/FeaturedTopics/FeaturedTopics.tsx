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
    solana: 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)', // Solana colors
    inventors: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', // Gold/Orange
    hardware: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)', // Gray
    web3: 'linear-gradient(135deg, #00D4FF 0%, #7B2FF7 100%)', // Web3 colors
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

// Card component for reusability
const TopicCard = ({
  topic,
  isLarge = false,
}: {
  topic: Topic;
  isLarge?: boolean;
}) => (
  <li className={`group ${isLarge ? 'md:col-span-3' : ''}`}>
    <Link
      href={topic.href}
      className="block h-full transition-all hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        {/* Image Section */}
        <div
          className={`relative bg-cover bg-center ${
            isLarge ? 'h-64 md:h-80' : 'h-48'
          }`}
          style={{
            backgroundImage: topic.imageUrl
              ? `url(${topic.imageUrl})`
              : getTopicBackground(topic.id),
          }}
        >
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
        </div>

        {/* Content Section */}
        <div className={`flex flex-col flex-1 ${isLarge ? 'p-8' : 'p-6'}`}>
          <h3
            className={`font-semibold text-black mb-3 group-hover:text-yellow-600 transition-colors ${
              isLarge ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {topic.title}
          </h3>
          {topic.description && (
            <p
              className={`text-gray-600 leading-relaxed mb-4 flex-1 ${
                isLarge ? 'text-base md:text-lg' : 'text-sm'
              }`}
            >
              {topic.description}
            </p>
          )}
          <div className="flex items-center text-sm font-semibold text-black group-hover:text-yellow-600 transition-colors">
            <span>{isLarge ? 'Learn more' : 'Explore'}</span>
            <ArrowIcon />
          </div>
        </div>
      </div>
    </Link>
  </li>
);

export default function FeaturedTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedTopics() {
      try {
        setLoading(true);
        const data = await projectsApi.getFeaturedTopics();
        
        // Transform the data to include tagColor
        const topicsWithColors: Topic[] = data.map((topic) => ({
          ...topic,
          tagColor: 'purple' as const,
        }));
        
        setTopics(topicsWithColors);
      } catch (error) {
        console.error('Error fetching featured topics:', error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedTopics();
  }, []);

  // Don't render the component if there are no topics with projects
  if (loading) {
    return null;
  }

  if (topics.length === 0) {
    return null;
  }

  const [featuredTopic, ...otherTopics] = topics;

  return (
    <section aria-live="polite" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
            Featured topics
          </h2>
        </header>

        <div className="space-y-6">
          {/* Large featured card */}
          {featuredTopic && (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TopicCard topic={featuredTopic} isLarge={true} />
            </ul>
          )}

          {/* Three smaller cards below */}
          {otherTopics.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} isLarge={false} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
