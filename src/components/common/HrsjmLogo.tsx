import type React from 'react';

interface HrsjmLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark'; // 'light' on navy backgrounds, 'dark' on light backgrounds
  showWordmark?: boolean;
  title?: string;
  subtitle?: string;
}

export const HrsjmLogo: React.FC<HrsjmLogoProps> = ({
  size = 'md',
  variant = 'light',
  showWordmark = true,
  title = 'HRSJM',
  subtitle = 'Digital Platform Admin',
}) => {
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 52,
  };

  const dim = iconSizes[size];
  const isLight = variant === 'light';

  return (
    <div style={styles.container}>
      {/* Golden Shield & Crest Emblem */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAD465" />
            <stop offset="50%" stopColor="#E9B82E" />
            <stop offset="100%" stopColor="#C9971A" />
          </linearGradient>
          <linearGradient id="innerShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06294D" />
            <stop offset="100%" stopColor="#011F39" />
          </linearGradient>
        </defs>

        {/* Outer Shield with Gold Accent */}
        <path
          d="M50 4L88 18V48C88 74 50 96 50 96C50 96 12 74 12 48V18L50 4Z"
          fill="url(#shieldGrad)"
          stroke="#C9971A"
          strokeWidth="2"
        />

        {/* Inner Shield in Deep Navy */}
        <path
          d="M50 9L82 22V47C82 69 50 88 50 88C50 88 18 69 18 47V22L50 9Z"
          fill="url(#innerShieldGrad)"
        />

        {/* Scales of Justice & Dove / Torch Symbolism */}
        <circle cx="50" cy="34" r="5" fill="#FAD465" />
        <path
          d="M36 42H64M50 34V64M38 64H62"
          stroke="#FAD465"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Balance Pans */}
        <path
          d="M30 48L36 42L42 48"
          stroke="#FAD465"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 54C28 58 44 58 44 54"
          stroke="#FAD465"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M58 48L64 42L70 48"
          stroke="#FAD465"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56 54C56 58 72 58 72 54"
          stroke="#FAD465"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Base Foundation */}
        <rect x="34" y="64" width="32" height="4" rx="2" fill="#FAD465" />
      </svg>

      {showWordmark && (
        <div style={styles.textWrap}>
          <div
            style={{
              ...styles.title,
              color: isLight ? '#FFFFFF' : '#0B2F52',
              fontSize: size === 'sm' ? '15px' : size === 'md' ? '18px' : '22px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              ...styles.subtitle,
              color: isLight ? '#FAD465' : '#174A78',
              fontSize: size === 'sm' ? '10px' : '11px',
            }}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    userSelect: 'none',
  },
  textWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};

