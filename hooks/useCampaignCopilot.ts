'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  CopilotResponse,
  CopilotPrimaryAction,
  DescriptionQualityResult,
  CopilotUrgency,
  CopilotActionType,
  CopilotActionTarget,
  CreatorState,
} from '@/lib/copilot/types';
import * as copilotApi from '@/lib/copilot/api';

/**
 * Campaign form data for copilot analysis
 */
export interface CampaignFormData {
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  imageUrl: string;
  videoUrl: string;
  deadline: string;
  websiteUrl: string;
  twitterUrl: string;
}

/**
 * Copilot checklist item
 */
export interface ChecklistItem {
  id: string;
  label: string;
  target: CopilotActionTarget;
  isComplete: boolean;
  isRequired: boolean;
  step: number; // Which form step this belongs to
  message: string; // Guidance message
}

/**
 * Step guidance for the copilot
 */
export interface StepGuidance {
  step: number;
  title: string;
  currentFocus: string;
  tips: string[];
  progress: number; // 0-100 for this step
}

interface UseCampaignCopilotReturn {
  // Core state
  advice: CopilotResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Analysis results
  descriptionAnalysis: DescriptionQualityResult | null;
  
  // Computed values
  readinessScore: number;
  canLaunch: boolean;
  creatorState: CreatorState;
  
  // Checklist
  checklist: ChecklistItem[];
  launchBlockers: string[];
  
  // Step-specific guidance
  getStepGuidance: (step: number) => StepGuidance;
  
  // Next best action
  primaryAction: CopilotPrimaryAction | null;
  nextBestAction: string;
  urgency: CopilotUrgency;
  
  // Actions
  analyzeDescription: (description: string, title?: string, category?: string) => Promise<void>;
  refreshAdvice: () => void;
}

/**
 * Hook for AI-powered campaign creation assistance
 * Works without a projectId - analyzes form data in real-time
 */
export function useCampaignCopilot(formData: CampaignFormData): UseCampaignCopilotReturn {
  const [descriptionAnalysis, setDescriptionAnalysis] = useState<DescriptionQualityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Analyze description using backend API
  const analyzeDescription = useCallback(async (
    description: string,
    title?: string,
    category?: string,
  ) => {
    if (description.length < 20) {
      setDescriptionAnalysis(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await copilotApi.analyzeDescription(description, title, category);
      setDescriptionAnalysis(result);
    } catch (err) {
      // Fall back to local analysis if API fails
      setDescriptionAnalysis(analyzeDescriptionLocally(description));
      // Don't show error for auth issues - just use local analysis silently
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Debounced description analysis
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (formData.description.length > 20) {
      debounceRef.current = setTimeout(() => {
        analyzeDescription(formData.description, formData.title, formData.category);
      }, 500);
    } else {
      setDescriptionAnalysis(null);
    }
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.description, formData.title, formData.category, analyzeDescription]);
  
  // Build checklist from form data
  const checklist = useMemo((): ChecklistItem[] => {
    const items: ChecklistItem[] = [
      // Step 1: Basic Info
      {
        id: 'title',
        label: 'Campaign title',
        target: CopilotActionTarget.TITLE,
        isComplete: formData.title.trim().length >= 5,
        isRequired: true,
        step: 1,
        message: 'Add a clear, engaging title (at least 5 characters)',
      },
      {
        id: 'description',
        label: 'Description (100+ chars)',
        target: CopilotActionTarget.DESCRIPTION,
        isComplete: formData.description.length >= 100,
        isRequired: true,
        step: 1,
        message: 'Describe your project with problem, solution, and why you need funding',
      },
      {
        id: 'description-quality',
        label: 'Description quality',
        target: CopilotActionTarget.DESCRIPTION,
        isComplete: descriptionAnalysis ? descriptionAnalysis.quality !== 'low' : false,
        isRequired: false,
        step: 1,
        message: 'Include problem statement, target audience, and call to action',
      },
      {
        id: 'category',
        label: 'Category selected',
        target: CopilotActionTarget.CATEGORY,
        isComplete: !!formData.category,
        isRequired: true,
        step: 1,
        message: 'Choose a category to help backers find you',
      },
      
      // Step 2: Funding
      {
        id: 'funding-goal',
        label: 'Funding goal set',
        target: CopilotActionTarget.FUNDING_GOAL,
        isComplete: formData.fundingGoal > 0,
        isRequired: true,
        step: 2,
        message: 'Set a realistic funding goal for your campaign',
      },
      {
        id: 'deadline',
        label: 'Campaign deadline',
        target: CopilotActionTarget.DEADLINE,
        isComplete: !!formData.deadline,
        isRequired: false,
        step: 2,
        message: 'Deadlines create urgency - 30-45 days works best',
      },
      
      // Step 3: Media
      {
        id: 'image',
        label: 'Campaign image',
        target: CopilotActionTarget.IMAGE,
        isComplete: !!formData.imageUrl,
        isRequired: true,
        step: 3,
        message: 'Add images to showcase your project',
      },
      {
        id: 'video',
        label: 'Campaign video',
        target: CopilotActionTarget.VIDEO,
        isComplete: !!formData.videoUrl,
        isRequired: false,
        step: 3,
        message: 'Campaigns with videos raise 3x more on average',
      },
      
      // Optional
      {
        id: 'social',
        label: 'Social links',
        target: CopilotActionTarget.SOCIAL_LINKS,
        isComplete: !!(formData.websiteUrl || formData.twitterUrl),
        isRequired: false,
        step: 1,
        message: 'Add social links to build credibility',
      },
    ];
    
    return items;
  }, [formData, descriptionAnalysis]);
  
  // Calculate readiness score
  const readinessScore = useMemo(() => {
    let score = 0;
    const weights = {
      title: 10,
      description: 20,
      'description-quality': 10,
      category: 5,
      'funding-goal': 20,
      deadline: 5,
      image: 20,
      video: 5,
      social: 5,
    };
    
    checklist.forEach((item) => {
      if (item.isComplete) {
        score += weights[item.id as keyof typeof weights] || 0;
      }
    });
    
    return Math.min(100, score);
  }, [checklist]);
  
  // Launch blockers
  const launchBlockers = useMemo(() => {
    return checklist
      .filter((item) => item.isRequired && !item.isComplete)
      .map((item) => item.message);
  }, [checklist]);
  
  // Can launch
  const canLaunch = launchBlockers.length === 0;
  
  // Creator state (for new campaigns, always drafting)
  const creatorState = useMemo((): CreatorState => {
    if (readinessScore < 20) return CreatorState.IDEA_DEFINED;
    if (readinessScore < 60) return CreatorState.DRAFTING;
    if (readinessScore < 85) return CreatorState.PRE_LAUNCH;
    return CreatorState.READY_TO_LAUNCH;
  }, [readinessScore]);
  
  // Determine primary action
  const primaryAction = useMemo((): CopilotPrimaryAction | null => {
    // Find first incomplete required item, then first incomplete optional
    const incompleteRequired = checklist.find((item) => item.isRequired && !item.isComplete);
    const incompleteOptional = checklist.find((item) => !item.isRequired && !item.isComplete);
    
    const nextItem = incompleteRequired || incompleteOptional;
    
    if (!nextItem) {
      return {
        type: CopilotActionType.CELEBRATE,
        target: CopilotActionTarget.MARKETING,
        message: 'Your campaign is ready! Review and create.',
      };
    }
    
    return {
      type: nextItem.isRequired ? CopilotActionType.EDIT : CopilotActionType.SUGGEST,
      target: nextItem.target,
      message: nextItem.message,
    };
  }, [checklist]);
  
  // Urgency
  const urgency = useMemo((): CopilotUrgency => {
    const incompleteRequired = checklist.filter((item) => item.isRequired && !item.isComplete);
    if (incompleteRequired.length >= 3) return CopilotUrgency.HIGH;
    if (incompleteRequired.length >= 1) return CopilotUrgency.MEDIUM;
    return CopilotUrgency.LOW;
  }, [checklist]);
  
  // Next best action string
  const nextBestAction = primaryAction?.message || 'Your campaign is ready!';
  
  // Step guidance
  const getStepGuidance = useCallback((step: number): StepGuidance => {
    const stepItems = checklist.filter((item) => item.step === step);
    const completedItems = stepItems.filter((item) => item.isComplete);
    const progress = stepItems.length > 0 
      ? Math.round((completedItems.length / stepItems.length) * 100)
      : 0;
    
    const nextIncomplete = stepItems.find((item) => !item.isComplete);
    
    const stepData: Record<number, { title: string; tips: string[] }> = {
      1: {
        title: 'Tell Your Story',
        tips: [
          'Start with the problem you\'re solving',
          'Explain who benefits from your project',
          'Be specific about what makes you unique',
          'End with a clear call to action',
        ],
      },
      2: {
        title: 'Set Your Goals',
        tips: [
          'Start with the minimum you need to succeed',
          'Break down how funds will be used',
          '30-45 day campaigns perform best',
          'You can add stretch goals after launch',
        ],
      },
      3: {
        title: 'Show Your Vision',
        tips: [
          'Use high-quality images that show your project',
          'A personal video introduction builds trust',
          'Show prototypes, mockups, or progress',
          'Before/after images work great',
        ],
      },
    };
    
    const data = stepData[step] || { title: 'Complete Your Campaign', tips: [] };
    
    return {
      step,
      title: data.title,
      currentFocus: nextIncomplete?.message || 'All items complete!',
      tips: data.tips,
      progress,
    };
  }, [checklist]);
  
  // Build full advice object
  const advice = useMemo((): CopilotResponse | null => {
    if (!primaryAction) return null;
    
    const secondaryActions = checklist
      .filter((item) => !item.isComplete && item.id !== checklist.find((i) => !i.isComplete)?.id)
      .slice(0, 3)
      .map((item) => ({ message: item.message, target: item.target }));
    
    return {
      summary: getSummaryForState(creatorState, readinessScore),
      urgency,
      primaryAction,
      secondaryActions,
      canLaunch,
      launchBlockers,
      readinessScore,
      nextBestAction,
      encouragement: getEncouragement(readinessScore),
    };
  }, [primaryAction, checklist, creatorState, readinessScore, urgency, canLaunch, launchBlockers, nextBestAction]);
  
  // Refresh (for future use)
  const refreshAdvice = useCallback(() => {
    if (formData.description.length > 20) {
      analyzeDescription(formData.description, formData.title, formData.category);
    }
  }, [formData, analyzeDescription]);
  
  return {
    advice,
    isLoading,
    error,
    descriptionAnalysis,
    readinessScore,
    canLaunch,
    creatorState,
    checklist,
    launchBlockers,
    getStepGuidance,
    primaryAction,
    nextBestAction,
    urgency,
    analyzeDescription,
    refreshAdvice,
  };
}

// Helper functions

function analyzeDescriptionLocally(description: string): DescriptionQualityResult {
  const wordCount = description.split(/\s+/).filter(Boolean).length;
  const missingElements: string[] = [];
  
  const problemKeywords = ['problem', 'challenge', 'issue', 'need', 'solve', 'struggle'];
  const audienceKeywords = ['for ', 'designed for', 'helps ', 'enables ', 'made for'];
  const diffKeywords = ['unique', 'first', 'only', 'different', 'unlike', 'innovative'];
  const ctaKeywords = ['join', 'support', 'help us', 'back', 'contribute', 'fund'];
  
  const hasProblemClarity = problemKeywords.some((kw) => description.toLowerCase().includes(kw));
  const hasTargetAudience = audienceKeywords.some((kw) => description.toLowerCase().includes(kw));
  const hasDifferentiation = diffKeywords.some((kw) => description.toLowerCase().includes(kw));
  const hasCallToAction = ctaKeywords.some((kw) => description.toLowerCase().includes(kw));
  
  if (!hasProblemClarity) missingElements.push('Problem statement');
  if (!hasTargetAudience) missingElements.push('Target audience');
  if (!hasDifferentiation) missingElements.push('Unique value');
  if (!hasCallToAction) missingElements.push('Call to action');
  
  let score = 0;
  if (wordCount >= 200) score += 25;
  else if (wordCount >= 100) score += 15;
  else if (wordCount >= 50) score += 10;
  
  if (hasProblemClarity) score += 20;
  if (hasTargetAudience) score += 20;
  if (hasDifferentiation) score += 20;
  if (hasCallToAction) score += 15;
  
  let quality: 'low' | 'medium' | 'high';
  if (score >= 75) quality = 'high';
  else if (score >= 45) quality = 'medium';
  else quality = 'low';
  
  return {
    score,
    quality,
    hasProblemClarity,
    hasTargetAudience,
    hasDifferentiation,
    hasCallToAction,
    wordCount,
    missingElements,
    suggestions: getSuggestionsForDescription(score, missingElements),
  };
}

function getSuggestionsForDescription(score: number, missingElements: string[]): string[] {
  const suggestions: string[] = [];
  
  if (missingElements.includes('Problem statement')) {
    suggestions.push('Start by explaining what problem your project solves');
  }
  if (missingElements.includes('Target audience')) {
    suggestions.push('Describe who will benefit from your project');
  }
  if (missingElements.includes('Unique value')) {
    suggestions.push('Explain what makes your approach unique');
  }
  if (missingElements.includes('Call to action')) {
    suggestions.push('End with why backers should support you now');
  }
  
  return suggestions;
}

function getSummaryForState(state: CreatorState, score: number): string {
  switch (state) {
    case CreatorState.IDEA_DEFINED:
      return 'Getting started - add the essential details to your campaign.';
    case CreatorState.DRAFTING:
      return `Making progress! Your campaign is ${score}% complete.`;
    case CreatorState.PRE_LAUNCH:
      return 'Almost there! A few more improvements will boost your success.';
    case CreatorState.READY_TO_LAUNCH:
      return 'Your campaign is ready to launch! 🚀';
    default:
      return 'Keep building your campaign.';
  }
}

function getEncouragement(score: number): string | undefined {
  if (score >= 80) return 'Looking great! Your campaign has all the essentials.';
  if (score >= 60) return 'You\'re making solid progress!';
  if (score >= 40) return 'Keep going - you\'re building something good!';
  return undefined;
}

