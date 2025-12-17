'use client';

interface HelpResourcesProps {
  compact?: boolean;
}

export default function HelpResources({ compact = false }: HelpResourcesProps) {
  const helpLinks = [
    {
      label: 'How to Connect a Wallet',
      url: '/help/connect-wallet',
      icon: '📚',
    },
    {
      label: 'Wallet Security Tips',
      url: '/help/connect-wallet#security',
      icon: '🔒',
    },
    {
      label: 'Contact Support',
      url: '/support',
      icon: '💬',
    },
  ];

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {helpLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="hand-drawn text-xs font-bold text-blue-600 hover:text-blue-800 underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="browser-window bg-gray-50 border-2 border-gray-400 rounded-lg p-4">
      <h3 className="hand-drawn text-sm font-bold text-black mb-3">
        Need Help?
      </h3>
      <div className="space-y-2">
        {helpLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="flex items-center gap-2 hand-drawn text-sm font-bold text-blue-600 hover:text-blue-800 transition"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

