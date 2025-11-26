import { apiClient } from './client';

export interface ProgramIdsResponse {
  campaignProgramId: string;
  dealEscrowProgramId: string;
  treasuryProgramId: string;
  solanaRpcUrl: string;
  solanaCluster: string;
}

export interface FundingGoalLimits {
  minUsd: number;
  maxUsd: number;
  maxDeadlineDays: number;
}

export const solanaApi = {
  getProgramIds: async (): Promise<ProgramIdsResponse> => {
    return apiClient.get<ProgramIdsResponse>('/solana/program-ids');
  },

  getFundingGoalLimits: async (): Promise<FundingGoalLimits> => {
    return apiClient.get<FundingGoalLimits>('/solana/funding-goal-limits');
  },
};

