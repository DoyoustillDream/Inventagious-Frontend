interface StarProps {
  size?: number;
  className?: string;
}

export default function Star({ size = 20, className = '' }: StarProps) {
  return (
    <span 
      className={`star-decoration ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        fontSize: `${size}px`
      }}
    >
      ✦
    </span>
  );
}

