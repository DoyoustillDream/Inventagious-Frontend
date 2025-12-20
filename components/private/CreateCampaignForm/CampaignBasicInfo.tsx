'use client';

import { CreateProjectData } from '@/lib/api/projects';
import { categories } from '@/lib/categories';
import { DescriptionQualityResult } from '@/lib/copilot/types';
import { DescriptionFeedback } from '@/components/copilot';

interface CampaignBasicInfoProps {
  title: string;
  description: string;
  category: string;
  websiteUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  descriptionAnalysis?: DescriptionQualityResult | null;
  isAnalyzing?: boolean;
  onUpdate: <K extends keyof CreateProjectData>(
    field: K,
    value: CreateProjectData[K]
  ) => void;
}

export default function CampaignBasicInfo({
  title,
  description,
  category,
  websiteUrl = '',
  twitterUrl = '',
  facebookUrl = '',
  instagramUrl = '',
  linkedinUrl = '',
  youtubeUrl = '',
  tiktokUrl = '',
  descriptionAnalysis,
  isAnalyzing = false,
  onUpdate,
}: CampaignBasicInfoProps) {
  const wordCount = description.split(/\s+/).filter(Boolean).length;
  
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Campaign Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate('title', e.target.value)}
          required
          placeholder="Enter your campaign title"
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
        {title.length > 0 && title.length < 5 && (
          <p className="hand-drawn mt-2 text-xs font-bold text-red-600">
            Title needs at least 5 characters
          </p>
        )}
        {title.length >= 5 && (
          <p className="hand-drawn mt-2 text-xs font-bold text-green-600">
            ✓ Good title!
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          required
          rows={6}
          placeholder="Describe your campaign, its goals, and what makes it unique...

Tips for a great description:
• Start with the problem you're solving
• Explain who benefits from your project  
• Highlight what makes you unique
• End with why backers should support you now"
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
        />
        
        {/* Word count indicator */}
        {description.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className={`hand-drawn text-xs font-bold ${
              wordCount >= 100 ? 'text-green-600' : 
              wordCount >= 50 ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              {wordCount} words {wordCount < 50 && '(aim for 100+)'}
            </span>
            {wordCount < 100 && (
              <span className="hand-drawn text-xs font-bold text-red-600">
                Need {Math.max(0, 100 - wordCount)} more words
              </span>
            )}
          </div>
        )}
        
        {/* AI Feedback */}
        <DescriptionFeedback 
          result={descriptionAnalysis || null} 
          isLoading={isAnalyzing}
        />
      </div>

      {/* Category */}
      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Category <span className="text-red-600">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => onUpdate('category', e.target.value)}
          required
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        {category && (
          <p className="hand-drawn mt-2 text-xs font-bold text-green-600">
            ✓ Category selected
          </p>
        )}
      </div>

      {/* Social Media */}
      <div className="pt-4 border-t-4 border-gray-300">
        <h3 className="hand-drawn text-lg font-bold text-black mb-2">
          Social Media & Links 
          <span className="text-gray-500 text-sm font-normal ml-2">(Optional)</span>
        </h3>
        <p className="hand-drawn text-sm font-semibold text-gray-600 mb-4">
          Adding social links builds credibility with potential backers.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="hand-drawn block text-sm font-bold mb-2 text-black">
              Website URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => onUpdate('websiteUrl', e.target.value)}
              placeholder="https://yourwebsite.com"
              className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                Twitter/X URL
              </label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => onUpdate('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/yourhandle"
                className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => onUpdate('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => onUpdate('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => onUpdate('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
                className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => onUpdate('youtubeUrl', e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                TikTok URL
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => onUpdate('tiktokUrl', e.target.value)}
                placeholder="https://tiktok.com/@yourhandle"
                className="hand-drawn w-full border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
