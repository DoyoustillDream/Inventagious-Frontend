import Link from 'next/link';
import Image from 'next/image';
import { getFirstImage } from '@/lib/utils/imageUtils';

interface ProjectCardProps {
  id: string;
  slug: string;
  title: string;
  description?: string;
  imageUrl?: string;
  fundingGoal: number;
  amountRaised: number;
  backersCount: number;
  type: 'crowdfunding' | 'private_funding';
}

export default function ProjectCard({
  id,
  slug,
  title,
  description,
  imageUrl,
  fundingGoal,
  amountRaised,
  backersCount,
  type,
}: ProjectCardProps) {
  const progress = (amountRaised / fundingGoal) * 100;
  const href = type === 'crowdfunding' ? `/campaigns/${slug}` : `/deals/${id}`;
  const firstImage = getFirstImage(imageUrl);

  return (
    <Link href={href}>
      <div className="browser-window overflow-hidden transition hover:scale-105">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <div className="yellow-highlight hand-drawn text-xs font-bold text-center">
            {type === 'crowdfunding' ? 'CROWD FUNDING' : 'PRIVATE FUNDING'}
          </div>
          <div className="flex-1" />
        </div>
        {firstImage && (
          <div className="relative h-48 w-full bg-gray-200">
            <Image
              src={firstImage}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="hand-drawn mb-3 text-xl font-bold text-black">{title}</h3>
          {description && (
            <p className="mb-4 line-clamp-2 text-sm font-semibold text-gray-800">
              {description}
            </p>
          )}
          <div className="mb-4">
            <div className="mb-2 flex justify-between text-sm font-bold text-black">
              <span>
                {amountRaised.toLocaleString()} SOL
              </span>
              <span className="text-gray-700">
                of {fundingGoal.toLocaleString()} SOL
              </span>
            </div>
            <div className="h-4 overflow-hidden border-2 border-black bg-gray-200">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <p className="hand-drawn text-sm font-bold text-black">
            {backersCount} backers
          </p>
        </div>
      </div>
    </Link>
  );
}
