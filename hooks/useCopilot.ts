'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CopilotResponse,
  CopilotContext,
  CreatorStateInfo,
  DescriptionQualityResult,
  FundingGoalAnalysisResult,
  LaunchReadinessResult,
  PostLaunchDiagnosisResult,
  CopilotMode,
  CopilotUrgency,
  CopilotActionType,
} from '../lib/copilot/types';
import * as copilotApi from '../lib/copilot/api';

interface UseCopilotOptions {
  projectId?: string;
  autoFetch?: boolean;
  mode?: CopilotMode;
}

interface UseCopilotReturn {
  // State
  advice: CopilotResponse | null;
  context: CopilotContext | null;
  creatorState: CreatorStateInfo | null;
  descriptionAnalysis: DescriptionQualityResult | null;
  fundingAnalysis: FundingGoalAnalysisResult | null;
  launchReadiness: LaunchReadinessResult | null;
  diagnosis: PostLaunchDiagnosisResult | null;
  isLoading: boolean;
  error: Error | null;

  // Actions
  fetchAdvice: (projectId?: string, mode?: CopilotMode) => Promise<void>;
  fetchContext: (projectId?: string) => Promise<void>;
  fetchCreatorState: (projectId?: string) => Promise<void>;
  analyzeDescription: (description: string, title?: string, category?: string) => Promise<DescriptionQualityResult>;
  checkFundingGoal: (projectId: string) => Promise<FundingGoalAnalysisResult>;
  checkLaunchReadiness: (projectId: string) => Promise<LaunchReadinessResult>;
  getDiagnosis: (projectId: string) => Promise<PostLaunchDiagnosisResult>;
  chat: (message: string, history?: Array<{ role: 'user' | 'assistant'; content: string }>) => Promise<CopilotResponse>;
  refresh: () => Promise<void>;

  // Computed
  canLaunch: boolean;
  isUrgent: boolean;
  shouldShowWarning: boolean;
  shouldBlock: boolean;
}

/**
 * React hook for Creator Copilot functionality
 */
export function useCopilot(options: UseCopilotOptions = {}): UseCopilotReturn {
  const { projectId: initialProjectId, autoFetch = true, mode = CopilotMode.PASSIVE } = options;

  // State
  const [advice, setAdvice] = useState<CopilotResponse | null>(null);
  const [context, setContext] = useState<CopilotContext | null>(null);
  const [creatorState, setCreatorState] = useState<CreatorStateInfo | null>(null);
  const [descriptionAnalysis, setDescriptionAnalysis] = useState<DescriptionQualityResult | null>(null);
  const [fundingAnalysis, setFundingAnalysis] = useState<FundingGoalAnalysisResult | null>(null);
  const [launchReadiness, setLaunchReadiness] = useState<LaunchReadinessResult | null>(null);
  const [diagnosis, setDiagnosis] = useState<PostLaunchDiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const projectIdRef = useRef(initialProjectId);
  projectIdRef.current = initialProjectId;

  // Fetch advice
  const fetchAdvice = useCallback(async (projectId?: string, fetchMode?: CopilotMode) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.getCopilotAdvice(
        projectId || projectIdRef.current,
        fetchMode || mode,
      );
      setAdvice(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch advice'));
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  // Fetch context
  const fetchContext = useCallback(async (projectId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.getCopilotContext(projectId || projectIdRef.current);
      setContext(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch context'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch creator state
  const fetchCreatorState = useCallback(async (projectId?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.getCreatorState(projectId || projectIdRef.current);
      setCreatorState(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch creator state'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze description
  const analyzeDescription = useCallback(async (
    description: string,
    title?: string,
    category?: string,
  ): Promise<DescriptionQualityResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.analyzeDescription(description, title, category);
      setDescriptionAnalysis(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze description');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check funding goal
  const checkFundingGoal = useCallback(async (projectId: string): Promise<FundingGoalAnalysisResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.checkFundingGoal(projectId);
      setFundingAnalysis(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check funding goal');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check launch readiness
  const checkLaunchReadiness = useCallback(async (projectId: string): Promise<LaunchReadinessResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.checkLaunchReadiness(projectId);
      setLaunchReadiness(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check launch readiness');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get post-launch diagnosis
  const getDiagnosis = useCallback(async (projectId: string): Promise<PostLaunchDiagnosisResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.getPostLaunchDiagnosis(projectId);
      setDiagnosis(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get diagnosis');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chat with copilot
  const chat = useCallback(async (
    message: string,
    history?: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<CopilotResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await copilotApi.chatWithCopilot(
        message,
        projectIdRef.current,
        history,
      );
      setAdvice(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to chat with copilot');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchAdvice(),
      fetchContext(),
      fetchCreatorState(),
    ]);
  }, [fetchAdvice, fetchContext, fetchCreatorState]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAdvice();
    }
  }, [autoFetch, fetchAdvice]);

  // Computed values
  const canLaunch = advice?.canLaunch ?? true;
  const isUrgent = advice?.urgency === CopilotUrgency.HIGH;
  const shouldShowWarning = advice?.primaryAction?.type === CopilotActionType.WARN;
  const shouldBlock = advice?.primaryAction?.type === CopilotActionType.BLOCK;

  return {
    advice,
    context,
    creatorState,
    descriptionAnalysis,
    fundingAnalysis,
    launchReadiness,
    diagnosis,
    isLoading,
    error,
    fetchAdvice,
    fetchContext,
    fetchCreatorState,
    analyzeDescription,
    checkFundingGoal,
    checkLaunchReadiness,
    getDiagnosis,
    chat,
    refresh,
    canLaunch,
    isUrgent,
    shouldShowWarning,
    shouldBlock,
  };
}

/**
 * Hook for reactive copilot (triggers on changes)
 */
export function useReactiveCopilot(
  projectId?: string,
  debounceMs = 500,
) {
  const copilot = useCopilot({ projectId, autoFetch: false, mode: CopilotMode.REACTIVE });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAnalysis = useCallback((type: 'description' | 'funding' | 'readiness', data?: any) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      switch (type) {
        case 'description':
          if (data?.description) {
            await copilot.analyzeDescription(data.description, data.title, data.category);
          }
          break;
        case 'funding':
          if (projectId) {
            await copilot.checkFundingGoal(projectId);
          }
          break;
        case 'readiness':
          if (projectId) {
            await copilot.checkLaunchReadiness(projectId);
          }
          break;
      }
    }, debounceMs);
  }, [copilot, projectId, debounceMs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    ...copilot,
    triggerAnalysis,
  };
}

