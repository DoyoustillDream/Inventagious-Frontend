import Image from 'next/image';

interface LogoProps {
  variant?: 'bulb' | 'animated' | 'main';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 40, height: 40 },
  md: { width: 60, height: 60 },
  lg: { width: 100, height: 100 },
};

const logoMap = {
  bulb: '/logos/logo-bulb.png',
  animated: '/logos/logo-animated.gif',
  main: '/logos/logo-main.jpeg',
};

export default function Logo({ variant = 'bulb', size = 'md', className = '' }: LogoProps) {
  const dimensions = sizeMap[size];
  const logoPath = logoMap[variant];

  if (variant === 'animated') {
    return (
      <Image
        src={logoPath}
        alt="Inventagious Logo"
        width={dimensions.width}
        height={dimensions.height}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={logoPath}
      alt="Inventagious Logo"
      width={dimensions.width}
      height={dimensions.height}
      className={className}
    />
  );
}

