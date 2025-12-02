import Image from 'next/image';

export default function SolanaLogo({ className = "h-12 w-auto" }: { className?: string }) {
  // Official Solana logo - following brand guidelines: no shadows, no outlines, no stretching, proper contrast
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/logos/solana-logo.svg"
        alt="Solana"
        width={323}
        height={48}
        className={className}
        priority
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

