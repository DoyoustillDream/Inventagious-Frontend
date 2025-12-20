/**
 * Creator Copilot API Client
 */
import { apiClient } from '../api/client';
import {
  CopilotResponse,
  CopilotContext,
  CreatorStateInfo,
  DescriptionQualityResult,
  FundingGoalAnalysisResult,
  LaunchReadinessResult,
  PostLaunchDiagnosisResult,
  CopilotMode,
} from './types';

const BASE_URL = '/creator-copilot';

/**
 * Get copilot advice
 */
export async function getCopilotAdvice(
  projectId?: string,
  mode: CopilotMode = CopilotMode.PASSIVE,
): Promise<CopilotResponse> {
  const params = new URLSearchParams();
  if (projectId) params.append('projectId', projectId);
  if (mode) params.append('mode', mode);

  const response = await apiClient.get<CopilotResponse>(
    `${BASE_URL}/advice?${params.toString()}`,
  );
  return response;
}

/**
 * Get full copilot context
 */
export async function getCopilotContext(
  projectId?: string,
): Promise<CopilotContext> {
  const params = projectId ? `?projectId=${projectId}` : '';
  const response = await apiClient.get<CopilotContext>(
    `${BASE_URL}/context${params}`,
  );
  return response;
}

/**
 * Get creator state
 */
export async function getCreatorState(
  projectId?: string,
): Promise<CreatorStateInfo> {
  const params = projectId ? `?projectId=${projectId}` : '';
  const response = await apiClient.get<CreatorStateInfo>(
    `${BASE_URL}/state${params}`,
  );
  return response;
}

/**
 * Analyze description quality
 */
export async function analyzeDescription(
  description: string,
  title?: string,
  category?: string,
): Promise<DescriptionQualityResult> {
  const response = await apiClient.post<DescriptionQualityResult>(
    `${BASE_URL}/analyze-description`,
    { description, title, category },
  );
  return response;
}

/**
 * Check funding goal
 */
export async function checkFundingGoal(
  projectId: string,
): Promise<FundingGoalAnalysisResult> {
  const response = await apiClient.post<FundingGoalAnalysisResult>(
    `${BASE_URL}/check-funding-goal`,
    { projectId },
  );
  return response;
}

/**
 * Check launch readiness
 */
export async function checkLaunchReadiness(
  projectId: string,
): Promise<LaunchReadinessResult> {
  const response = await apiClient.post<LaunchReadinessResult>(
    `${BASE_URL}/check-launch-readiness`,
    { projectId },
  );
  return response;
}

/**
 * Get post-launch diagnosis
 */
export async function getPostLaunchDiagnosis(
  projectId: string,
): Promise<PostLaunchDiagnosisResult> {
  const response = await apiClient.post<PostLaunchDiagnosisResult>(
    `${BASE_URL}/diagnose`,
    { projectId },
  );
  return response;
}

/**
 * Chat with copilot
 */
export async function chatWithCopilot(
  message: string,
  projectId?: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<CopilotResponse> {
  const response = await apiClient.post<CopilotResponse>(
    `${BASE_URL}/chat`,
    { message, projectId, conversationHistory },
  );
  return response;
}

