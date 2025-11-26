# Frontend Smart Contract Integration

## Overview

This document describes the frontend integration with Solana smart contracts for the Inventagious platform.

## Architecture

The frontend integration follows this flow:

1. **User signs transactions** in their browser wallet (Phantom, Solflare, etc.)
2. **Frontend calls smart contracts** using Anchor
3. **Transaction is confirmed** on-chain
4. **Frontend sends signature to backend** for verification and state sync

## Setup

### Dependencies

The following packages are required (already added to `package.json`):

- `@coral-xyz/anchor`: ^0.30.1
- `@solana/web3.js`: ^1.98.4
- `@solana/wallet-adapter-react`: ^0.15.39
- `@solana/wallet-adapter-react-ui`: ^0.9.39

### Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_CAMPAIGN_PROGRAM_ID=<your_campaign_program_id>
NEXT_PUBLIC_DEAL_ESCROW_PROGRAM_ID=<your_deal_escrow_program_id>
NEXT_PUBLIC_TREASURY_PROGRAM_ID=<your_treasury_program_id>
```

## Integration Points

### 1. Campaign Operations

#### Publishing a Campaign

When a user publishes a crowdfunding project:

1. Frontend calls `useCampaign().initializeCampaign()`
2. User signs the transaction in their wallet
3. Transaction is sent to blockchain
4. Frontend sends signature to backend via `projectsApi.publish()`
5. Backend verifies and syncs state

**Example:**
```typescript
const { initializeCampaign } = useCampaign();

await initializeCampaign(
  projectId,
  fundingGoal,
  deadline
);
```

#### Contributing to a Campaign

When a user contributes:

1. Frontend calls `useCampaign().contribute()`
2. User signs the transaction
3. Transaction is confirmed on-chain
4. Frontend sends signature to backend via `projectsApi.contribute()`
5. Backend verifies and syncs state

**Example:**
```typescript
const { contribute } = useCampaign();

await contribute(
  projectId,
  campaignPda,
  amount
);
```

### 2. Components Updated

#### ProjectSidebar
- Added `ContributeModal` component
- Integrated with `useCampaign` hook
- Shows contribution form with fee breakdown

#### ContributeModal
- New component for handling contributions
- Validates minimum contribution (0.1 SOL)
- Shows fee breakdown
- Handles wallet connection
- Sends transaction to blockchain then backend

## File Structure

```
frontend/lib/solana/
├── program-ids.ts          # Program IDs configuration
├── pda.ts                  # PDA derivation utilities
├── anchor-client.ts         # Anchor client setup
├── campaign.ts              # Campaign program interactions
└── hooks/
    └── useCampaign.ts       # React hook for campaign operations

frontend/components/public/ProjectDetail/
├── ProjectSidebar.tsx       # Updated with contribute button
└── ContributeModal.tsx      # New contribution modal
```

## Usage Examples

### Contributing to a Campaign

```typescript
import { useCampaign } from '@/lib/solana/hooks/useCampaign';
import { useWallet } from '@solana/wallet-adapter-react';

function ContributeButton({ projectId, campaignPda }) {
  const { contribute, isLoading } = useCampaign();
  const { connected } = useWallet();

  const handleContribute = async () => {
    if (!connected) {
      // Show wallet connect modal
      return;
    }

    try {
      await contribute(projectId, campaignPda, 1.0); // 1 SOL
      alert('Contribution successful!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <button onClick={handleContribute} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Contribute'}
    </button>
  );
}
```

### Publishing a Campaign

```typescript
import { useCampaign } from '@/lib/solana/hooks/useCampaign';

function PublishButton({ projectId, fundingGoal, deadline }) {
  const { initializeCampaign, isLoading } = useCampaign();

  const handlePublish = async () => {
    try {
      const { signature, campaignPda } = await initializeCampaign(
        projectId,
        fundingGoal,
        deadline
      );
      
      console.log('Campaign initialized:', campaignPda);
      console.log('Transaction:', signature);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <button onClick={handlePublish} disabled={isLoading}>
      {isLoading ? 'Publishing...' : 'Publish Campaign'}
    </button>
  );
}
```

## Transaction Flow

### Contribution Flow

```
1. User clicks "Contribute" button
   ↓
2. ContributeModal opens
   ↓
3. User enters amount
   ↓
4. User clicks "Contribute" (if wallet not connected, shows connect modal)
   ↓
5. Frontend builds transaction using Anchor
   ↓
6. User signs transaction in wallet
   ↓
7. Transaction sent to Solana network
   ↓
8. Wait for confirmation
   ↓
9. Frontend sends signature to backend API
   ↓
10. Backend verifies transaction and syncs database
   ↓
11. UI updates with new contribution data
```

## Error Handling

The integration includes comprehensive error handling:

- **Wallet not connected**: Shows wallet connect modal
- **Insufficient balance**: Shows error message
- **Transaction failed**: Shows error with details
- **Network errors**: Graceful fallback

## Fee Calculation

The platform fee is calculated as:
- **1.9% per 0.1 SOL increment**
- Formula: `fee = amount × 1.9% × ceil(amount / 0.1 SOL)`

Example:
- 0.5 SOL contribution: `0.5 × 0.019 × ceil(0.5 / 0.1) = 0.5 × 0.019 × 5 = 0.0475 SOL`
- Net amount: `0.5 - 0.0475 = 0.4525 SOL`

## Minimum Amounts

- **Campaign Contribution**: 0.1 SOL minimum
- **Deal Amount**: 10 SOL minimum

## IDL Loading

The frontend loads IDL (Interface Definition Language) files in two ways:

1. **From Chain** (current implementation): Fetches IDL from the deployed program
2. **From Static Files** (recommended for production): Load IDL from `public/idl/` directory

To use static IDL files:

1. Copy IDL files from `sc/target/idl/` to `frontend/public/idl/`
2. Update `anchor-client.ts` to load from static files

## Testing

### Local Development

1. Deploy programs to localnet:
   ```bash
   cd sc
   anchor build
   anchor deploy
   ```

2. Update `.env.local` with local program IDs

3. Start frontend:
   ```bash
   cd frontend
   yarn dev
   ```

### Testnet

1. Deploy programs to devnet
2. Update `.env.local` with devnet program IDs
3. Test with devnet wallets

## Security Considerations

1. **Never expose private keys** - All signing happens in user's wallet
2. **Verify transactions** - Backend verifies all transactions before updating database
3. **Validate amounts** - Frontend validates minimum amounts before building transactions
4. **Error messages** - Don't expose sensitive information in error messages
5. **Transaction confirmation** - Always wait for transaction confirmation before updating UI

## Next Steps

1. ✅ Core integration services created
2. ✅ Campaign contribution flow implemented
3. ⚠️ Campaign publish flow (needs integration in publish button)
4. ⚠️ Deal operations integration
5. ⚠️ Add IDL files to public directory
6. ⚠️ Add transaction status tracking
7. ⚠️ Add error recovery mechanisms

## Notes

- **User Signatures Required**: All transactions require user wallet signatures
- **Backend Verification**: Backend verifies transactions after confirmation
- **State Sync**: Frontend and backend sync state after transactions
- **IDL Loading**: Currently loads from chain; should use static files in production

