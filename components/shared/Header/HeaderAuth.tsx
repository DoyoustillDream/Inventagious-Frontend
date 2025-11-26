'use client';

import Link from 'next/link';
import WalletConnect from '@/components/auth/WalletConnect';

export default function HeaderAuth() {
  return (
    <div className="flex items-center gap-3 relative z-10">
      <Link
        href="/projects/create"
        className="inline-block px-4 py-2 text-base font-bold text-white bg-black border-4 border-black rounded-lg hand-drawn transition-all duration-300 hover:bg-yellow-600 hover:border-yellow-700 hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap relative z-10"
      >
        Start a Project
      </Link>
      <div className="relative z-10">
        <WalletConnect />
      </div>
    </div>
  );
}

