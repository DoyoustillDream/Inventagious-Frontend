/**
 * Creator Copilot Types
 * Frontend type definitions matching backend interfaces
 */

// Creator states
export enum CreatorState {
  ONBOARDING = 'ONBOARDING',
  IDEA_DEFINED = 'IDEA_DEFINED',
  DRAFTING = 'DRAFTING',
  PRE_LAUNCH = 'PRE_LAUNCH',
  READY_TO_LAUNCH = 'READY_TO_LAUNCH',
  LAUNCHED = 'LAUNCHED',
  STALLED = 'STALLED',
  GROWING = 'GROWING',
  FAILED = 'FAILED',
  FUNDED = 'FUNDED',
  COMPLETED = 'COMPLETED',
}

export enum CreatorExperienceLevel {
  FIRST_TIME = 'first-time',
  RETURNING = 'returning',
  EXPERIENCED = 'experienced',
}

export enum CopilotUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum CopilotActionType {
  EDIT = 'edit',
  WARN = 'warn',
  BLOCK = 'block',
  SUGGEST = 'suggest',
  CELEBRATE = 'celebrate',
}

export enum CopilotActionTarget {
  DESCRIPTION = 'description',
  FUNDING_GOAL = 'funding_goal',
  VIDEO = 'video',
  IMAGE = 'image',
  PROFILE = 'profile',
  DEADLINE = 'deadline',
  MILESTONES = 'milestones',
  SOCIAL_LINKS = 'social_links',
  CATEGORY = 'category',
  TITLE = 'title',
  MARKETING = 'marketing',
  BACKERS = 'backers',
}

export enum CopilotMode {
  PASSIVE = 'passive',
  REACTIVE = 'reactive',
  CONVERSATIONAL = 'conversational',
}

// Context types
export interface CopilotUserContext {
  id: string;
  role: 'creator' | 'backer' | 'investor';
  experienceLevel: CreatorExperienceLevel;
  followers: number;
  projectsCreated: number;
  projectsFunded: number;
  joinedDaysAgo: number;
  profileCompleteness: number;
  hasProfileImage: boolean;
  hasProfileVideo: boolean;
}

export interface CopilotProjectContext {
  id: string;
  title: string;
  category: string | null;
  type: 'crowdfunding' | 'private_funding';
  status: string;
  readinessScore: number;
  hasVideo: boolean;
  hasImages: boolean;
  imageCount: number;
  descriptionLength: number;
  descriptionQuality: 'low' | 'medium' | 'high';
  hasMilestones: boolean;
  milestoneCount: number;
  hasSocialLinks: boolean;
  socialLinksCount: number;
  hasDeadline: boolean;
  daysUntilDeadline: number | null;
  daysSinceCreated: number;
}

export interface CopilotCampaignContext {
  goalSOL: number;
  goalUSD: number;
  avgCategoryGoalSOL: number;
  avgCategoryGoalUSD: number;
  currentAmountSOL: number;
  currentAmountUSD: number;
  percentFunded: number;
  status: string;
  daysSinceCreated: number;
  daysRemaining: number | null;
  backersCount: number;
  avgBackersInCategory: number;
  isGoalRealistic: boolean;
}

export interface CopilotAnalyticsContext {
  profileViews: number;
  projectViews: number;
  projectViewsLast7Days: number;
  follows: number;
  shares: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface CopilotPlatformContext {
  categoryAverages: {
    fundingGoal: number;
    backersCount: number;
    successRate: number;
    avgContribution: number;
  };
  platformAverages: {
    fundingGoal: number;
    backersCount: number;
    successRate: number;
    avgContribution: number;
  };
}

export interface CopilotContext {
  user: CopilotUserContext;
  project: CopilotProjectContext | null;
  campaign: CopilotCampaignContext | null;
  analytics: CopilotAnalyticsContext;
  platform: CopilotPlatformContext;
  creatorState: CreatorState;
  mode: CopilotMode;
  timestamp: string;
}

// Response types
export interface CopilotPrimaryAction {
  type: CopilotActionType;
  target: CopilotActionTarget;
  message: string;
  metadata?: Record<string, any>;
}

export interface CopilotSecondaryAction {
  message: string;
  target?: CopilotActionTarget;
  priority?: number;
}

export interface CopilotResponse {
  summary: string;
  urgency: CopilotUrgency;
  primaryAction: CopilotPrimaryAction;
  secondaryActions?: CopilotSecondaryAction[];
  canLaunch: boolean;
  launchBlockers?: string[];
  readinessScore: number;
  nextBestAction: string;
  encouragement?: string;
}

// Skill-specific types
export interface DescriptionQualityResult {
  score: number;
  quality: 'low' | 'medium' | 'high';
  hasProblemClarity: boolean;
  hasTargetAudience: boolean;
  hasDifferentiation: boolean;
  hasCallToAction: boolean;
  wordCount: number;
  missingElements: string[];
  suggestions: string[];
}

export interface FundingGoalAnalysisResult {
  isRealistic: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  categoryAverage: number;
  percentAboveAverage: number;
  recommendedRange: {
    min: number;
    max: number;
  };
  reasoning: string;
  suggestions: string[];
}

export interface LaunchBlocker {
  id: string;
  target: CopilotActionTarget;
  message: string;
  severity: 'critical' | 'major';
  howToFix: string;
}

export interface LaunchWarning {
  id: string;
  target: CopilotActionTarget;
  message: string;
  impact: string;
  howToFix: string;
}

export interface LaunchReadinessResult {
  isReady: boolean;
  score: number;
  blockers: LaunchBlocker[];
  warnings: LaunchWarning[];
  suggestions: string[];
  estimatedSuccessChance: number;
}

export interface PostLaunchDiagnosisResult {
  status: 'on-track' | 'needs-attention' | 'critical';
  daysRemaining: number;
  fundingVelocity: number;
  projectedOutcome: 'funded' | 'underfunded' | 'uncertain';
  issuesIdentified: string[];
  todayAction: string;
  suggestions: string[];
}

export interface CreatorStateInfo {
  state: CreatorState;
  experienceLevel: CreatorExperienceLevel;
}

