interface SwirlProps {
  size?: number;
  className?: string;
}

export default function Swirl({ size = 30, className = '' }: SwirlProps) {
  return (
    <span 
      className={`swirl-decoration ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`
      }}
    />
  );
}

